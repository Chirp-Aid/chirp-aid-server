import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/createRoom.dto';
import { SendMessageDto } from './dto/sendMessage.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
    allowedHeaders: ['x-user-id'],
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // 클라이언트 목록을 관리하는 Map
  private connectedClients: Map<string, Socket> = new Map();
  private rooms: Map<string, Socket[]> = new Map();

  constructor(private readonly chatService: ChatService) {}

  afterInit() {
    console.log('WebSocket 서버 초기화');
  }

  handleConnection(client: Socket) {
    // 클라이언트의 고유 사용자 ID 가져오기 (예: 핸드쉐이크에서 userId 전달)
    const userId = client.handshake.headers['x-user-id'] as string;

    if (!userId) {
      console.log('사용자 ID를 찾을 수 없음');
      client.disconnect();
      return;
    }

    // 중복 연결 확인
    if (this.connectedClients.has(userId)) {
      console.log(`중복 연결 시도 차단: ${userId}`);
      client.disconnect();
      return;
    }

    // 클라이언트 연결 등록
    this.connectedClients.set(userId, client);
    console.log(`클라이언트 연결됨: ${userId}`);
  }

  handleDisconnect(client: Socket) {
    // 클라이언트의 고유 사용자 ID 가져오기
    const userId = client.handshake.headers['x-user-id'] as string;

    if (userId && this.connectedClients.has(userId)) {
      // 연결 해제된 클라이언트 제거
      this.connectedClients.delete(userId);
      console.log(`클라이언트 연결 끊김: ${userId}`);
    } else {
      console.log('연결된 클라이언트를 찾을 수 없음');
    }
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(client: Socket, createRoomDto: CreateRoomDto) {
    const room = await this.chatService.findOrCreateRoom(createRoomDto);
    this.rooms.set(room.chat_room_id, [
      ...(this.rooms.get(room.chat_room_id) || []),
      client,
    ]);
    client.join(room.chat_room_id);
    console.log(`새 대화방 생성: ${room.chat_room_id}`);
    client.emit('createRoom', room);
    return room;
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, sendMessageDto: SendMessageDto) {
    const { join_room: joinRoom } = JSON.parse(sendMessageDto.toString());
    const message = await this.chatService.sendMessage(
      JSON.stringify(sendMessageDto),
    );
    console.log(`메시지 전송: ${message.content}`);
    if (this.rooms.has(joinRoom)) {
      this.rooms.get(joinRoom)?.forEach((cl) => {
        cl.emit('newMessage', message);
      });
    }
    return message;
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, id: string) {
    console.log(id);
    const { room_id: roomId } = JSON.parse(id);
    // 이미 접속한 방이면 무시
    if (client.rooms.has(roomId)) {
      return;
    }
    const room = await this.chatService.findRoomById(roomId);
    if (room) {
      this.rooms.set(roomId, [...(this.rooms.get(roomId) || []), client]);
      client.join(roomId);
      console.log('방 참가');
      const messages = await this.chatService.getMessages(roomId);
      console.log(messages);
      client.emit(
        'roomMessages',
        messages.sort((a: any, b: any) => a.created_at - b.created_at),
      );
    }
    console.log(`대화방 입장: ${room}`);
    console.log(`현재 참가자: ${this.rooms.get(roomId)}`);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: Socket, id: string) {
    const { room_id: roomId } = JSON.parse(id);
    client.leave(roomId);
    this.rooms.set(
      roomId,
      this.rooms.get(roomId)?.filter((cl) => cl !== client),
    );
    if (this.rooms.get(roomId)?.length === 0) {
      this.rooms.delete(roomId);
    }
    console.log(`대화방 퇴장: ${roomId}`);
    console.log(`현재 참가자: ${this.rooms.get(roomId)}`);
  }
}

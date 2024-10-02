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
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // 클라이언트 목록을 관리하는 Map
  private connectedClients: Map<string, Socket> = new Map();
  private rooms: Map<string, string[]> = new Map();

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    console.log('WebSocket 서버 초기화');
  }

  handleConnection(client: Socket) {
    if (this.connectedClients.has(client.id)) {
      console.log(`중복 연결 시도 차단: ${client.id}`);
      return;
    }

    // 클라이언트 연결 등록
    this.connectedClients.set(client.id, client);
    console.log(`클라이언트 연결됨: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`클라이언트 연결 끊김: ${client.id}`);
    // 연결 해제된 클라이언트 제거
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(client: Socket, createRoomDto: CreateRoomDto) {
    const room = await this.chatService.findOrCreateRoom(createRoomDto);
    this.rooms.set(room.chat_room_id, [
      ...(this.rooms.get(room.chat_room_id) || []),
      client.id,
    ]);
    client.join(room.chat_room_id);
    console.log(`새 대화방 생성: ${room.chat_room_id}`);
    return room;
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, sendMessageDto: SendMessageDto) {
    console.log(sendMessageDto);
    const message = await this.chatService.sendMessage(
      JSON.stringify(sendMessageDto),
    );
    console.log(`메시지 전송: ${message.content}`);
    if (this.rooms.has(sendMessageDto.join_room)) {
      this.rooms.get(sendMessageDto.join_room)?.forEach((id) => {
        if (id !== client.id) {
          this.connectedClients.get(id)?.emit('newMessage', message);
        }
      });
    }
    client.emit('newMessage', message);
    return message;
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, roomId: string) {
    // 이미 접속한 방이면 무시
    if (client.rooms.has(roomId)) {
      return;
    }
    const room = await this.chatService.findRoomById(roomId);
    if (room) {
      this.rooms.set(roomId, [...(this.rooms.get(roomId) || []), client.id]);
      client.join(roomId);
      console.log('방 참가');
      const messages = (await this.chatService.getMessages(roomId)).map(
        (message) =>
          message.isRead === false ? { ...message, isRead: true } : message,
      );
      client.emit('roomMessages', messages);
    }
    console.log(`대화방 입장: ${room}`);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: Socket, roomId: string) {
    client.leave(roomId);
    this.rooms.set(
      roomId,
      this.rooms.get(roomId)?.filter((id) => id !== client.id),
    );
    if (this.rooms.get(roomId)?.length === 0) {
      this.rooms.delete(roomId);
    }
    console.log(`대화방 퇴장: ${roomId}`);
  }
}

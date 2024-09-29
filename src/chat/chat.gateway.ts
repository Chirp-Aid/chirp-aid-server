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
import { Body } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    console.log('WebSocket 서버 초기화');
  }

  handleConnection(client: Socket) {
    console.log(`클라이언트 연결됨: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`클라이언트 연결 끊김: ${client.id}`);
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(client: Socket, createRoomDto: CreateRoomDto) {
    const room = await this.chatService.findOrCreateRoom(createRoomDto);
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
    this.server.to(sendMessageDto.join_room).emit('newMessage', message);
    console.log(`메시지 전송: ${message.content}`);
    return message;
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, roomId: string) {
    const room = await this.chatService.findRoomById(roomId);
    if (room) {
      client.join(roomId);
      console.log('방 참가');
      const messages = await this.chatService.getMessages(roomId);
      client.emit('roomMessages', messages);
    }
    console.log(`대화방 입장: ${room}`);
  }
}

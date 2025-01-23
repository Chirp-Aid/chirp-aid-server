import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatsService } from './chats.service';
import { Message } from 'src/entities/message.entity';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('chats')
@ApiTags('chats')
@UseGuards(AuthGuard('access'))
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get('/rooms')
  @ApiOperation({
    summary: '모든 채팅방 조회',
    description: '존재하는 모든 채팅방을 조회합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`} Example",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      type: 'array',
      example: [
        {
          chat_room_id: '437e015f-f584-4b88-bab1-8e45209ec4dc',
          user: {
            user_id: '080c7dc0-7eed-11ef-8310-09489e88db41',
            name: '황용진',
            email: 'dswvgw1234@gmail.com',
            age: 5,
            sex: 'm',
            nickname: 'oko_jin',
            region: '뉴욕',
            phone_number: '01033288164',
            profile_photo: '사진 url',
          },
          orphanage_user: {
            orphanage_user_id: '68882a60-7efb-11ef-9912-f5e9b51a2448',
            name: '다조핑',
            email: 'dazo1578@gmail.com',
          },
          orphanage_name: 'Hope Orphanage', // orphanage_name 추가
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getAllChatRooms(): Promise<ChatRoomWithOrphanageName[]> {
    return await this.chatsService.getAllChatRooms();
  }

  @Get('/messages')
  @ApiOperation({
    summary: '모든 메시지 조회',
    description: '존재하는 모든 메시지를 조회합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`} Example",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      type: 'array',
      example: [
        {
          message_id: '437e015f-f584-4b88-bab1-8e45209ec4dc',
          sender: '080c7dc0-7',
          type: 'USER',
          content: '안녕하세요',
          isRead: false,
          created_at: '2021-07-20T00:00:00',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getAllMessages(): Promise<Message[]> {
    return await this.chatsService.getAllMessages();
  }

  @Get('/rooms/user')
  @ApiOperation({
    summary: '일반 사용자 ID 기반 모든 채팅방 조회',
    description:
      '해당 일반 사용자가 참여 중인 채팅방을 최신 메시지 순으로 조회합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`} Example",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      type: 'array',
      example: [
        {
          chat_room_id: '437e015f-f584-4b88-bab1-8e45209ec4dc',
          user: {
            user_id: '080c7dc0-7eed-11ef-8310-09489e88db41',
            name: '황용진',
            email: 'dswvgw1234@gmail.com',
            age: 5,
            sex: 'm',
            nickname: 'oko_jin',
            region: '뉴욕',
            phone_number: '01033288164',
            profile_photo: '사진 url',
          },
          orphanage_user: {
            orphanage_user_id: '68882a60-7efb-11ef-9912-f5e9b51a2448',
            name: '다조핑',
            email: 'dazo1578@gmail.com',
          },
          orphanage_name: 'Hope Orphanage', // orphanage_name 추가
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getChatRoomsByUser(
    @Request() req,
  ): Promise<ChatRoomWithOrphanageName[]> {
    const userId = req.user.user_id;
    return await this.chatsService.getChatRoomsByUser(userId);
  }

  @Get('/rooms/orphanage-user')
  @ApiOperation({
    summary: '보육원 사용자 ID 기반 모든 채팅방 조회',
    description:
      '해당 보육원 사용자가 참여 중인 채팅방을 최신 메시지 순으로 조회합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`} Example",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      type: 'array',
      example: [
        {
          chat_room_id: '437e015f-f584-4b88-bab1-8e45209ec4dc',
          user: {
            user_id: '080c7dc0-7eed-11ef-8310-09489e88db41',
            name: '황용진',
            email: 'dswvgw1234@gmail.com',
            age: 5,
            sex: 'm',
            nickname: 'oko_jin',
            region: '뉴욕',
            phone_number: '01033288164',
            profile_photo: '사진 url',
          },
          orphanage_user: {
            orphanage_user_id: '68882a60-7efb-11ef-9912-f5e9b51a2448',
            name: '다조핑',
            email: 'dazo1578@gmail.com',
          },
          orphanage_name: 'Hope Orphanage', // orphanage_name 추가
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getChatRoomsByOrphanageUser(
    @Request() req,
  ): Promise<ChatRoomWithOrphanageName[]> {
    const orphanageUserId = req.user.user_id;
    return await this.chatsService.getChatRoomsByOrphanageUser(orphanageUserId);
  }

  @Get('/messages/room/:id')
  @ApiOperation({
    summary: '현재 채팅방 내 모든 메시지 조회',
    description: '특정 채팅방 ID에 포함된 모든 메시지를 조회합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: "Bearer {`user's Access Token`} Example",
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      type: 'array',
      example: [
        {
          message_id: '437e015f-f584-4b88-bab1-8e45209ec4dc',
          sender: '080c7dc0-7',
          type: 'USER',
          content: '안녕하세요',
          isRead: false,
          created_at: '2021-07-20T00:00:00',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getMessagesByRoom(@Param('id') id: string): Promise<Message[]> {
    return await this.chatsService.getMessagesByRoom(id);
  }
}

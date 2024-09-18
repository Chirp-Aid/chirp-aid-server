import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'src/entities/request.entity';
import { AdminBoardService } from './admin-board.service';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { Review } from 'src/entities/review.entity';

@Controller('admin/board')
@UseGuards(AuthGuard('access'), RolesGuard)
export class AdminBoardController {
  constructor(private readonly adminBoardService: AdminBoardService) {}
  @Get('/request')
  @Roles('admin')
  async getAllRequest(): Promise<Request[]> {
    return await this.adminBoardService.findAllRequest();
  }

  @Get('/request/:id')
  @Roles('admin')
  async getOneRequest(@Param('id') requestId: number): Promise<Request> {
    return await this.adminBoardService.findRequestById(requestId);
  }

  @Delete('/request/:id')
  @Roles('admin')
  async deleteRequest(@Param('id') requestId: number): Promise<void> {
    return await this.adminBoardService.deleteRequestById(requestId);
  }

  @Get('/post')
  @Roles('admin')
  async getAllPost(): Promise<Review[]> {
    return await this.adminBoardService.findAllPost();
  }

  @Get('/post/:id')
  @Roles('admin')
  async getOnePost(@Param('id') postId: number): Promise<Review> {
    return await this.adminBoardService.findPostById(postId);
  }

  @Get('/post')
  @Roles('admin')
  async searchReviewsByTitle(@Query('title') title: string): Promise<Review[]> {
    return await this.adminBoardService.findPostByTitle(title);
  }

  @Delete('/post/:id')
  @Roles('admin')
  async deletePost(@Param('id') postId: number) {
    return await this.adminBoardService.deletePostById(postId);
  }
}

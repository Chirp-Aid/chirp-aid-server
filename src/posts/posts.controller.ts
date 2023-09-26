import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard('access'))
  createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    const userId = req.user.user_id;
    return this.postsService.createPost(createPostDto, userId);
  }

  @Get('/tags')
  @UseGuards(AuthGuard('access'))
  getTags(@Request() req) {
    const userId = req.user.user_id;
    return this.postsService.getTags(userId);
  }
}

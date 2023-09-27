import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly postsService: PostsService,
    ) {}

  @Post()
  @UseGuards(AuthGuard('access'))
  createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    const userId = req.user.user_id;
    return this.reviewService.createPost(createPostDto, userId);
  }

  @Get('/tags')
  @UseGuards(AuthGuard('access'))
  getTags(@Request() req) {
    const userId = req.user.user_id;
    return this.reviewService.getTags(userId);
  }



  @Get()
  getAllPosts(){
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getOnePost(@Param('id', ParseIntPipe) id:number){
    return this.postsService.getOnePost(id)
  }

}

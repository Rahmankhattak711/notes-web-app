import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/config/auth.guard';
import { CreatePostDto, UpdatePostDto } from './dto/create.post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createPost(@Body() CreatePostDto: CreatePostDto, @Req() req) {
    return this.postService.create(CreatePostDto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Put(':postId')
  async updatePost(
    @Body() UpdatePostDto: UpdatePostDto,
    @Param('postId') postId: string,
    @Req() req,
  ) {
    return this.postService.updatePostById(UpdatePostDto, req.user.id, postId);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:postId')
  async deletePost(@Param('postId') postId: string, @Req() req) {
    return this.postService.deletePostById(req.user.id, postId);
  }

  @UseGuards(AuthGuard)
  @Get('all')
  async getAllPosts(@Req() req) {
    return this.postService.getAllPosts();
  }
}

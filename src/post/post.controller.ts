import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/config/auth.guard';
import { CreatePostDto } from './dto/create.post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createPost(@Body() CreatePostDto: CreatePostDto, @Req() req) {
    return this.postService.create(CreatePostDto, req.user.id);
  }
}

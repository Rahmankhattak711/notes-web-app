import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create.post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePostDto, userID: string) {

    const newPost = await this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        published: dto.published ?? false,
        authorId: userID,
      },
    });

    return {
      message: 'Post created successfully',
      post: newPost,
    };
  }
}

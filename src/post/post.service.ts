import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto/create.post.dto';

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

  async updatePostById(UpdatePostDto: UpdatePostDto, userId, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this post',
      );
    }

    const updatePost = await this.prisma.post.update({
      where: { id: postId },
      data: {
        title: UpdatePostDto.title,
        content: UpdatePostDto.content,
        published: UpdatePostDto.published ?? false,
      },
    });

    return {
      message: 'Post updated successfully',
      post: updatePost,
    };
  }

  async deletePostById(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this post',
      );
    }

    const deleteMany = await this.prisma.post.delete({
      where: { id: postId },
    });

    return {
      message: 'Post deleted successfully',
      post: deleteMany,
    };
  }

  async getAllPosts() {
    const posts = await this.prisma.post.findMany();
    return {
      message: 'Posts retrieved successfully',
      posts: posts,
    };
  }
}

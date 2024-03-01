import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../prisma.service';
import { Comment as CommentModel } from '@prisma/client';
import { User } from 'src/common/user';

@Injectable()
export class CommentService {

  constructor(private readonly prismaService: PrismaService) {}

  create(createCommentDto: CreateCommentDto, user: User) {
    const { id:authorId, teamId } = user;
    return this.prismaService.comment.create({ data: {
      ...createCommentDto,
      authorId,
      teamId
    } });
  }

  findAll(taskId: string) {
    return this.prismaService.comment.findMany({ where: { taskId } });
  }

  findOne(id: string) {
    return this.prismaService.comment.findUnique({ where: { id } });
  }

  update(id: string, updateCommentDto: UpdateCommentDto) {
    return this.prismaService.comment.update({ where: { id }, data: updateCommentDto });
  }

  remove(id: string) {
    return this.prismaService.comment.delete({ where: { id } });
  }
}

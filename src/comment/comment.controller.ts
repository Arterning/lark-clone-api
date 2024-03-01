import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/common/user';

@Controller('comment')
@UseGuards(AuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Request() request, @Body() createCommentDto: CreateCommentDto) {
    const user = request.user as User;
    return this.commentService.create(createCommentDto, user);
  }

  @Get()
  findByTask(@Request() request, @Body('taskId') taskId: string) {
    const user = request.user as User;
    return this.commentService.findAll(taskId);
  }

  @Get(':id')
  findOne(@Request() request, @Param('id') id: string) {
    const user = request.user as User;
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  update(@Request() request, @Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    const user = request.user as User;
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Request() request, @Param('id') id: string) {
    const user = request.user as User;
    return this.commentService.remove(id);
  }
}

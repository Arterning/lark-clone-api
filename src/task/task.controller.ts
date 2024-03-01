import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/common/user';

@Controller('task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /**
   * 创建任务
   * @param createTaskDto
   * @returns
   */
  @Post()
  create(@Request() request, @Body() createTaskDto: CreateTaskDto) {
    const user = request.user as User;
    return this.taskService.create(createTaskDto, user);
  }

  /**
   * 创建子任务
   */
  @Post()
  createSubTask(@Request() request, @Body() createTaskDto: CreateTaskDto) {
    const user = request.user as User;
    return this.taskService.createSubTask(createTaskDto, user);
  }

  /**
   * 自己负责的任务
   * @returns
   */
  @Get('/owned-tasks')
  findOwnedTasks(@Request() request) {
    const user = request.user as User;
    return this.taskService.findOwnedTasks(user);
  }

  /**
   * 自己有在关注的任务
   */
  @Get('/watched-tasks')
  findWatchedTasks(@Request() request) {
    const user = request.user as User;
    return this.taskService.findWatchedTasks(user);
  }

  /**
   * 全部的任务
   * @returns
   */
  @Get()
  findAll(@Request() request) {
    const user = request.user as User;
    return this.taskService.findAll(user);
  }

  /**
   * 自己创建的任务
   */
  @Get('/created-tasks')
  findCreatedTasks(@Request() request) {
    const user = request.user as User;
    return this.taskService.findCreatedTasks(user);
  }

  /**
   * 自己分配的任务
   */
  @Get('assigned-tasks')
  findAssignedTasks(@Request() request) {
    const user = request.user as User;
    return this.taskService.findAssignedTasks(user);
  }

  /**
   * 已经完成的任务
   */
  @Get('finished-tasks')
  findFinishedTasks(@Request() request) {
    const user = request.user as User;
    return this.taskService.findFinishedTasks(user);
  }

  /**
   * 关注某个任务
   * @param taskId
   * @returns
   */
  @Post('watch-task')
  watchTask(@Request() request, @Body('taskId') taskId: string) {
    const user = request.user as User;
    return this.taskService.watchTask(taskId, user);
  }

  @Get(':id')
  findOne(@Request() request, @Param('id') id: string) {
    const user = request.user as User;
    return this.taskService.findOne(id, user);
  }

  @Patch(':id')
  update(@Request() request, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const user = request.user as User;
    return this.taskService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  remove(@Request() request, @Param('id') id: string) {
    const user = request.user as User;
    return this.taskService.remove(id, user);
  }
}

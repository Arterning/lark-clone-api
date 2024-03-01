import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma.service';
import { Task as TaskModel } from '@prisma/client';
import { AuditService } from 'src/audit/audit.service';
import { ACTION, ENTITY_TYPE } from '@prisma/client';
import { User } from 'src/common/user';

@Injectable()
export class TaskService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<TaskModel> {
    const { id: authorId, teamId, name } = user;

    const task = await this.prismaService.task.create({
      data: { ...createTaskDto, authorId, teamId },
    });

    await this.auditService.create({
      entityType: ENTITY_TYPE.TASK,
      action: ACTION.CREATE,
      teamId,
      userId: authorId,
      userName: name,
      entityId: task.id,
      entityTitle: task.title,
    });

    return task;
  }

  /**
   * 创建子任务
   * @param createTaskDto
   * @returns
   */
  async createSubTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<TaskModel> {
    const { id: authorId, teamId, name } = user;

    const task = await this.prismaService.task.create({
      data: { ...createTaskDto, authorId, teamId },
    });

    await this.auditService.create({
      entityType: ENTITY_TYPE.TASK,
      action: ACTION.CREATE,
      teamId,
      userId: authorId,
      userName: name,
      entityId: task.id,
      entityTitle: task.title,
    });

    return task;
  }

  /**
   * 自己负责的任务
   * @returns
   */
  findOwnedTasks(user: User) {
    const { id: assigneeId } = user;
    return this.prismaService.task.findMany({
      where: { assigneeId },
    });
  }

  /**
   * 自己有在关注的任务
   * @returns
   */
  async findWatchedTasks(user: User) {
    const { id: userId } = user;
    const userWatchTasks = await this.prismaService.userWatchTask.findMany({
      where: { userId },
    });

    const taskIds = userWatchTasks.map((item) => item.taskId);
    return this.prismaService.task.findMany({
      where: { id: { in: taskIds } },
    });
  }

  /**
   * 自己创建的任务
   */
  async findCreatedTasks(user: User) {
    const { id: authorId } = user;
    return this.prismaService.task.findMany({
      where: { authorId },
    });
  }

  /**
   * 自己分配的任务
   * @returns
   */
  async findAssignedTasks(user: User) {
    const { id: authorId } = user;
    return this.prismaService.task.findMany({
      where: {
        authorId,
        assigneeId: {
          not: null,
        },
      },
    });
  }

  /**
   * 全部的任务
   * @returns
   */
  findAll(user: User) {
    return this.prismaService.task.findMany({
      where: {
        authorId: user.id,
      },
    });
  }

  /**
   * 已经完成的任务
   */
  findFinishedTasks(user: User) {
    const { id: authorId } = user;
    return this.prismaService.task.findMany({
      where: { authorId, finished: true },
    });
  }

  /**
   * 查找一个任务
   * @param id 
   * @param user 
   * @returns 
   */
  findOne(id: string, user: User) {
    const { id: authorId } = user;
    return this.prismaService.task.findUnique({ where: { id, authorId } });
  }

  /**
   * 关注某个任务
   * @param taskId
   * @returns
   */
  watchTask(taskId: string, user: User) {
    const { id: userId } = user;
    return this.prismaService.userWatchTask.create({
      data: {
        taskId,
        userId
      },
    });
  }

  /**
   * 更新任务
   * @param id 
   * @param updateTaskDto 
   * @returns 
   */
  async update(id: string, updateTaskDto: UpdateTaskDto, user: User) {
    const { isFinished } = updateTaskDto;
    if (isFinished) {
      const { parentId } = await this.prismaService.task.findUnique({
        where: { id },
        select: {
          parentId: true,
        },
      });

      if (!parentId) {
        const childrens = await this.prismaService.task.findMany({
          where: {
            parentId: parentId,
          },
        });

        // 所有子任务都已经完成
        if (childrens.every((item) => item.finished)) {
          return this.prismaService.task.update({
            where: { id: parentId },
            data: {
              finished: true,
            },
          });
        }
      }
    }
    const task = await this.prismaService.task.update({
      where: { id },
      data: updateTaskDto,
    });

    const { teamId, id: userId, name: userName } = user;
    await this.auditService.create({
      entityType: ENTITY_TYPE.TASK,
      action: ACTION.UPDATE,
      teamId,
      userId,
      userName,
      entityId: task.id,
      entityTitle: task.title,
    });

    return task;
  }

  async remove(id: string, user: User) {
    const task = await this.prismaService.task.delete({ where: { id } });

    const {teamId, id: userId, name: userName} = user;
    await this.auditService.create({
      entityType: ENTITY_TYPE.TASK,
      action: ACTION.DELETE,
      teamId,
      userId,
      userName,
      entityId: task.id,
      entityTitle: task.title,
    });

    return task;
  }
}

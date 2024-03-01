import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { PrismaService } from './prisma.service'
import { TaskModule } from './task/task.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [TaskModule, CommentModule, UserModule, AuthModule, AuditModule],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}

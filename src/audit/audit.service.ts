import { Injectable } from '@nestjs/common';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuditService {

  constructor(private readonly prismaService: PrismaService) {}

  create(createAuditDto: CreateAuditDto) {
    return this.prismaService.auditLog.create({ data: createAuditDto });
  }

  findAll() {
    return this.prismaService.auditLog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} audit`;
  }

  update(id: string, updateAuditDto: UpdateAuditDto) {
    return `This action updates a #${id} audit`;
  }

  remove(id: string) {
    return `This action removes a #${id} audit`;
  }
}

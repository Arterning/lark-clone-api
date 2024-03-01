import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserDto } from './dto/user-dto';

@Injectable()
export class UserService {

    constructor(private readonly prismaService: PrismaService) {}


    async createUser(userDto: UserDto) {
        return this.prismaService.user.create({
            data: {
                ...userDto
            }
        });
    }


    async findOne(email: string) {
        return this.prismaService.user.findUnique({
            where: {
                email
            }
        });
    }
}

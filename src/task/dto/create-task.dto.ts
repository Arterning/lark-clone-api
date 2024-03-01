import { ApiProperty } from '@nestjs/swagger';


export class CreateTaskDto {
    @ApiProperty()
    parentId?: string

    @ApiProperty()
    title: string

    @ApiProperty()
    description: string

    @ApiProperty()
    startDate?: Date

    @ApiProperty()
    endDate?: Date
}

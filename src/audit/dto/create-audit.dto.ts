import { ACTION, ENTITY_TYPE } from '@prisma/client';

export class CreateAuditDto {

    teamId: string
    userId: string
    userName: string

    entityId: string
    entityType: ENTITY_TYPE
    entityTitle: string
    action: ACTION
}

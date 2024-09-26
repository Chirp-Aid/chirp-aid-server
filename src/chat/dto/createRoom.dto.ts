import { ApiProperty } from '@nestjs/swagger';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { User } from 'src/entities/user.entity';

export class CreateRoomDto {
  @ApiProperty({
    example: '차캐핑',
    description: '일반 사용자',
  })
  user: User;

  @ApiProperty({
    example: '다조핑',
    description: '보육원 사용자',
  })
  orphanage_user: OrphanageUser;
}

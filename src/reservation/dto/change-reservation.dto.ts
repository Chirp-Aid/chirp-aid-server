import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class changeReservationDto{
    @IsNumber()
    @ApiProperty({
        example: 1,
        description: '예약 번호'
    })
    reservationId: number;

    @IsString()
    @ApiProperty({
        example: 'approve | reject',
        description: '예약 승인 또는 거절을 나타냅니다.'
    })
    state: string;

    @ApiProperty({
        example: '그 날은 소풍 가는 날 이라 방문하실 수 없어요ㅠㅠ',
        description: '예약을 거절할 시, 메시지를 남길 수 있습니다.'
    })
    message?: string;
}
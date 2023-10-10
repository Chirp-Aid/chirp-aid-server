import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class DelFavoriteDto{
    @IsNumber()
    @ApiProperty({
        example: 1,
        description: "삭제할 즐겨찾기 id"
    })
    favorite_id: number;
}
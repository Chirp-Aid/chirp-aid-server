import { IsNumber } from "class-validator";

export class DelFavoriteDto{
    @IsNumber()
    favorite_id: number;
}
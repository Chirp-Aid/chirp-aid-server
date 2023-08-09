import { IsString } from 'class-validator';

export class CreateFavoriteDto {
  orphanage_id: number;

  @IsString()
  user_id: string;
}

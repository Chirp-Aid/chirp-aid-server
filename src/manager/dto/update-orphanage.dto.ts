import { IsString } from 'class-validator';

export class updateOrphanage {
  @IsString()
  orphanage_name: string;

  @IsString()
  address: string;

  @IsString()
  homepage_link: string;

  @IsString()
  phone_number: string;

  @IsString()
  description: string;

  @IsString()
  photo: string;
}

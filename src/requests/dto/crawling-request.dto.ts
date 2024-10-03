import { IsNumber, IsString } from 'class-validator';

export class crawlingRequest {
  @IsNumber()
  title: string;
  @IsString()
  price: number;
  @IsString()
  image: string;
  @IsString()
  link: string;
}

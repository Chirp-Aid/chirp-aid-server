import { IsNumber, IsString } from 'class-validator';

export class CrawlingRequest {
  @IsString()
  title: string;
  @IsNumber()
  price: number;
  @IsString()
  image: string;
  @IsString()
  link: string;
}

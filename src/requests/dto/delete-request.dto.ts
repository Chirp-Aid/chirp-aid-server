import { IsString } from 'class-validator';

export class deleteRequest {
  @IsString()
  request_id: string;
}

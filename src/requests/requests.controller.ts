import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @UseGuards(AuthGuard('access'))
  async createRequest(@Body() createRequestDto: CreateRequestDto, @Request() req) {
    const orphanage_user_id = req.user.user_id;
    return await this.requestsService.createRequest(createRequestDto, orphanage_user_id);
  }
}

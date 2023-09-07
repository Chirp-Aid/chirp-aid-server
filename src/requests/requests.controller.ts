import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('REQUEST: 요청 관련 요청')
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

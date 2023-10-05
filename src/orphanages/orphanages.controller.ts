import { Controller, Get, Param } from '@nestjs/common';
import { OrphanagesService } from './orphanages.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('ORPHANAGES: 보육원 정보 관련 요청')
@Controller('orphanages')
export class OrphanagesController {
  constructor(private readonly orphanagesService: OrphanagesService) {}

  @Get()
  @ApiOperation({
    summary: '보육원 목록 가져오기',
    description:
      '모든 보육원의 정보를 반환합니다. 이때 보육원 계정의 정보는 반환하지 않습니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      type: 'object',
      example: [
        {
          "orphanage_id": 1,
          "orphanage_name": "보육원1",
          "address": "주소1",
          "homepage_link": "링크1",
          "phone_number": "111-1111",
          "description": "설명1",
          "photo": "사진1"
        },
        {
          "orphanage_id": 2,
          "orphanage_name": "보육원2",
          "address": "주소2",
          "homepage_link": "링크2",
          "phone_number": "222-2222",
          "description": "설명2",
          "photo": "사진2"
        },
      ]
    }
  })
  async findAll() {
    return await this.orphanagesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: '보육원 상세 정보 가져오기',
    description:
      '하나의 보육원의 상제 정보를 반환합니다. 보육원의 계정, 요청 목록도 함께 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      type: 'object',
      example:  {
        "name": "홍길동",
        "orphanage_name": "금오보육원",
        "address": "주소3",
        "homepage_link": "링크3",
        "phone_number": "333-3333",
        "description": "설명3",
        "photo": "사진3",
        "requests": [
            {
                "request_id": 6,
                "product_name": "촉촉한 초코칩",
                "price": 2000,
                "count": 5,
                "supported_count": 5,
                "state": "COMPLETED",
                "message": "내가 좋아하는 촉촉한 초코칩, 내가 안 좋아는 안 촉촉한 초코칩",
                "product_photo": "초코칩 사진"
            }
        ]
    }
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 해당 보육원을 찾지 못 했습니다.',
  })
  async findOne(@Param('id') id: number) {
    return await this.orphanagesService.findOne(id);
  }
}

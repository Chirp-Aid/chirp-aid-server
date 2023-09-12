import { Controller } from '@nestjs/common';
import { BasketsService } from './baskets.service';

@Controller('baskets')
export class BasketsController {
  constructor(private readonly basketsService: BasketsService) {}
}

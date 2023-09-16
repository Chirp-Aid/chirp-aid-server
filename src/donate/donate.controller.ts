import { Controller } from '@nestjs/common';
import { DonateService } from './donate.service';

@Controller('donate')
export class DonateController {
  constructor(private readonly donateService: DonateService) {}
}

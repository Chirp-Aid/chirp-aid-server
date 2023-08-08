import { BadRequestException } from '@nestjs/common';

export class CustomValidationException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}

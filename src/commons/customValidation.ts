import { BadRequestException, ValidationError } from '@nestjs/common';

export class CustomValidationException extends BadRequestException {
  constructor(validationErrors: ValidationError[]) {
    const message = validationErrors
      .map((error) => Object.values(error.constraints).join(', '))
      .join(', ');

    super(message);
  }
}

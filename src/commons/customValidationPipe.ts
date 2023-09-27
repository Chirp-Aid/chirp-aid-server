import {
  ValidationPipe,
  ArgumentMetadata,
  PipeTransform,
  Injectable,
} from '@nestjs/common';
import { CustomValidationException } from './customValidation';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata) {
    const validationPipe = new ValidationPipe({
      exceptionFactory: (errors) => new CustomValidationException(errors),
    });

    return validationPipe.transform(value, metadata);
  }
}

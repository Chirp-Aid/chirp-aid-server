import { ValidationPipe } from '@nestjs/common';
import { CustomValidationException } from './customValidation';

const validationPipe = new ValidationPipe({
  exceptionFactory: (errors) => {
    const message = Object.values(errors[0].constraints).join(', ');
    return new CustomValidationException(message);
  },
});

// 이렇게 설정한 validationPipe를 NestJS의 AppModule 등에서 사용하면 됩니다.

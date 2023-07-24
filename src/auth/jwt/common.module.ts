import { Module } from '@nestjs/common';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { JwtAccessStrategy } from './jwt-acess.strategy';

@Module({
  providers: [JwtRefreshStrategy, JwtAccessStrategy],
  exports: [JwtRefreshStrategy, JwtAccessStrategy],
})
export class CommonModule {}

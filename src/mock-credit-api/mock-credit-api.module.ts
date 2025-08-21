import { Module } from '@nestjs/common';
import { MockCreditApiController } from './mock-credit-api.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [MockCreditApiController],
})
export class MockCreditApiModule {}

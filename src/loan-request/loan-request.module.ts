import { Module } from '@nestjs/common';
import { LoanRequestService } from './loan-request.service';
import { LoanRequestController } from './loan-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanRequest } from './loan-request.entity';
import { UserModule } from 'src/user/user.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([LoanRequest]), UserModule, HttpModule],
  providers: [LoanRequestService],
  controllers: [LoanRequestController],
  exports: [LoanRequestService],
})
export class LoanRequestModule {}

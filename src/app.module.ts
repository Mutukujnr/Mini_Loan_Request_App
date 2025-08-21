import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { LoanRequestModule } from './loan-request/loan-request.module';
import { MockCreditApiModule } from './mock-credit-api/mock-credit-api.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Amos2002#',
      database: 'loan_request_db',
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    }),
    UserModule,
    LoanRequestModule,
    MockCreditApiModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

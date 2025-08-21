// // package.json
// {
//   "name": "user-loan-crud",
//   "version": "1.0.0",
//   "description": "NestJS User and Loan Request CRUD API",
//   "scripts": {
//     "build": "nest build",
//     "start": "nest start",
//     "start:dev": "nest start --watch",
//     "start:prod": "node dist/main"
//   },
//   "dependencies": {
//     "@nestjs/common": "^10.0.0",
//     "@nestjs/core": "^10.0.0",
//     "@nestjs/platform-express": "^10.0.0",
//     "@nestjs/typeorm": "^10.0.0",
//     "@nestjs/mapped-types": "^2.0.0",
//     "typeorm": "^0.3.17",
//     "mysql2": "^3.6.0",
//     "class-validator": "^0.14.0",
//     "class-transformer": "^0.5.1",
//     "reflect-metadata": "^0.1.13"
//   },
//   "devDependencies": {
//     "@nestjs/cli": "^10.0.0",
//     "@types/node": "^20.3.1",
//     "typescript": "^5.1.3"
//   }
// }

// // src/main.ts
// import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalPipes(new ValidationPipe());
//   await app.listen(3000);
//   console.log('Application is running on: http://localhost:3000');
// }
// bootstrap();

// // src/app.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserModule } from './user/user.module';
// import { LoanRequestModule } from './loan-request/loan-request.module';
// import { User } from './user/entities/user.entity';
// import { LoanRequest } from './loan-request/entities/loan-request.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: 'localhost',
//       port: 3306,
//       username: 'root',
//       password: 'password',
//       database: 'loan_system',
//       entities: [User, LoanRequest],
//       synchronize: true, // Set to false in production
//     }),
//     UserModule,
//     LoanRequestModule,
//   ],
// })
// export class AppModule {}

// // src/user/entities/user.entity.ts
// import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// import { LoanRequest } from '../../loan-request/entities/loan-request.entity';

// @Entity('users')
// export class User {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ unique: true })
//   email: string;

//   @Column()
//   firstName: string;

//   @Column()
//   lastName: string;

//   @Column()
//   phoneNumber: string;

//   @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
//   creditScore: number;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;

//   @OneToMany(() => LoanRequest, loanRequest => loanRequest.user)
//   loanRequests: LoanRequest[];
// }

// // src/user/dto/create-user.dto.ts
// import { IsEmail, IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

// export class CreateUserDto {
//   @IsEmail()
//   @IsNotEmpty()
//   email: string;

//   @IsString()
//   @IsNotEmpty()
//   firstName: string;

//   @IsString()
//   @IsNotEmpty()
//   lastName: string;

//   @IsString()
//   @IsNotEmpty()
//   phoneNumber: string;

//   @IsOptional()
//   @IsNumber()
//   @Min(300)
//   @Max(850)
//   creditScore?: number;
// }

// // src/user/dto/update-user.dto.ts
// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}

// // src/user/user.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from './entities/user.entity';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//   ) {}

//   async create(createUserDto: CreateUserDto): Promise<User> {
//     const user = this.userRepository.create(createUserDto);
//     return await this.userRepository.save(user);
//   }

//   async findAll(): Promise<User[]> {
//     return await this.userRepository.find({
//       relations: ['loanRequests'],
//     });
//   }

//   async findOne(id: number): Promise<User> {
//     const user = await this.userRepository.findOne({
//       where: { id },
//       relations: ['loanRequests'],
//     });

//     if (!user) {
//       throw new NotFoundException(`User with ID ${id} not found`);
//     }

//     return user;
//   }

//  async update]kjhbvf cx8k76j5 bv (id: number, updateUserDto: UpdateUserDto): Promise<User> {
//     await this.userRepository.update(id, updateUserDto);
//     return this.findOne(id);
//   }

//   async remove(id: number): Promise<void> {
//     const result = await this.userRepository.delete(id);
//     if (result.affected === 0) {
//       throw new NotFoundException(`User with ID ${id} not found`);
//     }
//   }

//   async findByEmail(email: string): Promise<User | null> {
//     return await this.userRepository.findOne({ where: { email } });
//   }
// }

// // src/user/user.controller.ts
// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   ParseIntPipe,
// } from '@nestjs/common';
// import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

// @Controller('users')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @Post()
//   create(@Body() createUserDto: CreateUserDto) {
//     return this.userService.create(createUserDto);
//   }

//   @Get()
//   findAll() {
//     return this.userService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id', ParseIntPipe) id: number) {
//     return this.userService.findOne(id);
//   }

//   @Patch(':id')
//   update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateUserDto: UpdateUserDto,
//   ) {
//     return this.userService.update(id, updateUserDto);
//   }

//   @Delete(':id')
//   remove(@Param('id', ParseIntPipe) id: number) {
//     return this.userService.remove(id);
//   }
// }

// // src/user/user.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserService } from './user.service';
// import { UserController } from './user.controller';
// import { User } from './entities/user.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([User])],
//   controllers: [UserController],
//   providers: [UserService],
//   exports: [UserService],
// })
// export class UserModule {}

// // src/loan-request/entities/loan-request.entity.ts
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// import { User } from '../../user/entities/user.entity';

// export enum LoanStatus {
//   PENDING = 'PENDING',
//   APPROVED = 'APPROVED',
//   REJECTED = 'REJECTED',
//   DISBURSED = 'DISBURSED',
// }

// export enum LoanType {
//   PERSONAL = 'PERSONAL',
//   HOME = 'HOME',
//   AUTO = 'AUTO',
//   BUSINESS = 'BUSINESS',
// }

// @Entity('loan_requests')
// export class LoanRequest {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'decimal', precision: 12, scale: 2 })
//   amount: number;

//   @Column({
//     type: 'enum',
//     enum: LoanType,
//     default: LoanType.PERSONAL,
//   })
//   loanType: LoanType;

//   @Column({ type: 'int' })
//   termInMonths: number;

//   @Column({
//     type: 'enum',
//     enum: LoanStatus,
//     default: LoanStatus.PENDING,
//   })
//   status: LoanStatus;

//   @Column({ type: 'text', nullable: true })
//   purpose: string;

//   @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
//   interestRate: number;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;

//   @ManyToOne(() => User, user => user.loanRequests)
//   @JoinColumn({ name: 'userId' })
//   user: User;

//   @Column()
//   userId: number;
// }

// // src/loan-request/dto/create-loan-request.dto.ts
// import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsString, Min, Max } from 'class-validator';
// import { LoanType } from '../entities/loan-request.entity';

// export class CreateLoanRequestDto {
//   @IsNumber()
//   @IsNotEmpty()
//   @Min(1000)
//   @Max(1000000)
//   amount: number;

//   @IsEnum(LoanType)
//   @IsNotEmpty()
//   loanType: LoanType;

//   @IsNumber()
//   @IsNotEmpty()
//   @Min(6)
//   @Max(360)
//   termInMonths: number;

//   @IsOptional()
//   @IsString()
//   purpose?: string;

//   @IsNumber()
//   @IsNotEmpty()
//   userId: number;
// }

// // src/loan-request/dto/update-loan-request.dto.ts
// import { PartialType } from '@nestjs/mapped-types';
// import { IsEnum, IsOptional } from 'class-validator';
// import { CreateLoanRequestDto } from './create-loan-request.dto';
// import { LoanStatus } from '../entities/loan-request.entity';

// export class UpdateLoanRequestDto extends PartialType(CreateLoanRequestDto) {
//   @IsOptional()
//   @IsEnum(LoanStatus)
//   status?: LoanStatus;

//   @IsOptional()
//   interestRate?: number;
// }

// // src/loan-request/loan-request.service.ts
// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { LoanRequest } from './entities/loan-request.entity';
// import { CreateLoanRequestDto } from './dto/create-loan-request.dto';
// import { UpdateLoanRequestDto } from './dto/update-loan-request.dto';
// import { UserService } from '../user/user.service';

// @Injectable()
// export class LoanRequestService {
//   constructor(
//     @InjectRepository(LoanRequest)
//     private loanRequestRepository: Repository<LoanRequest>,
//     private userService: UserService,
//   ) {}

//   async create(createLoanRequestDto: CreateLoanRequestDto): Promise<LoanRequest> {
//     // Check if user exists
//     const user = await this.userService.findOne(createLoanRequestDto.userId);
//     if (!user) {
//       throw new BadRequestException(`User with ID ${createLoanRequestDto.userId} does not exist`);
//     }

//     // Calculate interest rate based on credit score (simple logic)
//     const interestRate = this.calculateInterestRate(user.creditScore);

//     const loanRequest = this.loanRequestRepository.create({
//       ...createLoanRequestDto,
//       interestRate,
//     });

//     const savedLoanRequest = await this.loanRequestRepository.save(loanRequest);

//     // Return loan request with user data
//     return await this.findOne(savedLoanRequest.id);
//   }

//   async findAll(): Promise<LoanRequest[]> {
//     return await this.loanRequestRepository.find({
//       relations: ['user'],
//     });
//   }

//   async findOne(id: number): Promise<LoanRequest> {
//     const loanRequest = await this.loanRequestRepository.findOne({
//       where: { id },
//       relations: ['user'],
//     });

//     if (!loanRequest) {
//       throw new NotFoundException(`Loan request with ID ${id} not found`);
//     }

//     return loanRequest;
//   }

//   async update(id: number, updateLoanRequestDto: UpdateLoanRequestDto): Promise<LoanRequest> {
//     const loanRequest = await this.findOne(id);

//     if (updateLoanRequestDto.userId && updateLoanRequestDto.userId !== loanRequest.userId) {
//       // Verify new user exists if userId is being changed
//       await this.userService.findOne(updateLoanRequestDto.userId);
//     }

//     await this.loanRequestRepository.update(id, updateLoanRequestDto);
//     return this.findOne(id);
//   }

//   async remove(id: number): Promise<void> {
//     const result = await this.loanRequestRepository.delete(id);
//     if (result.affected === 0) {
//       throw new NotFoundException(`Loan request with ID ${id} not found`);
//     }
//   }

//   async findByUserId(userId: number): Promise<LoanRequest[]> {
//     return await this.loanRequestRepository.find({
//       where: { userId },
//       relations: ['user'],
//     });
//   }

//   private calculateInterestRate(creditScore: number): number {
//     // Simple interest rate calculation based on credit score
//     if (creditScore >= 750) return 5.5;
//     if (creditScore >= 700) return 7.0;
//     if (creditScore >= 650) return 9.0;
//     if (creditScore >= 600) return 12.0;
//     return 15.0;
//   }
// }

// // src/loan-request/loan-request.controller.ts
// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   ParseIntPipe,
// } from '@nestjs/common';
// import { LoanRequestService } from './loan-request.service';
// import { CreateLoanRequestDto } from './dto/create-loan-request.dto';
// import { UpdateLoanRequestDto } from './dto/update-loan-request.dto';

// @Controller('loan-requests')
// export class LoanRequestController {
//   constructor(private readonly loanRequestService: LoanRequestService) {}

//   @Post()
//   create(@Body() createLoanRequestDto: CreateLoanRequestDto) {
//     return this.loanRequestService.create(createLoanRequestDto);
//   }

//   @Get()
//   findAll() {
//     return this.loanRequestService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id', ParseIntPipe) id: number) {
//     return this.loanRequestService.findOne(id);
//   }

//   @Get('user/:userId')
//   findByUserId(@Param('userId', ParseIntPipe) userId: number) {
//     return this.loanRequestService.findByUserId(userId);
//   }

//   @Patch(':id')
//   update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateLoanRequestDto: UpdateLoanRequestDto,
//   ) {
//     return this.loanRequestService.update(id, updateLoanRequestDto);
//   }

//   @Delete(':id')
//   remove(@Param('id', ParseIntPipe) id: number) {
//     return this.loanRequestService.remove(id);
//   }
// }

// // src/loan-request/loan-request.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { LoanRequestService } from './loan-request.service';
// import { LoanRequestController } from './loan-request.controller';
// import { LoanRequest } from './entities/loan-request.entity';
// import { UserModule } from '../user/user.module';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([LoanRequest]),
//     UserModule,
//   ],
//   controllers: [LoanRequestController],
//   providers: [LoanRequestService],
// })
// export class LoanRequestModule {}

// // API Usage Examples:

// /*
// 1. Create a User:
// POST /users
// {
//   "email": "john.doe@example.com",
//   "firstName": "John",
//   "lastName": "Doe",
//   "phoneNumber": "+1234567890",
//   "creditScore": 750
// }

// 2. Get all Users:
// GET /users

// 3. Get User by ID:
// GET /users/1

// 4. Update User:
// PATCH /users/1
// {
//   "creditScore": 780
// }

// 5. Delete User:
// DELETE /users/1

// 6. Create Loan Request (User must exist):
// POST /loan-requests
// {
//   "amount": 50000,
//   "loanType": "PERSONAL",
//   "termInMonths": 36,
//   "purpose": "Home renovation",
//   "userId": 1
// }

// Response will include both loan request data and user data:
// {
//   "id": 1,
//   "amount": "50000.00",
//   "loanType": "PERSONAL",
//   "termInMonths": 36,
//   "status": "PENDING",
//   "purpose": "Home renovation",
//   "interestRate": "5.50",
//   "createdAt": "2024-01-15T10:30:00.000Z",
//   "updatedAt": "2024-01-15T10:30:00.000Z",
//   "userId": 1,
//   "user": {
//     "id": 1,
//     "email": "john.doe@example.com",
//     "firstName": "John",
//     "lastName": "Doe",
//     "phoneNumber": "+1234567890",
//     "creditScore": "750.00",
//     "isActive": true,
//     "createdAt": "2024-01-15T10:00:00.000Z",
//     "updatedAt": "2024-01-15T10:00:00.000Z"
//   }
// }

// 7. Get all Loan Requests:
// GET /loan-requests

// 8. Get Loan Request by ID:
// GET /loan-requests/1

// 9. Get Loan Requests by User ID:
// GET /loan-requests/user/1

// 10. Update Loan Request:
// PATCH /loan-requests/1
// {
//   "status": "APPROVED"
// }

// 11. Delete Loan Request:
// DELETE /loan-requests/1
// */

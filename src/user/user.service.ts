import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserResponseDTO } from './dto/user-response.dto';
import { UserRequestDTO } from './dto/user-request.dto';
import { Mapper } from './dto/mapper';
import { UserUpdateDTO } from './dto/user-update.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async createUser(
    userRequest: UserRequestDTO,
  ): Promise<UserResponseDTO | null> {
    //check if a user exists by email
    const existingUser = await this.userRepository.findOne({
      where: { email: userRequest.email },
    });

    if (existingUser) {
      throw new Error(
        `user with the email ${userRequest.email} already exists`,
      );
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userRequest.password, salt);
    const newUser = this.userRepository.create({
      name: userRequest.name,
      email: userRequest.email,
      password: hashedPassword,
      phone_number: userRequest.phone_number,
    });

    const savedUser = await this.userRepository.save(newUser);
    //delete savedUser.password;

    return Mapper.transformUserToDto(savedUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['loanRequests'],
    });
  }

  findOne(id: number): Promise<User | null> {
    const savedUser = this.userRepository.findOne({
      where: { id },
      relations: ['loanRequests'],
    });

    if (savedUser == null) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return savedUser;
  }

  findUserByEmail(
    email: string,
    selectSecrets: boolean = false,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
        password: selectSecrets,
      },
    });
  }

  async removeUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async updateUser(
    id: number,
    userUpdateDTO: UserUpdateDTO,
  ): Promise<UserResponseDTO> {
    const user = await this.userRepository.findOne({
      where: { id: userUpdateDTO.id },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    Object.assign(user, userUpdateDTO);

    const updatedUser = await this.userRepository.save(user);

    return Mapper.transformUserToDto(updatedUser);
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

export type MockType<T> = {
  [P in keyof T]: jest.Mock<any, any>;
};

const repositoryMockFactory: () => Partial<MockType<Repository<User>>> =
  jest.fn(() => ({
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  }));

const mockUser = {
  id: 1,
  name: 'JOhn Doe',
  email: 'john.doe@example.com',
  password: '1234',
  phone_number: '0712345678',
};

describe('UserService', () => {
  let service: UserService;
  let repositoryMock: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repositoryMock = module.get(getRepositoryToken(User));
  });

  describe('createUser', () => {
    it('should save a user in the database', async () => {
      repositoryMock.save.mockReturnValue('user');
      expect(repositoryMock.save).not.toHaveBeenCalled();
      const createUserDTO = {
        name: 'john',
        email: 'sampleemail@example.com',
        phone_number: '07123456789',
        password: '1234',
      };
      const result = await service.createUser(createUserDTO);
      expect(result).toEqual('some user');
    });
  });

  describe('getUsers', () => {
    it('should get all users', async () => {
      repositoryMock.find.mockReturnValue(mockUser);
      expect(repositoryMock.find).not.toHaveBeenCalled();
      const result = await service.findAll();
      expect(repositoryMock.find).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });
});

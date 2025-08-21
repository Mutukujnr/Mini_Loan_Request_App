import { UserRequestDTO } from './user-request.dto';
import { UserResponseDTO } from './user-response.dto';

export class Mapper {
  public static transformUserToDto(user: UserRequestDTO): UserResponseDTO {
    const userDto = new UserResponseDTO();

    userDto.name = user.name;
    userDto.email = user.email;
    userDto.phone_number = user.phone_number;

    return userDto;
  }
}

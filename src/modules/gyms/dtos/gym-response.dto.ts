import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/modules/auth/dto/user-responde.dto';

@Exclude()
export class GymResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  phonenumber: string;

  @Expose()
  address: string;

  @Expose()
  active: boolean;

  @Expose()
  registration_date: Date;

  @Expose()
  @Type(() => UserResponseDto)
  createdBy: UserResponseDto;

}

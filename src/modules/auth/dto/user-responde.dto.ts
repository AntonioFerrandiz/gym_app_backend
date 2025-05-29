import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  firstname: string;

  @Expose()
  lastname: string;

  @Expose()
  email: string;

  @Expose()
  dni: number;

  @Expose()
  active: boolean;

  @Expose({ name: 'registration_d' })
  registration_d: Date;
}
import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsNumber, Validate } from 'class-validator';
import { IsDniUniqueConstraint } from 'src/shared/validators/is-dni-unique.validator';
import { IsEmailUniqueConstraint } from 'src/shared/validators/is-email-unique.validator';

export enum AllowedRoles {
  GYM_ADMIN = 'gym_admin',
  GYM_STAFF = 'gym_staff',
  GYM_MEMBER = 'gym_member',
}

export class CreateUserByRoleDto {
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  @Validate(IsEmailUniqueConstraint)
  email: string;

  @IsNotEmpty()
  @Validate(IsDniUniqueConstraint)
  dni: number;
  
  @MinLength(6)
  password: string;

  @IsEnum(AllowedRoles)
  role: AllowedRoles;

  @IsNumber()
  gym_id: number;
}

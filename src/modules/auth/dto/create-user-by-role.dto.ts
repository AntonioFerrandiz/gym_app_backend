import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsNumber, Validate } from 'class-validator';
import { IsDniUniqueConstraint } from 'src/shared/validators/is-dni-unique.validator';
import { IsEmailUniqueConstraint } from 'src/shared/validators/is-email-unique.validator';

export enum AllowedRoles {
  GYM_ADMIN = 'gym_admin',
  GYM_STAFF = 'gym_staff',
  GYM_MEMBER = 'gym_member',
}

export class CreateUserByRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Validate(IsEmailUniqueConstraint)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsDniUniqueConstraint)
  dni: number;

  @ApiProperty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsEnum(AllowedRoles)
  role: AllowedRoles;

  @ApiProperty()
  @IsNumber()
  gym_id: number;
}

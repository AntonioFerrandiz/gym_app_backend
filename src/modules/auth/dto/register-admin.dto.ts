import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, MaxLength, MinLength, Validate } from 'class-validator';
import { IsDniUniqueConstraint } from 'src/shared/validators/is-dni-unique.validator';
import { IsEmailUniqueConstraint } from 'src/shared/validators/is-email-unique.validator';
import { Unique } from 'typeorm';

export class RegisterAdminDto {
  @ApiProperty()
  @IsNotEmpty()
  firstname: string;
  @ApiProperty()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty()
  @Validate(IsEmailUniqueConstraint)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @Validate(IsDniUniqueConstraint)
  @IsNotEmpty()
  dni: number;

  @ApiProperty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  gym_id: number;
}

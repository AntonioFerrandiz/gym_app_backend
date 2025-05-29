import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGymDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  phonenumber: string;
}

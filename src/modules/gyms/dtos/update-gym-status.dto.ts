import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGymStatusDto {
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsEmailUniqueConstraint } from '../validators/is-email-unique.validator';
import { User } from 'src/modules/auth/entities/user.entity';
import { IsDniUniqueConstraint } from '../validators/is-dni-unique.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [IsEmailUniqueConstraint, IsDniUniqueConstraint],
  exports: [IsEmailUniqueConstraint, IsDniUniqueConstraint],
})
export class CommonModule {}

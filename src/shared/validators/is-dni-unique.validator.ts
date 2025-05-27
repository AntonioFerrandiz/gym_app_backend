import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/auth/entities/user.entity';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsDniUniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async validate(dni: number): Promise<boolean> {
    const user = await this.userRepo.findOne({ where: { dni } });
    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return `El dni ${args.value} ya está en uso.`;
  }
}

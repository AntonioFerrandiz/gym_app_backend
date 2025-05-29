import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGymDto } from './dtos/create-gym.dto';
import { Gym } from './entities/gym.entity';
import { UpdateGymStatusDto } from './dtos/update-gym-status.dto';
import { User } from '../auth/entities/user.entity';
import { GymResponseDto } from './dtos/gym-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GymsService {
    constructor(
        @InjectRepository(Gym)
        private readonly gymRepo: Repository<Gym>,
    ) { }

    async create(createGymDto: CreateGymDto, user: User): Promise<Gym> {
        console.log("user", user)
        if (user.role.name !== 'super_admin') {
            throw new ForbiddenException('Solo el super admin puede crear gimnasios');
        }
        const gym = this.gymRepo.create({
            ...createGymDto,
            registration_date: new Date(),
            createdBy: {id: user.id}
        });
        return await this.gymRepo.save(gym);
    }

    async findAll(): Promise<GymResponseDto[]> {
        const gyms = await this.gymRepo.find({
            relations: ['createdBy', 'users']
        });
        return plainToInstance(GymResponseDto, gyms, { excludeExtraneousValues: true })
    }

    async updateStatus(id: number, dto: UpdateGymStatusDto, user: User): Promise<Gym> {
        if (user.role.name !== 'super_admin') {
            throw new ForbiddenException('Solo el super admin puede cambiar el estado del gimnasio');
        }

        const gym = await this.gymRepo.findOne({ where: { id } });
        if (!gym) {
            throw new NotFoundException('Gimnasio no encontrado');
        }

        gym.active = dto.isActive;
        return this.gymRepo.save(gym);
    }
    async hasAdminAssigned(gymId: number): Promise<boolean> {
        const gym = await this.gymRepo.findOne({
            where: { id: gymId },
            relations: ['users'],
        });

        if (!gym) return false;

        return gym.users.some(u => u.role.name === 'gym_admin');
    }
}

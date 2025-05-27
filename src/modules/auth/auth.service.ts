import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { Role } from './entities/role.entity';
import { CreateUserByRoleDto } from './dto/create-user-by-role.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Role)
        private roleRepo: Repository<Role>,
        private jwtService: JwtService,
    ) { }
    async registerAdmin(dto: RegisterAdminDto, currentUser?: User) {
        const userCount = await this.userRepo.count();
        const roleName = userCount === 0 ? 'super_admin' : 'gym_admin';

        if (userCount > 0) {
            if (!currentUser || currentUser.role.name !== 'super_admin') {
                throw new UnauthorizedException('Solo un super_admin puede crear nuevos administradores');
            }
        }

        const role = await this.roleRepo.findOne({ where: { name: roleName } });

        if (!role) {
            throw new NotFoundException(`No se encontró el rol '${roleName}'`);
        }


        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({
            ...dto,
            password: hashedPassword,
            registration_d: new Date(),
            role,
        });

        await this.userRepo.save(user);
        return { message: `${roleName} creado correctamente` };
    }
    async validateUser(email: string, password: string) {
        const user = await this.userRepo.findOne({ where: { email } });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        if (!user.active) {
            throw new UnauthorizedException('Usuario desactivado');
        }

        return user;
    }
    async registerUserByRole(dto: CreateUserByRoleDto, currentUser: User) {

        const { role, gym_id, ...rest } = dto;

        // Validación de permiso por rol
        const isSuperAdmin = currentUser.role.name === 'super_admin';
        const isGymAdmin = currentUser.role.name === 'gym_admin';

        if (isGymAdmin && currentUser.gym_id !== gym_id) {
            throw new ForbiddenException('No puede crear usuarios en otro gimnasio');
        }

        const roleEntity = await this.roleRepo.findOne({ where: { name: role } });
        if (!roleEntity) {
            throw new NotFoundException('Rol inválido');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({
            ...rest,
            password: hashedPassword,
            gym_id,
            registration_d: new Date(),
            role: roleEntity,
        });
        console.log('user', user);
        await this.userRepo.save(user);
        return { message: `${role} creado correctamente` };
    }

    async login(dto: LoginDto) {
        const user = await this.validateUser(dto.email, dto.password);

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            gymId: user.gym_id,
        };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}

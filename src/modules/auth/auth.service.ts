import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { Role } from './entities/role.entity';
import { CreateUserByRoleDto } from './dto/create-user-by-role.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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

    async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken);
      const user = await this.userRepo.findOne({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException();

      const newAccessToken = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
        gymId: user.gym_id,
      });

      return { accessToken: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number) {
    
    return { message: 'Logged out successfully' };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    const valid = await bcrypt.compare(dto.oldPassword, user.password);
    console.log(valid)
    if (!valid) throw new BadRequestException('Contraseña antigua es incorrecta');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashed;
    await this.userRepo.save(user);

    return { message: 'Contraseña cambiada exitosamente' };
  }
}

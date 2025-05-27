import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { UseGuards } from '@nestjs/common';
import { CreateUserByRoleDto } from './dto/create-user-by-role.dto';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register-admin')
    @Roles('super_admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async registerAdmin(@Body() dto: RegisterAdminDto, @Req() req) {
        return this.authService.registerAdmin(dto, req.user);
    }
    @Post('register-role')
    @Roles('super_admin', 'gym_admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async registerUserByRole(@Body() dto: CreateUserByRoleDto, @Req() req) {
        return this.authService.registerUserByRole(dto, req.user);
    }
}

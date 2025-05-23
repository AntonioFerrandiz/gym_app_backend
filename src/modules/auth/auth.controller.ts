import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register-admin')
    @UseGuards(JwtAuthGuard)
    async registerAdmin(@Body() dto: RegisterAdminDto, @Req() req) {
        return this.authService.registerAdmin(dto, req.user);
    }
}

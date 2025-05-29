import { Module } from '@nestjs/common';
import { GymsController } from './gyms.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/shared/common/common.module';
import { AuthService } from '../auth/auth.service';
import { Role } from '../auth/entities/role.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Gym } from './entities/gym.entity';
import { GymsService } from './gyms.service';
import { User } from '../auth/entities/user.entity';

@Module({
    imports: [
        ConfigModule,
        PassportModule,
        TypeOrmModule.forFeature([Role, Gym, User]),
        JwtModule.registerAsync({
            imports: [ConfigModule, CommonModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
            }),
        }),
    ],
    controllers: [GymsController],
    providers: [AuthService, JwtStrategy, GymsService],
})
export class GymsModule {

}

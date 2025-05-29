import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { GymsService } from './modules/gyms/gyms.service';
import { GymsModule } from './modules/gyms/gyms.module';
import { GymsController } from './modules/gyms/gyms.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // para usar process.env en toda la app
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || '2001',
      database: process.env.DB_NAME || 'gymapp',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // solo para desarrollo
    }),
    AuthModule,
    GymsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

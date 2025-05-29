import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateGymDto } from './dtos/create-gym.dto';
import { GymsService } from './gyms.service';
import { UpdateGymStatusDto } from './dtos/update-gym-status.dto';

@ApiTags('Gym')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('gyms')
export class GymsController {
    constructor(private readonly gymService: GymsService) { }

    @Post()
    @Roles('super_admin')
    async create(@Body() dto: CreateGymDto, @Req() req) {
        return this.gymService.create(dto, req.user);
    }

    @Get()
    @Roles('super_admin')
    async findAll() {
        return this.gymService.findAll();
    }
    @Patch(':id/status')
    @Roles('super_admin')
    async updateStatus(
        @Param('id') id: number,
        @Body() dto: UpdateGymStatusDto,
        @Req() req,
    ) {
        return this.gymService.updateStatus(id, dto, req.user);
    }
}

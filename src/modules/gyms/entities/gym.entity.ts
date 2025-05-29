import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { User } from 'src/modules/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@Entity()
export class Gym {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @IsString()
    name: string;

    @Column()
    @IsString()
    phonenumber: string;


    @Column({ default: true })
    active: boolean;

    @Column()
    @IsString()
    address: string;

    @Column()
    registration_date: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    createdBy: User;


    @OneToMany(() => User, user => user.gym)
    users: User[];
}

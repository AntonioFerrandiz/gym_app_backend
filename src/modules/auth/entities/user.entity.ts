import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Gym } from 'src/modules/gyms/entities/gym.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    dni: number;

    @Column()
    password: string;

    @Column({ default: true })
    active: boolean;

    @Column()
    registration_d: Date;

    @ManyToOne(() => Gym, gym => gym.users)
    @JoinColumn({ name: 'gym_id' }) 
    gym: Gym;

    @ManyToOne(() => Role, role => role.users, { eager: true })
    @JoinColumn({ name: 'role_id' })
    role: Role;
}

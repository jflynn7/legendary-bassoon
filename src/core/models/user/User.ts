import {
    Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, UpdateDateColumn, CreateDateColumn
} from 'typeorm';
import { UserProfile } from './UserProfile';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdDate: Date;

    @Column({default: ''})
    lastLogin: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToOne(type => UserProfile, profile => profile.user, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    @JoinColumn()
    profile: UserProfile;

}
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn, CreateDateColumn} from 'typeorm';
import {UserProfile} from './UserProfile';

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdDate: Date;

    @Column()
    comment: string;

    @ManyToOne(type => UserProfile, userProfile => userProfile.comments, {
        cascadeInsert: true,
        cascadeRemove: false
    })
    userProfile: UserProfile|null;
}
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, CreateDateColumn } from 'typeorm';
import { Comment } from './Comment';
import { User } from './User';
import { UserAddress } from './UserAddress';

@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdDate: Date;

    @OneToOne(type => User, user => user.profile, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    user: User;

    @Column()
    firstName: string;

    @Column()
    surname: string;

    @OneToMany(type => UserAddress, address => address.userProfile, {
        cascadeInsert : true,
        cascadeUpdate : true
    })
    addresses: UserAddress[];

    @OneToMany(type => Comment, comment => comment.userProfile, {
        cascadeInsert : true,
        cascadeUpdate : true
    })
    comments: Comment[];

}
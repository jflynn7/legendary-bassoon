import {Entity} from 'typeorm/decorator/entity/Entity';
import {Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {UserProfile} from './UserProfile';

@Entity()
export class UserAddress {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdDate: Date;

    @Column()
    addressLine1: string;

    @Column()
    addressLine2: string;

    @Column()
    town: string;

    @Column()
    county: string;

    @Column()
    country: string;

    @Column()
    postcode: string;

    @Column()
    yearsAtAddress: string;

    @Column()
    monthsAtAddress: string;

    @Column()
    residencyType: string;

    @ManyToOne(type => UserProfile, userProfile => userProfile.addresses, {
        cascadeInsert: true
    })
    userProfile: UserProfile|null;

}
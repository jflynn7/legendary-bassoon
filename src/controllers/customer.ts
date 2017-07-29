import { Request, Response } from 'express';
import { Customer } from '../models/customer/Customer';

const db = require('../database-actions/customer');
const dbUtil = require('../util/dbUtil');

export let loadCustomer = (req: Request, res: Response) => {
    dbUtil.getConnection().then((connection: any) => {
        db.loadCustomerById(connection, req.params.customerId).then((customer: Customer) => {
            res.json(customer);
        });
    });
};

export let createCustomer = (req: Request, res: Response) => {
    dbUtil.getConnection().then((connection: any) => {
        db.createCustomer(connection, req.body).then((customer: Customer) => {
            res.json(customer);
        });
    });
};

export let addFavourites = (req: Request, res: Response) => {
    dbUtil.getConnection().then((connection: any) => {
        db.addFavourites(connection, req.params.customerId, req.body.favourites)
            .then((customer: Customer) => {
                res.json(customer);
            })
            .catch((err: any) => {
            res.json(err);
        });
    });
};

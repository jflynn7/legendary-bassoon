import { Request, Response } from 'express';
import { Customer } from '../models/customer/Customer';
import { CustomerOrder } from '../models/ordering/CustomerOrder';

const db = require('../database-actions/customerActions');
const dbUtil = require('../util/dbUtil');
const handlers = require('../util/handlers');

export let loadCustomer = (req: Request, res: Response) => {
    dbUtil.getConnection().then((connection: any) => {
        db.loadCustomerById(connection, req.params.customerId).then((customer: Customer) => {
            res.json(customer);
        }).catch((err: Error) => {
            handlers.handleError(err, res);
        });
    });
};

export let createCustomer = (req: Request, res: Response) => {
    dbUtil.getConnection().then((connection: any) => {
        db.createCustomer(connection, req.body).then((customer: Customer) => {
            res.json(customer);
        }).catch((err: Error) => {
            handlers.handleError(err, res);
        });
    });
};

export let loginCustomer = (req: Request, res: Response) => {
    dbUtil.getConnection().then((connection: any) => {
        db.loginCustomer(connection, req.body).then((loginSuccess: boolean) => {
            res.json(loginSuccess);
        }).catch((err: Error) => {
            handlers.handleError(err, res);
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
            handlers.handleError(err, res);
        });
    });
};

export let createOrder = (req: Request, res: Response) => {
    dbUtil.getConnection().then((connection: any) => {
        db.createOrder(connection, req.params.customerId, req.body.orders)
            .then((order: CustomerOrder) => {
                res.json(order);
            })
            .catch((err: any) => {
                handlers.handleError(err, res);
            });
    });
};

export let findOrder = (req: Request, res: Response) => {
    dbUtil.getConnection().then((connection: any) => {
        db.findOrder(connection, req.params.orderId)
            .then((order: CustomerOrder) => {
                res.json(order);
            })
            .catch((err: any) => {
                handlers.handleError(err, res);
            });
    });
};

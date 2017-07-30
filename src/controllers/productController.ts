import { Request, Response } from 'express';
import { Customer } from '../models/customer/Customer';

const db = require('../database-actions/productActions');
const handlers = require('../util/handlers');
const dbUtil = require('../util/dbUtil');

export let addComment = (req: Request, res: Response) => {
    dbUtil.getConnection().then((connection: any) => {
        db.addComment(connection, req.body, req.params.productId, req.params.customerId).then((customer: Customer) => {
            res.json(customer);
        }).catch((err: Error) => {
            handlers.handleError(err);
        });
    });
};

export let removeComment = (req: Request, res: Response) => {
    dbUtil.getConnection().then((connection: any) => {
        db.removeComment(connection, req.params.commentId).then((result: boolean) => {
            res.json(result);
        }).catch((err: Error) => {
            handlers.handleError(err);
        });
    });
};
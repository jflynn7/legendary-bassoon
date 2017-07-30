import { Request, Response } from 'express';
import { Merchant} from '../models/merchant/Merchant';

const db = require('../database-actions/merchantActions');
const dbUtil = require('../util/dbUtil');
const handlers = require('../util/handlers');

/**
 * Load Merchant by ID and eager-load child entities.
 * @param {e.Request} req
 * @param {e.Response} res
 */
export let loadMerchant = (req: Request, res: Response) => {
    dbUtil.getConnection().then((connection: any) => {
        db.loadMerchantById(connection, req.params.merchantId).then((merchant: Merchant) => {
            res.json(merchant);
        }).catch((err: Error) => {
            handlers.handleError(err);
        });
    });
};

export let createMerchant = (req: Request, res: Response) => {
    dbUtil.getConnection().then((connection: any) => {
        db.createMerchant(connection, req.body).then((merchant: Merchant) => {
            res.json(merchant);
        }).catch((err: Error) => {
            handlers.handleError(err);
        });
    });
};

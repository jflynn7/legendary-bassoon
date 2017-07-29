import { Request, Response } from 'express';
import { Merchant} from '../models/merchant/Merchant';

const db = require('../database-actions/merchant');
const dbUtil = require('../util/dbUtil');

/**
 * Load Merchant by ID and eager-load child entities.
 * @param {e.Request} req
 * @param {e.Response} res
 */
export let loadMerchant = (req: Request, res: Response) => {
    dbUtil.getConnection().then((connection: any) => {
        db.loadMerchantById(connection, req.params.merchantId).then((merchant: Merchant) => {
            res.json(merchant);
        });
    });
};

export let createMerchant = (req: Request, res: Response) => {
    dbUtil.getConnection().then((connection: any) => {
        db.createMerchant(connection, req.body).then((merchant: Merchant) => {
            res.json(merchant);
        });
    });
};

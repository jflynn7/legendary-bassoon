import { Request, Response } from 'express';
import { User } from '../models/user/User';

const db = require('../database-actions/UserRepository');
const dbUtil = require('../../util/databaseConnection');
const handlers = require('../../util/errorHandler');

export let helloMoto = (req: Request, res: Response) => {
    res.json('Hello, moto');
};

/**
 * Load User
 * @param {e.Request} req
 * @param {Response} res
 */
export let loadUser = (req: Request, res: Response) => {
    dbUtil.getConnection().then((connection: any) => {
        db.loadUserById(connection, req.params.userId, req).then((user: User) => {
            res.json(user);
        }).catch((err: Error) => {
            handlers.handleError(err, res);
        });
    });
};

/**
 * Register User
 * @param {e.Request} req
 * @param {Response} res
 */
export let registerUser = (req: Request, res: Response) => {
    dbUtil.getConnection().then((connection: any) => {
        db.createUser(connection, req.body, req).then((user: User) => {
            res.json(user);
        }).catch((err: Error) => {
            handlers.handleError(err, res);
        });
    });
};

/**
 * Update User Profile
 * @param {e.Request} req
 * @param {Response} res
 */
export let updateUserProfile = (req: Request, res: Response) => {
    dbUtil.getConnection().then((connection: any) => {
        db.updateProfile(connection, req.body, req).then((user: User) => {
            res.json(user);
        }).catch((err: Error) => {
            handlers.handleError(err, res);
        });
    });
};

/**
 * User Login
 * @param {e.Request} req
 * @param {Response} res
 */
export let loginUser = (req: Request, res: Response) => {
    dbUtil.getConnection().then((connection: any) => {
        db.loginUser(connection, req.body, req).then((loginSuccess: boolean) => {
            res.json(loginSuccess);
        }).catch((err: Error) => {
            handlers.handleError(err, res);
        });
    });
};

import { Response } from 'express';

module.exports = {
    handleError(error: Error, res: Response) {
        console.log(error);
        res.status(400);
        res.json(error);
    }
};
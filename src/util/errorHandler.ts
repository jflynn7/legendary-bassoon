import { Response } from 'express';

class GenericException {
    errorMessage: string;
    statusCode: number;
    request: Request;

    constructor(data: { errorMessage: string, statusCode: number, request: Request }) {
        this.errorMessage = data.errorMessage;
        this.statusCode = data.statusCode;
        this.request = data.request;
    }
}

class ExposeException {
    errorMessage: string;
    errorDate: Date;
    requestingIp: string;

    constructor(errorMessage: string, request: Request) {
        this.errorMessage = errorMessage;
        this.errorDate = new Date();
        this.requestingIp = request.headers[ 'x-forwarded-for' ] || request[ 'connection' ].remoteAddress;
    }
}

module.exports = {
    handleError(error: Error | GenericException, res: Response) {
        if (error instanceof Error) {
            res.status(500);
            res.json(error);
        } else {
            res.status(error.statusCode);
            const returnedError: ExposeException = new ExposeException(error.errorMessage, error.request);
            this.logError(returnedError);
            res.json(returnedError);
        }
    },

    // 409 - Conflict
    throwDuplicateResource(request: Request, message: string) {
        return Promise.reject(new GenericException({
                errorMessage: message,
                statusCode: 409,
                request: request
            })
        );
    },

    // 401 - Unauthorised
    throwUnauthorised(request: Request, message: string) {
        return Promise.reject(new GenericException({
            errorMessage: message,
            statusCode: 401,
            request: request
        }));
    },

    // 500 - Database Error
    throwDatabaseError(request: Request, message: string) {
        return Promise.reject(new GenericException({
            errorMessage: message,
            statusCode: 500,
            request: request
        }));
    },

    // @TODO - Log this somewhere?
    logError(error: ExposeException) {
        console.log(error);
    },

    // @TODO - Log this somewhere?
    logSystemError(error: Error) {
        console.log(error.stack);
    }
};
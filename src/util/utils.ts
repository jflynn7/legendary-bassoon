import * as _ from 'lodash';

module.exports = {
    // CONSTANTS
    ALREADY_REGISTERED: 'User already exists.',
    INVALID_LOGIN: 'Invalid Credentials.',
    ALREADY_LOGGED_IN: 'User already logged in.',
    UNKNOWN_EXCEPTION: 'An unknown exception occured.',
    USER_NOT_FOUND: 'User not found.',

    // SESSION MANAGEMENT
    setSession(request: Request, userId: number) {
        request['session']['userId'] = userId;
        request['session']['lastLoggedIn'] = new Date();
        request['session']['cookie'].maxAge = 14 * 60 * 60 * 1000;
    },

    getSession(request: Request) {
        return request['session'];
    },

    sessionProp(request: Request, property: string) {
        return request['session'][property];
    },

    /**
     * Filter object to remove specific keys
     * from response
     * @param object
     * @param {string[]} keys
     * @returns {any}
     */
    filterProps(object: any, keys: string[]) {
        _.forEach(keys, (key: string) => {
            console.log(`Filtering out ${key}`);
            object[key] = undefined;
        });
        return object;
    }
};
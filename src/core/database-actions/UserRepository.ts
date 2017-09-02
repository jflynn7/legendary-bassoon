import { User } from '../models/user/User';

const bcrypt = require('bcrypt');
const errorHandler = require('../../util/errorHandler');
const utils = require('../../util/utils');

module.exports = {

    /**
     * Create user
     * @param connection
     * @param {User} user
     * @param {Request} request
     * @returns {Promise<any>}
     */
    async createUser(connection: any, user: User, request: Request) {
        const userRepo = connection.getRepository(User);
        let existingUser: User;
        await userRepo.createQueryBuilder('user')
            .where('user.username = :username', { username : user.username})
            .getOne().then((loadedUser: User) => {
                existingUser = loadedUser;
            }).catch((err: Error) => {
                errorHandler.logSystemError(err);
                return errorHandler.throwDatabaseError(`${err.name} - ${err.message}`, request);
            });

        if (existingUser) {
            return errorHandler.throwDuplicateResource(request, utils.ALREADY_REGISTERED);
        }

        let savedUser: User;
        user.password = bcrypt.hashSync(user.password, 10);
        await userRepo.persist(user).then((result: any) => {
            savedUser = result;
        });

        return this.loadUserById(connection, savedUser.id, request);
    },

    /**
     * Update Profile
     * @param connection
     * @param {User} user
     * @param {Request} request
     * @returns {Promise<any>}
     */
    async updateProfile(connection: any, user: User, request: Request) {
        const userRepo = connection.getRepository(User);
        let userInstance = await this.loadUserById(connection, user.id, request);
        if (!userInstance) {
            return errorHandler.throwDatabaseError(request, utils.USER_NOT_FOUND);
        }
        userInstance.profile = user.profile;
        userInstance.profile.user = user;
        await userRepo.persist(userInstance).then((result: any) => {
            userInstance = result;
        });

        return this.loadUserById(connection, userInstance.id, request);
    },

    /**
     * Update user
     * @param connection
     * @param {User} user
     * @param {Request} request
     * @returns {Promise<any>}
     */
    async updateUser(connection: any, user: User, request: Request) {
        const userRepo = connection.getRepository(User);
        let userInstance: User;

        await userRepo.persist(user).then((result: any) => {
            userInstance = result;
        }).catch((err: Error) => {
            errorHandler.logSystemError(err);
            return errorHandler.throwDatabaseError(request, utils.UNKNOWN_EXCEPTION);
        });

        userInstance['session'] = utils.getSession(request);

        return this.loadUserById(connection, userInstance.id, request);
    },

    /**
     * User Login
     * @param connection
     * @param loginDetails
     * @param {Request} request
     * @returns {Promise<any>}
     */
    async loginUser(connection: any, loginDetails: { username: string, password: string }, request: Request) {
        let userInstance: User;
        const userRepo = connection.getRepository(User);

        if (request['session']['userId']) {
            return errorHandler.throwUnauthorised(
                request,
                `${utils.ALREADY_LOGGED_IN} - ${utils.sessionProp(request, 'lastLoggedIn')}`);
        }

        await userRepo.createQueryBuilder('user')
            .where('user.username = :username', { username : loginDetails.username})
            .getOne().then((loadedUser: User) => {
                userInstance = loadedUser;
            }).catch((err: Error) => {
                errorHandler.logSystemError(err);
                return errorHandler.throwDatabaseError(request);
            });

        if (!userInstance || !bcrypt.compareSync(loginDetails.password, userInstance.password)) {
            return errorHandler.throwUnauthorised(request, utils.INVALID_LOGIN);
        }

        await utils.setSession(request, userInstance.id);

        userInstance.lastLogin = new Date().toDateString();

        return this.updateUserProfile(connection, userInstance, request);
    },

    /**
     * Load user by ID
     * @param connection
     * @param {number} userId
     * @param {Request} request
     * @returns {Promise<any>}
     */
    async loadUserById(connection: any, userId: number, request: Request) {
        const userRepo = connection.getRepository(User);
        let userInstance: User;

        await userRepo.createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'userProfile')
            .leftJoinAndSelect('userProfile.addresses', 'addresses')
            .leftJoinAndSelect('userProfile.comments', 'comments' )
            .where('user.id = :userId', { userId : userId})
            .getOne().then((loadedUser: User) => {
                userInstance = loadedUser;
            });

        return utils.filterProps(userInstance, ['password']);
    },

};
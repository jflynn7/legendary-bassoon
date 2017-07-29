import { Customer } from '../models/customer/Customer';
import { Product } from '../models/merchant/Product';

module.exports = {

    async createCustomer(connection: any, customer: Customer) {
        const customerRepo = connection.getRepository(Customer);
        let savedCustomer;
        await customerRepo.persist(customer).then((result: any) => {
            savedCustomer = result;
        });
        return savedCustomer;
    },

    async addFavourites(connection: any, customerId: number, products: Product[]) {

        const customerRepo = connection.getRepository(Customer);
        let customerInstance: Customer;

        await customerRepo.createQueryBuilder('customer')
            .leftJoinAndSelect('customer.favourites', 'favourites')
            .where('customer.id = :customerId', { customerId : customerId})
            .getOne().then((loadedCustomer: Customer) => {
                customerInstance = loadedCustomer;
                products.forEach((product: Product) => {
                    customerInstance.favourites.push(product);
                });
            }).catch((err: any) => {
                console.log(err);
            });

        customerRepo.persist(customerInstance).then((res: any) => {
            console.log(res);
        }).catch((err: any) => {
            console.log('ERROR: ' + err);
        });

        return customerInstance;
    },

    async loadCustomerById(connection: any, customerId: number) {
        const customerRepo = connection.getRepository(Customer);
        let customerInstance: Customer;

        await customerRepo.createQueryBuilder('customer')
            .leftJoinAndSelect('customer.favourites', 'favourites')
            .where('customer.id = :customerId', { customerId : customerId})
            .getOne().then((loadedCustomer: Customer) => {
                customerInstance = loadedCustomer;
            });

        return customerInstance;
    },
};
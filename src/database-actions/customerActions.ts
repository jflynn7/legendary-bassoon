import { Customer } from '../models/customer/Customer';
import { Product } from '../models/merchant/Product';
import { CustomerOrder } from '../models/ordering/CustomerOrder';
import { OrderedProduct } from '../models/ordering/OrderedProduct';
import { Merchant } from '../models/merchant/Merchant';
import {error} from 'util';
const bcrypt = require('bcrypt');

module.exports = {

    async createCustomer(connection: any, customer: Customer) {
        const customerRepo = connection.getRepository(Customer);
        let savedCustomer: Customer;
        customer.password = bcrypt.hashSync(customer.password, 10);

        await customerRepo.persist(customer).then((result: any) => {
            savedCustomer = result;
        });

        if (savedCustomer) {
            savedCustomer.password = undefined;
        }
        return savedCustomer;
    },

    async loginCustomer(connection: any, loginDetails: { username: string, password: string, rememberMe: boolean }) {
        let customerInstance: Customer;
        const customerRepo = connection.getRepository(Customer);

        await customerRepo.createQueryBuilder('customer')
            .where('customer.username = :username', { username : loginDetails.username})
            .getOne().then((loadedCustomer: Customer) => {
                customerInstance = loadedCustomer;
            }).catch((err: Error) => {
                console.log(err);
            });

        if (!customerInstance || !bcrypt.compareSync(loginDetails.password, customerInstance.password)) {
            return Promise.reject('Invalid Credentials');
        }

        return customerInstance;
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
            }).then(() => {
                customerRepo.persist(customerInstance).then(() => {}).catch(() => {});
            }).catch((err: any) => {
                console.log(err);
            });

        return customerInstance;
    },

    async findOrder(connection: any, orderId: number) {
        const orderRepo = connection.getRepository(CustomerOrder);
        let orderInstance: CustomerOrder;

        await orderRepo.createQueryBuilder('order')
            .leftJoinAndSelect('order.orderedProducts', 'orderedProducts')
            .leftJoinAndSelect('orderedProducts.product', 'product')
            .leftJoinAndSelect('product.comments', 'comments')
            .leftJoinAndSelect('comments.customer', 'customer')
            .where('order.id = :orderId', {orderId: orderId})
            .getOne().then((loadedOrder: CustomerOrder) => {
                orderInstance = loadedOrder;
            });

        return orderInstance;
    },

    async createOrder(connection: any, customerId: number, orders: { quantity: number, product: Product}[]) {

        const customerRepo = connection.getRepository(Customer);
        const productRepo = connection.getRepository(Product);
        //const customerInstance: Customer;
        let orderInstance: CustomerOrder;

        const newOrder = this.createNewOrder(orders);

        this.createMerchantOrders(newOrder);

        console.log(await this.getMerchantFromProduct(productRepo, newOrder.orderedProducts[0]));

        const orderRepo = connection.getRepository(CustomerOrder);

        await orderRepo.persist(newOrder).then((res: any) => {
            orderInstance = res;
        });

        return orderInstance;
    },

    async loadCustomerById(connection: any, customerId: number) {
        const customerRepo = connection.getRepository(Customer);
        let customerInstance: Customer;

        await customerRepo.createQueryBuilder('customer')
            .leftJoinAndSelect('customer.favourites', 'favourites')
            .leftJoinAndSelect('customer.comments', 'comments')
            .leftJoinAndSelect('comments.product', 'product')
            .where('customer.id = :customerId', { customerId : customerId})
            .getOne().then((loadedCustomer: Customer) => {
                customerInstance = loadedCustomer;
            });

        return customerInstance;
    },

    /////// ORDER FUNCTIONS
    /**
     * Create a new order object from order list
     * @returns {CustomerOrder}
     * @param orders
     */
    createNewOrder(orders: { quantity: number, product: Product }[]): CustomerOrder {
        const newOrder: CustomerOrder = new CustomerOrder();
        newOrder.name = 'Joe Flynn';
        newOrder.orderDate = new Date();
        newOrder.orderedProducts = [];
        orders.forEach((order: { quantity: number, product: Product}) => {
            const orderedProduct: OrderedProduct = new OrderedProduct();
            orderedProduct.product = order.product;
            orderedProduct.price = order.product.price;
            orderedProduct.totalPrice = parseFloat((order.product.price * order.quantity).toFixed(2));
            orderedProduct.quantity = order.quantity;
            newOrder.orderedProducts.push(orderedProduct);
        });

        newOrder.orderTotal = this.calculateOrderTotal(newOrder.orderedProducts);
        return newOrder;
    },

    /**
     * Calculate order total from ordered product array
     * @param {OrderedProduct[]} orderedProducts
     * @returns {number}
     */
    calculateOrderTotal(orderedProducts: OrderedProduct[]): number {
        let total: number = 0;
        orderedProducts.forEach((orderedProduct: OrderedProduct) => {
            total += orderedProduct.totalPrice;
        });
        return total;
    },

    async getMerchantFromProduct(productRepo: any, orderedProduct: OrderedProduct) {
        let merchantInstance: Merchant;
        await productRepo.createQueryBuilder('product')
           .leftJoinAndSelect('product.merchant', 'merchant')
           .where('product.id = :productId', { productId : orderedProduct.product.id})
           .getOne().then((loadedProduct: Product) => {
                merchantInstance = loadedProduct.merchant;
            });
        return merchantInstance;
    },

    async createMerchantOrders(order: CustomerOrder) {

    }
};
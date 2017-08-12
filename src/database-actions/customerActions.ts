import { Customer } from '../models/customer/Customer';
import { Product } from '../models/merchant/Product';
import { Order } from '../models/ordering/Order';
import { OrderedProduct } from '../models/ordering/OrderedProduct';
import { Merchant } from '../models/merchant/Merchant';
import {CompositeOrder, OrderItem} from '../models/transient/orderingTransients';

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
        const orderRepo = connection.getRepository(Order);
        let orderInstance: Order;

        await orderRepo.createQueryBuilder('order')
            .leftJoinAndSelect('order.orderedProducts', 'orderedProducts')
            .leftJoinAndSelect('orderedProducts.product', 'product')
            .leftJoinAndSelect('product.comments', 'comments')
            .leftJoinAndSelect('comments.customer', 'customer')
            .where('order.id = :orderId', {orderId: orderId})
            .getOne().then((loadedOrder: Order) => {
                orderInstance = loadedOrder;
            });

        return orderInstance;
    },

    async createOrder(connection: any, customerId: number, orders: CompositeOrder[]) {

        const customerRepo = connection.getRepository(Customer);
        //const customerInstance: Customer;
        //let orderInstance: Order;

        const orderList: Order[] = [];

        orders.forEach((order) => {
            orderList.push(this.createNewOrder(order.order, order.merchantId));
        });

        //const newOrder = this.createNewOrder(orders);

        const persistedOrders: Order[] = [];
        orderList.forEach((newOrder: Order) => {
           this.saveOrder(newOrder, connection).then((res: any) => {
               persistedOrders.push(res);
           });
        });
        return persistedOrders;

    },

    async saveOrder(order: Order, connection: any) {
        const orderRepo = connection.getRepository(Order);
        await orderRepo.persist(order).then((res: any) => {
            return res;
        });
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
     * @returns {Order}
     * @param orders
     * @param merchantId
     */
     createNewOrder(orders: OrderItem[], merchantId: number): Order {
        const newOrder: Order = new Order();
        newOrder.name = 'Joe Flynn';
        newOrder.orderDate = new Date();
        newOrder.merchantId = merchantId;
        newOrder.orderedProducts = [];
        orders.forEach((order: OrderItem) => {
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

    async createMerchantOrders(order: Order) {

    }
};
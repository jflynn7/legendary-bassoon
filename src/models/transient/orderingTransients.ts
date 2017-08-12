import { Product } from '../merchant/Product';

export class CompositeOrder {
    merchantId: number;
    order: OrderItem[];

    constructor(data: any) {
        this.merchantId = data.merchantId;
        this.order = data.order;
    }
}

export class OrderItem {
    quantity: number;
    product: Product;

    constructor(data: any) {
        this.quantity = data.quantity;
        this.product = data.product;
    }
}
import { Product } from '../models/merchant/Product';
import { Comment } from '../models/customer/Comment';
import { Customer } from '../models/customer/Customer';

module.exports = {

    async addComment(connection: any, comment: Comment, productId: number, customerId: number) {
        const productRepo = connection.getRepository(Product);
        const customerRepo = connection.getRepository(Customer);

        let productInstance: Product;

        await customerRepo.findOneById(customerId).then((customer: Customer) => {
            comment.customer = customer;
        }).catch((err: any) => {
            console.log(err);
        });

        await productRepo.createQueryBuilder('product')
            .leftJoinAndSelect('product.comments', 'comments')
            .where('product.id = :productId', { productId : productId})
            .getOne().then((loadedCustomer: Product) => {
                productInstance = loadedCustomer;
                productInstance.comments.push(comment);
            }).then(() => {
                productRepo.persist(productInstance).then(() => {}).catch(() => {});
            }).catch((err: any) => {
                console.log(err);
            });

        return productInstance;

    },

    async removeComment(connection: any, commentId: number) {
        const commentRepo = connection.getRepository(Comment);
        commentRepo.findOneById(commentId).then((comment: Comment) => {
            commentRepo.remove(comment).then(() => {
                console.log('REMOVED');
                return true;
            });
        }).catch((err: Error) => {
            console.log(err);
            return false;
        });
    }
};
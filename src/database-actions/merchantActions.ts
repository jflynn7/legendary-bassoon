import { Merchant } from '../models/merchant/Merchant';
import { Product } from '../models/merchant/Product';

module.exports = {

    /**
     * Create a merchant
     * @param connection
     * @param {Merchant} merchant
     * @returns {Promise<any>}
     */
    async createMerchant(connection: any, merchant: Merchant) {
        const merchantRepo = connection.getRepository(Merchant);
        let savedMerchant;
        await merchantRepo.persist(merchant).then((result: any) => {
            savedMerchant = result;
        });
        return savedMerchant;
    },

    /**
     * Add to merchants product list
     * @param connection
     * @param {number} merchantId
     * @param {Product[]} products
     * @returns {Promise<Merchant>}
     */
    async addProductsToMerchant(connection: any, merchantId: number, products: Product[]) {

        const merchantRepo = connection.getRepository(Merchant);
        const productRepo = connection.getRepository(Product);

        let savedMerchant: Merchant;

        await merchantRepo.findOneById(merchantId).then((merchant: Merchant) => {
            productRepo.createQueryBuilder('product')
                .where('merchant = :merchantId', { merchantId : merchantId})
                .getMany().then((foundProducts: Product[]) => {
                products.forEach((product: Product) => {
                    foundProducts.push(product);
                });
                merchant.products = foundProducts;
                 merchantRepo.persist(merchant).then((result: any) => {
                    savedMerchant = result;
                 });
            });
        });

        return savedMerchant;
    },

    /**
     * Load merchant and all child relations
     * @param connection
     * @param {number} merchantId
     * @returns {Promise<Merchant>}
     */
    async loadMerchantById(connection: any, merchantId: number) {
        const merchantRepo = connection.getRepository(Merchant);
        let merchantInstance: Merchant;

        await merchantRepo.createQueryBuilder('merchant')
            .leftJoinAndSelect('merchant.products', 'products')
            .leftJoinAndSelect('products.comments', 'comments')
            .leftJoinAndSelect('comments.customer', 'customers')
            .leftJoinAndSelect('merchant.suppliers', 'suppliers')
            .where('merchant.id = :merchantId', { merchantId : merchantId})
            .getOne().then((loadedMerchant: Merchant) => {
                merchantInstance = loadedMerchant;
            });

        return merchantInstance;
    },
};
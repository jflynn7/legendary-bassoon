import { Merchant } from '../models/merchant/Merchant';
import { Product } from '../models/merchant/Product';

module.exports = {

    async createMerchant(connection: any, merchant: Merchant) {
        const merchantRepo = connection.getRepository(Merchant);
        let savedMerchant;
        await merchantRepo.persist(merchant).then((result: any) => {
            savedMerchant = result;
        });
        return savedMerchant;
    },

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

    async loadMerchantById(connection: any, merchantId: number) {
        const merchantRepo = connection.getRepository(Merchant);
        let merchantInstance: Merchant;

        await merchantRepo.createQueryBuilder('merchant')
            .leftJoinAndSelect('merchant.products', 'products')
            .leftJoinAndSelect('merchant.suppliers', 'suppliers')
            .where('merchant.id = :merchantId', { merchantId : merchantId})
            .getOne().then((loadedMerchant: Merchant) => {
                merchantInstance = loadedMerchant;
            });

        return merchantInstance;
    },
};
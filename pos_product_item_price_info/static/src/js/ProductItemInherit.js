/** @odoo-module **/
import ProductItem from 'point_of_sale.ProductItem'
import Registries from 'point_of_sale.Registries'


const {onWillStart} = owl;
const ProductItemInherit = (ProductItem) =>
    class ProductItemInherit extends ProductItem {
        setup(...args) {
            super.setup(...args);

        }

        async deliverInfo() {
            try {
                if (!this.props.product.productInfo) {
                    this.props.product.productInfo = {}; // Initialize with an empty object or default values
                }
                const info = await this.getInfo(this.props.product, 1);
                let priceWithoutTax = this.props.product.lst_price.toFixed(2);
                Object.assign(this.props.product.productInfo, {
                    priceWithoutTax: priceWithoutTax,
                    costCurrency: info.costCurrency,
                    marginCurrency: info.marginCurrency,
                    marginPercent: info.marginPercent
                });
            } catch (error) {
                console.error("Error in deliverInfo() ProductItemInherit class", error);
            }
        }

        async getInfo(product, quantity) {
            return this.env.pos.getProductInfo(product, quantity);
        }
        async infoClicked(event){
            event.stopPropagation();
            const info = await this.getInfo(this.props.product, 1);
            this.showPopup('ProductInfoPopup', { info: info , product: this.props.product });
        }
    }
Registries.Component.extend(ProductItem, ProductItemInherit)
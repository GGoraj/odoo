/** @odoo-module **/
// Created by: ggorajmp
// Date: 11-12-2023
import ProductScreen from 'point_of_sale.ProductScreen';
import Registries from 'point_of_sale.Registries';

const PrivatKundeProductScreen = (ProductScreen) => class DefaultClientProductScreen extends ProductScreen {
    setup(...args) {
        super.setup(args)

        if (this.currentOrder.get_partner() === null) {
            this.setPartner()
        }
    }


    /**
     * returns an array of partners
     */
    getPrivatKunde() {
        const partners = this.env.pos.partners
        return partners.filter(partner => partner.name === 'Privat Kunde')
    }

    // setting Privat Kunde as a default partner
    setPartner() {
        if (this.getPrivatKunde()) {
            let partner = this.getPrivatKunde()[0];
            this.currentOrder.set_partner(partner);
            this.currentOrder.updatePricelist(partner);
        }
    }

    // on Pay button clicked
    // set the invoice on or off
    async _onClickPay() {
        // if products selected and not set to invoice -> set to invoice
        if (this.env.pos.selectedOrder.orderlines.length > 0 && !this.currentOrder.is_to_invoice()) {
            this.currentOrder.set_to_invoice(true);
        }
        // if products not selected and set to invoice - set NOT to invoice
        if (this.env.pos.selectedOrder.orderlines.length === 0 && this.currentOrder.is_to_invoice()) {
            this.currentOrder.set_to_invoice(false);
        }

        if (this.env.pos.get_order().orderlines.some(line => line.get_product().tracking !== 'none' && !line.has_valid_product_lot()) && (this.env.pos.picking_type.use_create_lots || this.env.pos.picking_type.use_existing_lots)) {
            const {confirmed} = await this.showPopup('ConfirmPopup', {
                title: this.env._t('Some Serial/Lot Numbers are missing'),
                body: this.env._t('You are trying to sell products with serial/lot numbers, but some of them are not set.\nWould you like to proceed anyway?'),
                confirmText: this.env._t('Yes'),
                cancelText: this.env._t('No')
            });
            if (confirmed) {
                this.showScreen('PaymentScreen');
            }
        } else {
            this.showScreen('PaymentScreen');
        }
    }
}

Registries.Component.extend(ProductScreen, PrivatKundeProductScreen)


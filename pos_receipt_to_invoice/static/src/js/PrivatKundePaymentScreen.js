/** @odoo-module **/
// Created by: ggorajmp
// Date: 11-12-2023
import ProductScreen from 'point_of_sale.ProductScreen';
import Registries from 'point_of_sale.Registries';

const PrivatKundePaymentScreen = (PaymentScreen) =>
    class PrivatKundePaymentScreen extends PaymentScreen {
        setup(...args) {
            super.setup(args)

            if (this.currentOrder.get_partner() === null || this.props.partner === null) {
                this.setPartner()
            }

            // 'Privat Kunde' is always default
            if (this.currentOrder.get_partner() === null || this.props.partner === null) {
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

    }


Registries.Component.extend(ProductScreen, PrivatKundePaymentScreen)


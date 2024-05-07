/** @odoo-module **/
// Created by: ggorajmp
// Date: 11-12-2023
import PartnerListScreen from 'point_of_sale.PartnerListScreen';
import Registries from 'point_of_sale.Registries';


const PrivatKundePartnerListScreen = (PartnerListScreen) =>
    class PrivatKundePartnerListScreen extends PartnerListScreen {
        setup(...args) {
            super.setup(args)
            if (this.props.partner === null) {
                this.setPartner()
            }
        }

        clickPartner(partner) {
            if (this.state.selectedPartner && this.state.selectedPartner.id === partner.id) {
                this.state.selectedPartner = this.getPrivatKunde()[0];
            } else {
                this.state.selectedPartner = partner;
            }
            this.confirm();
        }

        //returns an array of partners
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

Registries.Component.extend(PartnerListScreen, PrivatKundePartnerListScreen)


/** @odoo-module **/
// Created by: ggorajmp
// Date: 11-12-2023
import PaymentScreen from 'point_of_sale.PaymentScreen';
import Registries from 'point_of_sale.Registries';
import {float_is_zero} from 'web.utils';


const PrivatKundeKreditDeposit = (PaymentScreen) =>
    class PrivatKundeKreditDeposit extends PaymentScreen {
        //@override
        async validateOrder(isForceValidate) {

            // preventing cashier from depositing money to 'Privat Kunde' account
            if (this.currentOrder.get_partner().name === 'Privat Kunde' && this.currentOrder.get_orderlines().length === 0) {
                await this.showPopup('ErrorPopup', {
                    title: this.env._t('Deposit Error'),
                    body: this.env._t('Clients without a customer account cannot make a deposit.')
                });
                return;
            }

            const order = this.currentOrder;
            const change = order.get_change();
            const paylaterPaymentMethod = this.env.pos.payment_methods.filter(
                (method) =>
                    this.env.pos.config.payment_method_ids.includes(method.id) && method.type == 'pay_later')[0];
            const existingPayLaterPayment = order
                .get_paymentlines()
                .find((payment) => payment.payment_method.type == 'pay_later');
            if (
                order.get_orderlines().length === 0 &&
                !float_is_zero(change, this.env.pos.currency.decimal_places) &&
                paylaterPaymentMethod &&
                !existingPayLaterPayment
            ) {
                const partner = order.get_partner();
                if (partner) {
                    const {confirmed} = await this.showPopup('ConfirmPopup', {
                        title: this.env._t('The order is empty'),
                        body: _.str.sprintf(
                            this.env._t('Do you want to deposit %s to %s?'),
                            this.env.pos.format_currency(change),
                            order.get_partner().name
                        ),
                        confirmText: this.env._t('Yes'),
                    });
                    if (confirmed) {
                        const paylaterPayment = order.add_paymentline(paylaterPaymentMethod);
                        paylaterPayment.set_amount(-change);
                        return super.validateOrder(...arguments);
                    }
                } else {
                    const {confirmed} = await this.showPopup('ConfirmPopup', {
                        title: this.env._t('The order is empty'),
                        body: _.str.sprintf(
                            this.env._t(
                                'Do you want to deposit %s to a specific customer? If so, first select him/her.'
                            ),
                            this.env.pos.format_currency(change)
                        ),
                        confirmText: this.env._t('Yes'),
                    });
                    if (confirmed) {
                        const {confirmed: confirmedPartner, payload: newPartner} = await this.showTempScreen(
                            'PartnerListScreen'
                        );
                        if (confirmedPartner) {
                            order.set_partner(newPartner);
                        }
                        const paylaterPayment = order.add_paymentline(paylaterPaymentMethod);
                        paylaterPayment.set_amount(-change);
                        return super.validateOrder(...arguments);
                    }
                }
            } else {
                return super.validateOrder(...arguments);
            }
        }
    };

Registries.Component.extend(PaymentScreen, PrivatKundeKreditDeposit);
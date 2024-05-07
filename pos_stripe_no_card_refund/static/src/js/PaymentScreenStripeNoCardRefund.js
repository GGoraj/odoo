/** @odoo-module **/
import PaymentScreen from 'point_of_sale.PaymentScreen';
import Registries from 'point_of_sale.Registries';

const {useListener} = require("@web/core/utils/hooks");
const {fetchPosTransactionReference} = require('pos_stripe_no_card_refund.PosPaymentService');
const {stripeRefund} = require('pos_stripe_no_card_refund.StripeRefundService');
const Exceptions = require('pos_stripe_no_card_refund.Exceptions')
const utils = require('web.utils');


const PaymentScreenStripeNoCardRefund = (PaymentScreen) => {
    class PaymentScreenStripeNoCardRefund extends PaymentScreen {
        setup(...args) {
            super.setup(...args);
            useListener('send-refund', this._sendRefund);
        }

        async _sendRefund({detail: line}) {
            const lineUid = line.order.uid;
            console.log('order name', lineUid)
            const refundLines = this.env.pos.toRefundLines
            const refundLinesValues = Object.values(refundLines);

            const refundLinesFiltered = refundLinesValues.filter((entry) => {
                return entry.destinationOrderUid === lineUid
            });

            // get the total refund sum with tax
            const refundAmount = this.getRefundAmountWithTax(refundLinesFiltered);
            console.log('refund taxed amount', refundAmount)

            // id referring to original order, it reflects pos_order_id column in pos_payment in database
            // each orderline belongs to the same order, hence each orderBackendId is the same.
            const orderBackendId = refundLinesFiltered[0].orderline.orderBackendId;

            const stripe_reference = await fetchPosTransactionReference(orderBackendId);
            console.log('stripe reference', stripe_reference);

            stripeRefund(stripe_reference, refundAmount).then((r) => {
                if (r === true) {
                    line.set_payment_status("done") // status="" displays only payment line instead of 'payment success'
                } else {
                    line.set_payment_status('retry');
                    console.error(r)
                }
                // Automatically validate the order when after an electronic payment,
                // the current order is fully paid and due is zero.
                if (
                    this.currentOrder.is_paid() &&
                    utils.float_is_zero(this.currentOrder.get_due(), this.env.pos.currency.decimal_places)
                ) {
                    this.trigger('validate-order');
                }
            }).catch(error => {
                line.set_payment_status('retry'); // Set payment status to failed or another appropriate status

                if (error instanceof Exceptions.NotANumberException) {
                    // This is where you handle the specific RefundAmountError
                    this.showPopup('ErrorPopup', {
                        title: this.env._t('Amount Type Not A Number'),
                        body: this.env._t(error.message),
                    });
                }
                if (error instanceof Exceptions.RefundAmountError) {
                    // This is where you handle the specific RefundAmountError
                    this.showPopup('ErrorPopup', {
                        title: this.env._t('Invalid Refund Amount'),
                        body: this.env._t(error.message),
                    });
                }
                if (error instanceof Exceptions.StripeReferenceMissingError) {
                    // This is where you handle the specific RefundAmountError
                    this.showPopup('ErrorPopup', {
                        title: this.env._t('Stripe Reference Error'),
                        body: this.env._t(error.message),
                    });
                }
                if (error instanceof Exceptions.InvalidStripeReferenceFormat) {
                    // This is where you handle the specific RefundAmountError
                    this.showPopup('ErrorPopup', {
                        title: this.env._t('Invalid Stripe Reference Format'),
                        body: this.env._t(error.message),
                    });
                }
                if (error instanceof Exceptions.StripeRefundFailure) {
                    // This is where you handle the specific RefundAmountError
                    this.showPopup('ErrorPopup', {
                        title: this.env._t('Stripe refund failed'),
                        body: this.env._t(error.message),
                    });
                } else {
                    console.error('refund failed', error.message)
                    line.set_payment_status('retry');
                }
            });
        }


        getRefundAmountWithTax(refundLines) {
            // available taxes set up in the system
            const availableTaxes = this.env.pos.taxes_by_id;

            // initialize empty result amount
            let taxedDiscountedAmount = 0;
            refundLines.forEach(rf => {
                let qty = rf.qty;
                // calculate discount
                // Assuming rf.orderline.price, rf.orderline.discount, and qty are already defined
                let price = rf.orderline.price;
                const discount = rf.orderline.discount;

                console.warn('discount ', discount)

                // Calculate the price after discount
                let priceDiscounted = price - (price * discount / 100);
                priceDiscounted = this.roundStripeStyle(priceDiscounted);

                // multiply the discounted price by the quantity in single line
                priceDiscounted *= qty;

                const selectedTaxes = rf.orderline.tax_ids;

                // if taxes are not defined
                if (selectedTaxes.length === 0) {
                    // add price with discount multiplied by qty and iterate over next refund line
                    taxedDiscountedAmount += priceDiscounted;
                } else {
                    // sum all user selected taxes and
                    let sumSelectedTaxes = 0;
                    for (let i = 0; i < selectedTaxes.length; i++) {
                        sumSelectedTaxes += availableTaxes[selectedTaxes[i]].amount;
                    }
                    // return the amount + taxes
                    let amount = priceDiscounted * (1 + sumSelectedTaxes / 100);
                    taxedDiscountedAmount += amount;
                }

            });
            //taxedDiscountedAmount = this.roundStripeStyle(taxedDiscountedAmount);
            console.warn('final taxedDiscountedAmount before r', taxedDiscountedAmount);
            taxedDiscountedAmount = this.roundStripeStyle(taxedDiscountedAmount);
            console.warn('Rounded taxedDiscountedAmount', taxedDiscountedAmount);
            return taxedDiscountedAmount;
        }

        roundCashAmountUp(amount) {
            return Math.round(amount * 100) / 100;
        }

        roundStripeStyle(amount) {
            // Multiply by 100 to work with cents instead of dollars
            let cents = amount * 100;
            // Get the fractional part of the cents
            let fractionalCents = cents % 1;
            // Determine whether to round up or down
            if (fractionalCents >= 0.5) {
                // Round up
                return Math.ceil(cents) / 100;
            } else {
                // Round down
                return Math.floor(cents) / 100;
            }
        }
    }
    return PaymentScreenStripeNoCardRefund;
}

Registries.Component.extend(PaymentScreen, PaymentScreenStripeNoCardRefund)

odoo.define('pos_stripe_confirmation.PaymentStripeConfirmation', function (require) {
    "use strict";
    const PaymentStripe = require('pos_stripe.payment');

    PaymentStripe.include({
        collectPayment: async function (amount) {
            let line = this.pos.get_order().selected_paymentline;
            let clientSecret = await this.fetchPaymentIntentClientSecret(line.payment_method, amount);
            if (!clientSecret) {
                line.set_payment_status('retry');
                return false;
            }
            line.set_payment_status('waitingCard');
            let collectPaymentMethod = await this.terminal.collectPaymentMethod(clientSecret);

            if (collectPaymentMethod.error) {
                this._showError(collectPaymentMethod.error.message, collectPaymentMethod.error.code);
                line.set_payment_status('retry');
                return false;
            } else {
                line.set_payment_status('waitingCapture');
                let processPayment = await this.terminal.processPayment(collectPaymentMethod.paymentIntent);

                line.card_details = collectPaymentMethod.paymentIntent.sdk_payment_details.card_payment // newly added
                if (processPayment.error) {
                    this._showError(processPayment.error.message, processPayment.error.code);
                    line.set_payment_status('retry');
                    return false;
                } else if (processPayment.paymentIntent) {
                    line.last4 = processPayment.paymentIntent.charges.data[0].payment_method_details.card_present.last4;
                    line.set_payment_status('waitingCapture');
                    const interacTransactionId = this._getInteracTransactionId(processPayment);
                    if (interacTransactionId) {
                        // Canadian interac payments should not be captured:
                        // https://stripe.com/docs/terminal/payments/regional?integration-country=CA#create-a-paymentintent
                        line.card_type = 'interac';
                        line.transaction_id = interacTransactionId;
                    } else {
                        await this.captureAfterPayment(processPayment, line);
                    }
                    line.set_payment_status('done');
                    return true;
                }
            }
        },
        _getInteracTransactionId: function (processPayment) {
            const intentCharge = processPayment.paymentIntent.charges.data[0];
            const processPaymentDetails = intentCharge.payment_method_details;
            if (processPaymentDetails.type === 'interac_present') {
                return intentCharge.id;
            }

            return false;
        }
    });
});




odoo.define('pos_stripe_no_card_refund.StripeRefundService', function (require) {
    "use strict";

    const rpc = require('web.rpc');
    const Exceptions = require('pos_stripe_no_card_refund.Exceptions');

    async function stripeRefund(reference, amount) {

        if (!reference) {
            throw new Exceptions.StripeReferenceMissingError('Error fetching stripe reference');
        }

        if(!isValidStripeReference(reference)) {
            throw new Exceptions.InvalidStripeReferenceFormat('Invalid stripe reference');
        }

        if(typeof amount !== 'number') {
            throw new Exceptions.NotANumberException('Amount has to be a number');
        }

        if (amount <= 0) {
            console.log('amount', amount)
            throw new Exceptions.RefundAmountError('Amount should be greater then 0')
        }

        try {
            const response = await rpc.query({
                route: '/pos/stripe/refund',
                params: {reference: reference, amount: amount}, // Ensure amount is dynamic
            });

            if (response.success === true) {
                return response.success;
            } else {
                return response.message
            }
        } catch (error) {
            console.error('rpc call failed', error);
            throw new Exceptions.StripeRefundFailure('Rpc call failed')
        }
    }

    // stripe reference validator
    function isValidStripeReference(ref) {
        const pattern = /^pi_[A-Za-z0-9]+$/;
        return pattern.test(ref);
    }

    return {stripeRefund: stripeRefund};
});






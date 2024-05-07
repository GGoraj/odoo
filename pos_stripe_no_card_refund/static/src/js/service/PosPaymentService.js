odoo.define('pos_stripe_no_card_refund.PosPaymentService', require => {
    "use strict";

    const rpc = require('web.rpc');

    // returns transaction reference
    async function fetchPosTransactionReference(order_id) {
        try {
            const paymentResult = await rpc.query({
                model: 'pos.payment',
                method: 'search_read',
                domain: [['pos_order_id', '=', order_id]],
                fields: ['transaction_id'],
            });
            if (paymentResult[0].transaction_id) {
                return paymentResult[0].transaction_id;
            } else {
                console.error('PosPaymentService could not fetch the transaction reference')
                return null;
            }
        } catch (error) {
            console.error('Exception while fetching POS transaction reference:', error);
            return null;
        }
    }

    return {
        fetchPosTransactionReference: fetchPosTransactionReference
    };
});
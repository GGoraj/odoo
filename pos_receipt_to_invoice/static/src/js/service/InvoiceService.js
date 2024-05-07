odoo.define('pos_receipt_to_invoice.InvoiceService', require => {
    "use strict";

    const error_logger = require('pos_receipt_to_invoice.error_logger');
    const rpc = require('web.rpc');

    // Using the rpc service to make a call to the server
    // returns map of to items: account_move and access_token fields from order.pos
    // account_move is used to make sure we got the proper account_move reference for the current order
    async function fetchDataPosOrder(order_id) {
        try {
            const result = await rpc.query({
                model: 'pos.order',
                method: 'read',
                args: [[order_id], ['account_move', 'access_token']],
            });

            if (result && result.length > 0) {
                const account_move = result[0].account_move[0];
                const access_token = result[0].access_token;

                let map = new Map();
                map.set('id', result[0].id);
                map.set('account_move', account_move);
                map.set('access_token', access_token);
                return map;
            } else {
                return null;
            }
        } catch (error) {
            error_logger.log(error)
        }
    }

    // fetches account_move data (representing generated invoice)
    // in order for future creation of the receipt
    // amount_residual is the amount due
    async function fetchDataAccountMove(id) {
        try {
            const result = await rpc.query({
                model: 'account.move',
                method: 'read',
                args: [[id], ['amount_total', 'amount_residual', 'date', 'invoice_date', 'invoice_date_due',
                    'invoice_origin', 'name', 'payment_reference', 'ref',]],
            });
            if (result && result.length > 0) {

                const payment_reference = result[0].payment_reference;
                const date = result[0].date;
                const amount_residual = result[0].amount_residual;
                const invoice_date_due = result[0].invoice_date_due;
                const invoice_origin = result[0].invoice_origin;
                const customer_reference = result[0].ref;

                const map = new Map();

                if (payment_reference !== undefined) {
                    map.set('payment_reference', payment_reference);
                }
                if (date !== undefined) {
                    map.set('date', date);
                }
                if (amount_residual !== undefined) {
                    map.set('amount_residual', amount_residual);
                }
                if (invoice_date_due !== undefined) {
                    map.set('invoice_date_due', invoice_date_due);
                }
                if (invoice_origin !== undefined) {
                    map.set('invoice_origin', invoice_origin);
                }
                if (customer_reference !== undefined) {
                    map.set('customer_reference', customer_reference);
                }
                return map;
            } else {
                return null;
            }
        } catch (error) {
            error_logger.log(error)
        }
    }

    return {
        fetchDataPosOrder: fetchDataPosOrder,
        fetchDataAccountMove: fetchDataAccountMove
    };
});
/** @odoo-module **/
import PosComponent from 'point_of_sale.PosComponent';
import Registries from 'point_of_sale.Registries';

const { onWillStart } = owl;

class StripeConfirmation extends PosComponent {
    setup(...args) {
        super.setup(...args);

        onWillStart(() => {
            const order = this.env.pos.get_order();
            let paymentline = order.selected_paymentline;
            // Use destructuring and find() for more clarity and efficiency
            const oneOfManyPaymentLines = order.paymentlines.find((pl) => pl.transaction_id !== "");

            // Simplify the logic for selecting paymentline
            paymentline = paymentline?.card_details ? paymentline : oneOfManyPaymentLines;

            if (paymentline) { // Simplified conditional check
                // Use optional chaining for safer property access
                const dateTime = paymentline.order.formatted_validation_date.split(' ');
                const { amount, transaction_id, card_type, last4, order: {name}, payment_status, name: paymentName } = paymentline;
                const { card_entry_method } = paymentline.card_details || {};

                this.confirmation_data = {
                    amount: this.env.pos.format_currency(amount),
                    card_entry_method: card_entry_method?.charAt(0).toUpperCase() + card_entry_method?.slice(1).toLowerCase(),
                    card_type: card_type.charAt(0).toUpperCase() + card_type.slice(1).toLowerCase(),
                    masked_pan: '* * * * * * * * * * * * ' + last4,
                    order_name: name,
                    payment_status: payment_status === "done" ? "Approved" : "Declined",
                    payment_type: paymentName,
                    pos_name: this.env.pos.config.name,
                    transaction_id: transaction_id,
                    validation_date: dateTime[0],
                    validation_time: dateTime[1],
                };
            }
        });
    }
}

StripeConfirmation.template = 'StripeConfirmation';

Registries.Component.add(StripeConfirmation);

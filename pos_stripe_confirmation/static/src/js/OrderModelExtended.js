odoo.define('point_of_sale.OrderModelExtended', function (require) {
    "use strict";

    const {Order} = require('point_of_sale.models')
    const Registries = require('point_of_sale.Registries');
    const OrderModelExtended = (Order) => {
        class OrderModelExtended extends Order {
            is_paid_with_card() {
                return !!this.paymentlines.find((pl)=>{
                    return pl.last4 && pl.transaction_id !== null;
                });
            }
        }
        return OrderModelExtended;
    }
    Registries.Model.extend(Order, OrderModelExtended)
});

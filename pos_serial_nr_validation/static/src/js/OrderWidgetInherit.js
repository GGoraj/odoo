/** @odoo-module **/

import Registries from 'point_of_sale.Registries';
import OrderWidget from 'point_of_sale.OrderWidget';

// this code overrides _editPackLotLines method and passes product_id information to 'EditListPopup' for validation purpose
const OrderWidgetInherit = (OrderWidget) =>
    class OrderWidgetInherit extends OrderWidget {
        async _editPackLotLines(event) {
            const orderline = event.detail.orderline;
            const isAllowOnlyOneLot = orderline.product.isAllowOnlyOneLot();
            const packLotLinesToEdit = orderline.getPackLotLinesToEdit(isAllowOnlyOneLot);
            const { confirmed, payload } = await this.showPopup('EditListPopup', {
                title: this.env._t('Lot/Serial Number(s) Required'),
                isSingleItem: isAllowOnlyOneLot,
                array: packLotLinesToEdit,
                product_id: orderline.product.id // added
            });
            if (confirmed) {
                // Segregate the old and new packlot lines
                const modifiedPackLotLines = Object.fromEntries(
                    payload.newArray.filter(item => item.id).map(item => [item.id, item.text])
                );
                const newPackLotLines = payload.newArray
                    .filter(item => !item.id)
                    .map(item => ({ lot_name: item.text }));

                orderline.setPackLotLines({ modifiedPackLotLines, newPackLotLines });
            }
            this.order.select_orderline(event.detail.orderline);
        }
    }

Registries.Component.extend(OrderWidget, OrderWidgetInherit);
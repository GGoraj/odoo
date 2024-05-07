/** @odoo-module **/
import OrderReceipt from 'point_of_sale.OrderReceipt';
import Registries from 'point_of_sale.Registries';
import error_logger from 'pos_receipt_to_invoice.error_logger';
import InvoiceService from 'pos_receipt_to_invoice.InvoiceService';

const {useState, onWillStart} = owl;
const InvoiceConvertedReceipt = (OrderReceipt) =>
    class InvoiceConvertedReceipt extends OrderReceipt {
        setup(...args) {
            super.setup(args);
            if (!this.state) {
                this.state = useState({
                    // invoice name
                    inv_payment_reference: null,
                    // faktura dato
                    inv_date: null,
                    // forfalds dato (due date)
                    inv_invoice_date_due: null,
                    inv_company: null,
                    // 'kilde' (source)  or 'reference' - field invoice_origin
                    inv_source: null,
                    inv_customer_reference: null
                });
            }

            // to prevent running that part in ReprintOrder component
            if (!this.props.reprint_order) {
                // before OrderReceipt component is rendered for the first time
                onWillStart(() => this.getInvoiceData())// end of setup
            }
        }

        // get account_move by order id
        getOrderId(context, order_name) {
            const orders_ids = context.env.pos.validated_orders_name_server_id_map;
            let order_id = orders_ids[order_name];
            return order_id ? order_id : -1;
        }

        async getInvoiceData() {
            // let's get the order's name
            let order_name = this.props.order.name;
            let order_id = this.getOrderId(this, order_name);
            // get current order's access_token for comparison
            let order_token = this.props.order.access_token;
            if (order_id && order_name && order_token) {
                InvoiceService.fetchDataPosOrder(order_id).then((map) => {
                    try {

                        let record_id = map.get('id')
                        let account_move = map.get('account_move')
                        let record_access_token = map.get('access_token')

                        // we want to check if fetched PosOrder record has the same access+token as Pos Session's Order
                        // if it does, then we know we have appropriate db record to work with.
                        // we doublecheck it, because only 'id' in this table is unique according to schema
                        if (account_move && order_id && record_id && order_token === record_access_token) {
                            InvoiceService.fetchDataAccountMove(account_move).then((map) => {
                                // assign appropriate attributes to state's properties
                                this.state.inv_payment_reference = map.get('payment_reference')
                                this.state.inv_date = map.get('date')
                                this.state.inv_invoice_date_due = map.get('invoice_date_due')
                                this.state.inv_source = map.get('invoice_origin')
                                let reference = map.get('customer_reference');
                                const regex = /Checkout(.*)/;
                                const match = reference.match(regex);
                                if (match && match[1]) reference = match[0].trim()
                                this.state.inv_customer_reference = reference;
                                this.state.inv_company = this.env.pos.company.name
                            })
                        }
                    } catch (error) {
                        error_logger.log('fetchDataPosOrder in InvoiceConvertedReceipt')
                    }
                })// end of fetchDataPosOrder
            }
        } // end of

    }
Registries.Component.extend(OrderReceipt, InvoiceConvertedReceipt);
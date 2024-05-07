/** @odoo-module **/
import ReprintReceiptScreen from 'point_of_sale.ReprintReceiptScreen';
import Registries from 'point_of_sale.Registries';
import error_logger from 'pos_receipt_to_invoice.error_logger';
import InvoiceService from 'pos_receipt_to_invoice.InvoiceService';


const {useState, onWillStart} = owl;
const InvoiceConvertedReprintReceiptScreen = (ReprintReceiptScreen) =>
    class InvoiceConvertedReprintReceipt extends ReprintReceiptScreen {
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
                    inv_company: this.env.pos.company.name,
                    // 'kilde' (source)  or 'reference' - field invoice_origin
                    inv_source: null,
                    inv_customer_reference: null
                });
            }

            // before OrderReceipt component is rendered for the first time
            if (this.props.order) {
                onWillStart(async () => {
                    await this.getInvoiceData().then((map) => {
                        if (map) {
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
                        }
                    });
                })
            }
        }

        async getInvoiceData() {
            try {
                let account_move = this.props.order.account_move;
                let optional = null;
                if(account_move) {
                    optional = InvoiceService.fetchDataAccountMove(account_move);
                }

                return optional;
            } catch (error) {
                error_logger.log(error);
            }
        }

    }
Registries.Component.extend(ReprintReceiptScreen, InvoiceConvertedReprintReceiptScreen);
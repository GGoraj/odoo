/** @odoo-module **/
import ReceiptScreen from 'point_of_sale.ReceiptScreen';
import Registries from 'point_of_sale.Registries';


const {onMounted, useRef, status} = owl;

const ReceiptScreenInherit = (ReceiptScreen) => {
    class ReceiptScreenInherit extends ReceiptScreen {

        // extended original setup method in order to introduce conditional print
        // responsible for rendering the OrderReceipt or StripeConfirmation component
        setup(...args) {
            super.setup(...args);
            // stripe confirmation reference
            this.stripeConfirmation = useRef('stripe-confirmation');

            if (this.props.should_print_confirmation && this.stripeConfirmation.el) {

                onMounted(() => {
                    //stripe confirmation
                    setTimeout(async () => {
                        if (status(this) === "mounted") {
                            let images = this.stripeConfirmation.el.getElementsByTagName('img');
                            for (let image of images) {
                                await image.decode();
                            }
                            await this.handleAutoPrint();
                        }
                    }, 0);
                });
            }
        }

        // on click function
        async printConfirmationClicked() {
            // print
            await this._printStripeConfirmation()
        }

    }

    return ReceiptScreenInherit;
}

Registries.Component.extend(ReceiptScreen, ReceiptScreenInherit)


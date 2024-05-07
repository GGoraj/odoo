/** @odoo-module **/
import AbstractReceiptScreen from 'point_of_sale.AbstractReceiptScreen';
import Registries from 'point_of_sale.Registries';
const { nextFrame } = require('point_of_sale.utils');
const { useRef } = owl;

const AbstractReceiptScreenInherit = (AbstractReceiptScreen) => {
    class AbstractReceiptScreenInherit extends AbstractReceiptScreen {

        // extended original setup method in order to introduce conditional print
        // responsible for rendering the OrderReceipt or StripeConfirmation component
        setup(...args) {
            super.setup(...args);
            // stripe confirmation reference
            this.stripeConfirmation = useRef('stripe-confirmation');
        }
        async _printStripeConfirmation() {
            if (this.env.proxy.printer) {
                const printResult = await this.env.proxy.printer.print_receipt(this.stripeConfirmation.el.innerHTML);
                if (printResult.successful) {
                    return true;
                } else {
                    await this.showPopup('ErrorPopup', {
                        title: printResult.message.title,
                        body: printResult.message.body,
                    });
                    const {confirmed} = await this.showPopup('ConfirmPopup', {
                        title: printResult.message.title,
                        body: this.env._t('Do you want to print using the web printer?'),
                    });
                    if (confirmed) {
                        // We want to call the _printWeb when the popup is fully gone
                        // from the screen which happens after the next animation frame.
                        await nextFrame();
                        return await this._printWeb();
                    }
                    return false;
                }
            } else {
                return await this._printWeb();
            }
        }
    }

    return AbstractReceiptScreenInherit;
}

Registries.Component.extend(AbstractReceiptScreen, AbstractReceiptScreenInherit)


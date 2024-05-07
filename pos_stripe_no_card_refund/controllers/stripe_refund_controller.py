from odoo import http
from odoo.http import request
import stripe


class StripeRefundController(http.Controller):

    @http.route('/pos/stripe/refund', type='json', auth='public', methods=['POST'], csrf=False)
    def process_stripe_refund(self, **kw):

        # Access parameters from the JSON body
        params = request.params
        reference = params['reference']
        if not reference:
            raise ValueError("Missing reference or transaction_id")

        transaction_id = reference
        amount = params['amount']  # Make sure amount is in cents if required by your Stripe account currency
        print('AMOUNT to refund', amount )
        amount = int(amount * 100)  # Convert to ore
        stripe_api_key = request.env['ir.config_parameter'].sudo().get_param('stripe_secret_key')
        stripe.api_key = stripe_api_key

        try:
            if not transaction_id or amount is None:
                raise ValueError("Missing transaction_id or amount")

            refund = stripe.Refund.create(
                payment_intent=transaction_id,
                amount=amount,
            )
            # Success response
            return {
                "success": True,
                "message": "Refund processed successfully",
                "refund_id": refund
            }
        except Exception as e:
            print('refund error', e)
            return {
                "success": False,
                "message": str(e)
            }

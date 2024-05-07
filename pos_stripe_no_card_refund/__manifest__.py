# -*- coding: utf-8 -*-
{
    'name': "Stripe No Card Refund",
    'summary': """ Module creates possibility for Stripe refund without customer interaction""",
    'author': "ggorajmp",
    'category': 'Customizations',
    'version': '16.0.1.0.0',
    'depends': ['point_of_sale', 'pos_stripe'],
    'assets': {
        'point_of_sale.assets': [
            'pos_stripe_no_card_refund/static/src/js/exceptions/exceptions.js',
            'pos_stripe_no_card_refund/static/src/js/service/StripeRefundService.js',
            'pos_stripe_no_card_refund/static/src/js/PaymentScreenStripeNoCardRefund.js',
            'pos_stripe_no_card_refund/static/src/xml/PaymentScreenPaymentLinesStripeNoCardRefund.xml',
            'pos_stripe_no_card_refund/static/src/js/service/PosPaymentService.js',
        ]
    },
    'license': 'LGPL-3'
}

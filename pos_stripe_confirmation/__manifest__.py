# -*- coding: utf-8 -*-
{
    'name': "Stripe Card Payment Confirmation",
    'summary': """ Stripe Card Payment Confirmation """,
    'author': "ggorajmp",
    'category': 'Customizations',
    'version': '16.0.1.0.0',
    'depends': ['point_of_sale', 'pos_stripe'],
    'assets': {
        'point_of_sale.assets': [
            'pos_stripe_confirmation/static/src/css/confirmation.css',
            'pos_stripe_confirmation/static/src/js/AbstractReceiptScreenInherit.js',
            'pos_stripe_confirmation/static/src/js/PaymentScreenInherit.js',
            'pos_stripe_confirmation/static/src/js/PaymentStripeConfirmation.js',
            'pos_stripe_confirmation/static/src/js/ReceiptScreenInherit.js',
            'pos_stripe_confirmation/static/src/xml/ReceiptScreenInherit.xml',
            'pos_stripe_confirmation/static/src/js/StripeConfirmation.js',
            'pos_stripe_confirmation/static/src/xml/ReceiptScreenConfirmationPrintBtn.xml',
            'pos_stripe_confirmation/static/src/xml/StripeConfirmation.xml',
            'pos_stripe_confirmation/static/src/js/OrderModelExtended.js',
        ]
    },
    'license': 'LGPL-3'
}
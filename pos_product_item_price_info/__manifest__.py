# -*- coding: utf-8 -*-
{
    'name': "Pos Product Item Price Information",
    'summary': """ Cost, Margin and Price excl Vat amounts are available to view for each Product Item,""",
    'description':""" Cost, Margin and Price excl Vat amounts are available to view for each Product Item object,
    alowing our cashier to calculate the best offer that can be presented to the customer.
    Simply click the 'i' icon at the lower right corner to see required data.""",
    'author': "ggorajmp",
    'category': 'Customizations',
    'version': '16.0.1.0.0',
    'depends': ['base', 'point_of_sale'],

    'assets': {
        'point_of_sale.assets': [
            'pos_product_item_price_info/static/src/js/ProductItemInherit.js',
            'pos_product_item_price_info/static/src/xml/ProductItemInherit.xml',
        ]
    },
    'installable': True,
    'application': False,
    'license': 'LGPL-3'
}

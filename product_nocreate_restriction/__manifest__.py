# -*- coding: utf-8 -*-
{
    'name': "Product Creation Disabled",
    'summary': """ Product Creation Disabled in Purchase and Sales Notebooks""",
    'author': "ggorajmp",
    'category': 'Customizations',
    'version': '16.0.1.0.0',
    'depends': ['sale', 'purchase'],
    'data': [
        "views/SaleOrderFormProductCreationDisabled.xml",
        "views/PurchaseOrderFormProductCreationDisabled.xml",
    ],
    'installable': True,
    'application': False,
    'license': 'LGPL-3'
}

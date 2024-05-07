# -*- coding: utf-8 -*-
{
    'name': "Pos serial nr field validation",
    'summary': """ This module ensures that only numbers and capital letters are allowed in the Lot/Serial Number.
     Serial number must exist in the db.""",
    'description': """For the 'Lot/Serial Number' field, 
                        constraints are applied to validate the input. 
                        Any characters not meeting the criteria are subsequently removed from the field """,
    'author': "ggorajmp",
    'category': 'Customizations',
    'version': '16.0.1.1.0',
    'depends': ['point_of_sale', 'stock'],
    'assets': {
        'point_of_sale.assets': [
            'pos_serial_nr_validation/static/src/css/styles.css',
            'pos_serial_nr_validation/static/src/xml/EditListPopupInherit.xml',
            'pos_serial_nr_validation/static/src/xml/EditListInputInherit.xml',

            'pos_serial_nr_validation/static/src/js/EditListPopupInherit.js',
            'pos_serial_nr_validation/static/src/js/StockLotGlobalState.js',
            'pos_serial_nr_validation/static/src/js/EditListInputInherit.js',
            'pos_serial_nr_validation/static/src/js/ProductScreenInherit.js',
            'pos_serial_nr_validation/static/src/js/OrderWidgetInherit.js',

            'pos_serial_nr_validation/static/src/js/helpers/PopupValidationHelper.js',
            'pos_serial_nr_validation/static/src/js/helpers/InputValidationHelper.js',
        ]
    },
    'license':'LGPL-3'
}

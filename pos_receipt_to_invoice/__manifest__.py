# -*- coding: utf-8 -*-
{
    'name': "Pos Receipt to Invoice",
    'summary': """ The primary objective of this module is to mandate that the Point of Sale (POS) system\n
        issues an invoice for all non-business transactions.\nTo facilitate this, the module automatically creates
        a customer profile named 'Privat Kunde'. Consequently, all private sales are attributed to 'Privat Kunde'.\n
        As a result, invoices are generated in place of traditional receipts.\n
        Additionally, 'Privat Kunde' is set as the default client in the POS system for all such transactions.\n
        Receipt Reprints and Accepted Deposits are available\n
        Version 16.0.1.2.0 - fixed displaying 'Deposit Accepted' for invoices from before receipt-to-invoice conversion\n
        Version 16.0.1.3.0 - new error message introduced while attempting to invoice customer deposits in POS.
        Version 16.0.1.4.0 - rearanged faktura dato, dates are together now. 
        Version 16.0.1.5.0 - some elements translated to Danish""",

    'author': "ggorajmp",
    'category': 'Customizations',
    'version': '16.0.1.5.0',
    'depends': ['account', 'base', 'contacts', 'point_of_sale', 'sale'],
    'data': [
        "views/PartnerView.xml",
        "views/domain_filters/SaleCustomerFilter.xml",
        "views/domain_filters/AccountCustomerFilter.xml",
        "views/domain_filters/SaleCustomerFilter.xml",
    ],
    'assets': {
        'point_of_sale.assets': [

            # css styling
            'pos_receipt_to_invoice/static/src/css/invoice-hide.css',
            'pos_receipt_to_invoice/static/src/css/receipt.css',

            # error logger
            'pos_receipt_to_invoice/static/src/js/logging/ErrorLogger.js',

            # service
            'pos_receipt_to_invoice/static/src/js/service/InvoiceService.js',

            #
            'pos_receipt_to_invoice/static/src/xml/receipt/reprint/ReprintReceiptScreenInherit.xml',

            # paymentscreen privat kunde 'add to creadit' disabled
            'pos_receipt_to_invoice/static/src/js/PrivatKundeKreditDeposit.js',

            # customer account payment method
            'pos_receipt_to_invoice/static/src/xml/receipt/PaymentScreenCustomerAccountConditionalButton.xml',
            'pos_receipt_to_invoice/static/src/xml/receipt/OrderReceiptElementLocation.xml',



            # 'Privat Kunde' related
            'pos_receipt_to_invoice/static/src/js/PrivatKundeProductScreen.js',
            'pos_receipt_to_invoice/static/src/js/PrivatKundePaymentScreen.js',
            'pos_receipt_to_invoice/static/src/js/PrivatKundePartnerListScreen.js',

            # paymentscreen invoice button
            'pos_receipt_to_invoice/static/src/xml/InvoiceBtnHiddenPaymentScreen.xml',

            # receipt
            'pos_receipt_to_invoice/static/src/xml/receipt/OrderLinesReceiptReplaced.xml',
            'pos_receipt_to_invoice/static/src/xml/receipt/InvoiceConvertedReceipt.xml',
            'pos_receipt_to_invoice/static/src/xml/receipt/EnglishOrderReceipt.xml',
            'pos_receipt_to_invoice/static/src/js/receipt/InvoiceConvertedReceipt.js',


            # reprint receipt
            'pos_receipt_to_invoice/static/src/js/receipt/InvoiceConvertedReprintReceiptScreen.js'

        ]
    },

    # hooks
    'post_init_hook': 'create_customer_hook',
    'uninstall_hook': 'archive_customer_hook',
    #
    'installable': True,
    'application': False,
    'license': 'LGPL-3'
}
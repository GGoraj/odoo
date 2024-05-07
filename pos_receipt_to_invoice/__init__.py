from . import models
from odoo import api
from odoo import SUPERUSER_ID
import logging
from . import controllers

_logger = logging.getLogger(__name__)
_inherit = 'res.partner'


# installation hook
def create_customer_hook(cr, registry):
    _logger.info('pos_receipt_to_invoice: create_customer_hook started')

    env = api.Environment(cr, SUPERUSER_ID, {})

    # check if privat kunde already exists
    client = None
    try:
        client = env['res.partner'].with_context(active_test=False).search([('name', '=', 'Privat Kunde')], limit=1)
    except Exception as e:
        _logger.error(e)

    # create client if he doesn't exist
    if not client:

        # Define the customer data
        customer_data = {
            'name': 'Privat Kunde',
            'customer_rank': 1,
            'is_company': False,
            'clearance': True
        }
        try:
            # Using context to bypass the restriction in the overridden create method
            env['res.partner'].with_context(allow_privat_kunde_creation=True).create(customer_data)
            # log success
            _logger.info('pos_receipt_to_invoice: create_customer_hook method: Privat Kunde created')
        except Exception as e:
            _logger.error('error creating Privat Kunde', e)

    else:
        # client exists: if it's not active (archived)  - activate him
        if not client.active:
            try:
                client.with_context(allow_privat_kunde_unarchive=True).write({'active': True, 'clearance': True})
                _logger.info('pos_receipt_to_invoice: create_customer_hook method: Privat Kunde activated')
            except Exception as e:
                _logger.error('pos_receipt_to_invoice: create_customer_hook method: Privat Kunde activation failed', e)

    # else if client is active - do nothing on install


# uninstallation hook
def archive_customer_hook(cr, registry):
    _logger.info('pos_receipt_to_invoice: archive_customer_hook triggered')
    env = api.Environment(cr, SUPERUSER_ID, {})

    # find the client
    client = None
    try:
        # check if privat kunde already exists
        client = env['res.partner'].with_context(active_test=False).search([('name', '=', 'Privat Kunde')], limit=1)
    except Exception as e:
        _logger.error('pos_receipt_to_invoice: archive_customer_hook: ', e)

    if client:
        # if client is active - deactivate (archive) him
        if client.active:
            try:
                client.with_context(allow_privat_kunde_archive=True).write({'active': False})
                _logger.info('pos_receipt_to_invoice: archive_customer_hook method: Privat Kunde deactivated')
            except Exception as e:
                _logger.error(e)

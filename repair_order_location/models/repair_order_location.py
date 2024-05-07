# -*- coding: utf-8 -*-
from odoo import models, fields, api
from odoo.exceptions import UserError
import logging


class RepairOrderLocation(models.Model):
    _inherit = 'repair.order'
    _logger = logging.getLogger(__name__)

    @api.model
    def _default_location(self):
	
	# returns id of stock_location
        stock_location = self.env['stock.location'].search(
            [('name', '=', 'Repair'), ('complete_name', '=', 'WH/Repair')])
        if not stock_location:
            self._logger.critical(
                "No warehouse location found with complete_name WH/Repair, name Repair (db: stock_location)")
            raise UserError(
                "No warehouse location found with complete_name WH/Repair, name Repair (db: stock_location)")
        else:
            stock_location_id = stock_location.id
            return stock_location_id

    # modify Location field displayed by default
    location_id = fields.Many2one(
        'stock.location',
        string='Location',
        default=_default_location,
        options="{'no_create': True}"
    )

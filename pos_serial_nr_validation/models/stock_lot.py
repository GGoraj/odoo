from odoo import models, api, exceptions
import re


# this class serves only validation purpose for adding a new serial number to products
class StockLot(models.Model):
    _inherit = "stock.lot"

    # validator raises exception when constrains don't match
    @api.constrains('name')
    # This decorator will trigger the method in the user
    # interface (UI) when the 'name' field is modified.
    # It allows real-time feedback in the form of warnings, setting other field values,
    # etc. based on the value of 'name'.
    @api.onchange('name')
    def _check_name_field(self):
        # Regex pattern to allow only numbers and capital letters
        pattern = re.compile('^[A-Z0-9]*$')

        # loop through existing records in 'stock.log'
        for record in self:
            # Check if the 'name' field is set and does not match the specified pattern
            if record.name and not pattern.match(record.name):
                # Raise a validation error if the 'name' field values contain characters other than alphanumeric
                raise exceptions.ValidationError('Only numbers and capital letters are allowed in the Lot/Serial Number.')

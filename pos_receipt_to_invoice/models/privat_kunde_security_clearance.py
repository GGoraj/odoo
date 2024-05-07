from odoo import fields, models


class ContactsSecurityClearance(models.Model):
    _inherit = 'res.partner'
    clearance = fields.Boolean(string='Clearance', default=False)

from odoo import fields, models


class StockInherit(models.Model):
    _inherit = "product.template"

    name = fields.Char(tracking=True)
    list_price = fields.Float(tracking=True)  # Sales Price
    standard_price = fields.Float(tracking=True)  # Cost
    default_code = fields.Char(tracking=True)  # Internal Reference
    barcode = fields.Char(tracking=True)  # Barcode

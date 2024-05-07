from odoo import api, models
from odoo.exceptions import ValidationError
from odoo.exceptions import UserError


# making sure that there can be only one 'Private Kunde' in the system
# in order to avoid duplicating the bank journals or errors
class SecureSinglePrivatKunde(models.Model):
    _inherit = 'res.partner'

    # override
    @api.model
    def create(self, vals):
        # define the name to block and the context to allow the installation hook defined in main __init__.py
        if (vals.get('name') == 'Privat Kunde' or vals.get('name') == 'Privatkunde' or vals.get(
                'name') == 'PrivatKunde' or vals.get(
                'name') == 'Privat kunde') and not self.env.context.get('allow_privat_kunde_creation'):
            raise ValidationError("Creation of a partner with this name is not allowed.")
        return super(SecureSinglePrivatKunde, self).create(vals)

    def write(self, vals):
        # Prevent update if the name is 'Privat Kunde'
        for record in self:
            if (record.name == 'Privat Kunde' and not (self.env.context.get('allow_privat_kunde_archive')
                                                       or self.env.context.get('allow_privat_kunde_unarchive'))):
                raise ValidationError("Modification of 'Privat Kunde' is not allowed.")
        return super(SecureSinglePrivatKunde, self).write(vals)

    def unlink(self):
        for item in self:
            if 'Privat Kunde' in item.display_name:
                raise UserError("Deletion of 'Privat Kunde' is not allowed.")

        return super(SecureSinglePrivatKunde, self).unlink()

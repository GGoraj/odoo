from odoo import models


class PosSession(models.Model):
    _inherit = "pos.session"

    # Overriding the method to include additional models into POS
    def _pos_ui_models_to_load(self):
        # Calling the super method to get default models
        result = super()._pos_ui_models_to_load()

        # Adding 'stock.lot' model to the result list
        result.append('stock.lot')

        # Returning the updated list
        return result

    # This method returns the search parameters for the stock.lot model
    def _loader_params_stock_lot(self):
        return {
            'search_params': {
                'domain': [],
                # name represents serial number
                'fields': ['name', 'product_id']

            }
        }

    # This method fetches the stock lot details based on the provided search parameters
    def _get_pos_ui_stock_lot(self, params):
        # Using search_read method of 'stock.lot' model to get the data
        # **params['search_params'] unpacks the dictionary to provide arguments to the method
        return self.env['stock.lot'].search_read(**params['search_params'])

from odoo import http
import logging
import json

_logger = logging.getLogger(__name__)


class ErrorLoggerController(http.Controller):

    @http.route('/error_logger', type='json', auth='user', methods=['POST'], csrf=True)
    def log_error(self, **kwargs):
        # Get request data
        error_info = json.loads(http.request.httprequest.data.decode('utf-8'))
        print('Error: ', error_info)
        _logger.error("Frontend Error: Message - %s , Stack - %s", error_info.get('message'), error_info.get('stack'))
        return {'message': 'Error Logged Successfully'}

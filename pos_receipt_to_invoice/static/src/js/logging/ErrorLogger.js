odoo.define('pos_receipt_to_invoice.error_logger', require => {
    "use strict";

    function log(message) {
        return $.ajax({
            url: "/error_logger",
            data: JSON.stringify({'message': message}),
            contentType: "application/json",
            type: "POST"
        });
    }

    return {
        log: log
    };
});
odoo.define('pos_stripe_no_card_refund.Exceptions', function (require) {
    "use strict";

    class RefundAmountError extends Error {
        constructor(message) {
            super(message);
            this.name = "RefundAmountError";
        }

    }

    class StripeReferenceMissingError extends Error {
        constructor(message) {
            super(message);
            this.name = "StripeReferenceMissingError";
        }

    }

    class InvalidStripeReferenceFormat extends Error {
        constructor(message) {
            super(message);
            this.name = "InvalidStripeReferenceFormat";
        }

    }

    class StripeRefundFailure extends Error {
        constructor(message) {
            super(message);
            this.name = "StripeRefundFailure";
        }

    }

    class NotANumberException extends Error {
        constructor(message) {
            super(message);
            this.name = "NotANumberException";
        }

    }

    return {
        RefundAmountError,
        StripeReferenceMissingError,
        InvalidStripeReferenceFormat,
        StripeRefundFailure,
        NotANumberException
    };
});
/** @odoo-module **/

export class InputValidationHelper {

    /**
     * Checks if the given serial string contains any special characters.
     *
     * @param {string} serial - The serial string to be checked.
     * @returns {boolean} - Returns true if the string contains special characters, otherwise false.
     */
    static hasSpecialCharacters(serial) {
        const pattern = /^[a-zA-Z0-9]+$/;  // Regular expression pattern for alphanumeric characters.
        return pattern.test(serial) === false;  // Returns true if the string doesn't match the alphanumeric pattern.
    }

    /**
     * Validates if a given serial number is not assigned to the selected product ID.
     *
     * @param {string} serial - The serial number to be validated.
     * @param {number} selected_id - The ID of the selected product.
     * @param {Map} serialToIds - A map containing serials as keys and their associated product IDs as values.
     * @returns {boolean} - Returns true if the serial number is not assigned to the selected product ID, otherwise false.
     */
    static isSerialUnassignedToProduct(serial, selected_id, serialToIds) {
        // Check if the serial is not in the map.
        if (!serialToIds.has(serial)) {
            return true; // Serial is not assigned and is not in the database.
        } else {
            const dbId = serialToIds.get(serial);  // Get the product ID associated with the serial.
            if (dbId !== selected_id) {
                return true;  // Serial doesn't belong to the selected product ID.
            }
        }
        return false;  // Serial belongs to the selected product ID.
    }
}

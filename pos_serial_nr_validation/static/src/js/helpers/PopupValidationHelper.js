/** @odoo-module **/

export class PopupValidationHelper {

    // Check if no serials are entered
    static isFirstLineEmpty(enteredSerials){
        return enteredSerials.length === 0;
    }

    // Check for special characters in serials. Valid serials are alphanumeric.
    static hasSpecialCharacters(enteredSerials) {
        const pattern = /^[a-zA-Z0-9]+$/;
        for (let serial of enteredSerials) {
            if (!pattern.test(serial)) return true;  // Found an invalid character
        }
        return false;
    }

    // Check if serial is unassigned or belongs to another product
    static isSerialUnassignedToProduct(enteredSerials, selected_id, serialToIds) {

        console.warn('is serial unassigned (popup) entered serials: ', enteredSerials)
        console.warn('product_id: ', selected_id)
        console.warn('serial to ids: ', serialToIds)


        for(const serial of enteredSerials){
            if(!serialToIds.has(serial)) return true;  // Serial not in database
            const dbId = serialToIds.get(serial);
            if(dbId !== selected_id) return true;  // Serial belongs to another product
        }
        return false;
    }

    // Check if the latest entered serial is a duplicate
    static isProductBeingSoldTwice(enteredSerials) {
        let currentSerial = enteredSerials[enteredSerials.length - 1];
        return enteredSerials.slice(0, -1).includes(currentSerial);  // Exclude last serial and check for its presence
    }
}

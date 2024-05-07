/** @odoo-module **/
import EditListPopup from "point_of_sale.EditListPopup";
import Registries from 'point_of_sale.Registries';
import {PopupValidationHelper} from "./helpers/PopupValidationHelper";


const ExtendedEditListPopup = (EditListPopup) =>
    class ExtendedEditListPopup extends EditListPopup {

        setup(...args) {
            super.setup(args)
            this.state.lastLineFaulty = []; // for the child
        }

        // button Ok
        confirm() {
            const validated = this.validatePopupEntries() // execute validation
            console.warn(this)
            if (validated === false) super.confirm(); // if there were no errors

        }

        validatePopupEntries() {

            // array of items, item: {_id: 0, id: 'c3', text: '0000016DDDD333'}
            const arrayOfInputs = this.state.array
            const enteredSerials = arrayOfInputs.filter(item => item.text !== '').map(item => item.text);

            // get stock_lot info loaded with model in order to compare db existing serial numbers with provided
            const stock_lot = this.env.pos.stock_lot
            const serialsToIds = this.getSerialsToIds(stock_lot) // necessary to check link btw id of product's serial nr and product_id
            const selectedProductId = this.props.product_id // loaded on ProductItem click

            // use the validator to set the error indicators
            const errSerialNotAssignedToSelectedProduct = PopupValidationHelper.isSerialUnassignedToProduct(enteredSerials, selectedProductId, serialsToIds)
            const errSpecialCharacters = PopupValidationHelper.hasSpecialCharacters(enteredSerials);
            const errProductAlreadyOnTheList = PopupValidationHelper.isProductBeingSoldTwice(enteredSerials);
            const errFirstLineEmpty = PopupValidationHelper.isFirstLineEmpty(enteredSerials);

            // gather the errors in map { name: value }
            let errors = this.createMapOfErrors(errSerialNotAssignedToSelectedProduct,
                errSpecialCharacters,
                errProductAlreadyOnTheList,
                errFirstLineEmpty);

            // for child evaluation:
            // set errors to the component's state
            this.setErrorsForProps(errors)

            // add the last line check to the state (because enter was not pressed - this use case assumes covers the situation
            // in which button will be pressed instead of enter in order to finish editing orders in the popup.
            /*** this.isLastLineFaulty() ***/


            // parent validation on button click
            this.setErrorsToState(errors)


            // render again if error occurred - to trigger the error span's conditions
            if (errSerialNotAssignedToSelectedProduct || errProductAlreadyOnTheList || errSpecialCharacters || errFirstLineEmpty) {
                //console.warn(errSerialNotAssignedToSelectedProduct,errProductAlreadyOnTheList,errSpecialCharacters,errFirstLineEmpty)
                this.render()
                return true;
            } else {
                return false;
            }
        }

        // check if the last input line contains an error
        // if any error occurred inform the child (EditListInput) which edit line's _id contains an error
        isLastLineFaulty() {
            const inputs = this.state.array;
            const selectedProductId = this.props.product_id;
            const serialsToIds = this.getSerialsToIds(this.env.pos.stock_lot)
            const lastItem = inputs[inputs.length - 1];
            const serial = lastItem.text;

            const notAssigned = PopupValidationHelper.isSerialUnassignedToProduct([serial], selectedProductId, serialsToIds)
            const specialChar = PopupValidationHelper.hasSpecialCharacters([serial])
            this.state.lastLineFaulty[0] = notAssigned === true || specialChar === true;
            this.state.lastLineFaulty[1] = lastItem._id;
        }


        createMapOfErrors(errSerialNotAssignedToSelectedProduct, errSpecialCharacters, errProductAlreadyOnTheList, errFirstLineEmpty) {
            // create map of errors
            let errors = new Map()
            errors.set("errSerialNotAssignedToSelectedProduct", errSerialNotAssignedToSelectedProduct);
            errors.set("errSpecialCharacters", errSpecialCharacters);
            errors.set("errProductAlreadyOnTheList", errProductAlreadyOnTheList);
            errors.set("errFirstLineEmpty", errFirstLineEmpty);
            return errors;
        }

        //
        clearPopupErrors = (ev) => {
            this.validatePopupEntries()
            this.render();
        }

        // passing errors for EditInputValidation
        setErrorsForProps(errors) {
            this.state.errors = errors;
        }

        // automatically adds { 'error name' : 'value' } to the state
        setErrorsToState(errors) {
            for (const [err, name] of errors) {
                this.state = {...this.state, [err]: name};
            }
        }

        // Convert the stock_lot array into a map of serial numbers to product IDs
        getSerialsToIds(stock_lot) {
            let serialIdsMap = new Map()
            stock_lot.map((item) => {
                serialIdsMap.set(item.name, item.product_id[0])
            })
            return serialIdsMap
        }
    }

Registries.Component.extend(EditListPopup, ExtendedEditListPopup)
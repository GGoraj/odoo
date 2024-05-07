/** @odoo-module **/
import EditListInput from "point_of_sale.EditListInput";
import Registries from 'point_of_sale.Registries';
import {InputValidationHelper} from "./helpers/InputValidationHelper";

const {useState} = owl;

const EditListInputInherit = (EditListInput) => class EditListInputInherit extends EditListInput {

    setup(...args) {
        super.setup(args)
        if (!this.state) {
            this.state = useState({errors: {}, anyError : false});
        }
    }

    // override
    onKeyup(event) {
        this.props.item.text = this.props.item.text.toUpperCase()
        if (event.key === "Enter" && event.target.value.trim() !== '') {
            this.validateEnterPressed() // for parent
            this.localValidation(this.props.item) // for child
            this.state.anyError = Object.values(this.state.errors[this.props.item._id] || {}).some(Boolean);
            this.trigger('create-new-item');
        }
    }

    localValidation(item) {

        const stock_lot = this.env.pos.stock_lot
        const serialToIds = this.getSerialToIds(stock_lot)
        const selectedProductId = this.props.product_id

        const special = InputValidationHelper.hasSpecialCharacters(item.text);
        const notAssigned = InputValidationHelper.isSerialUnassignedToProduct(item.text, selectedProductId, serialToIds)


        // error occurred
        this.addError(item._id, special, notAssigned, false);
    }

     // Method to record errors in the component state.
    addError(id, special, notAssigned, repeated) {
        if (!this.state.errors) {
            this.state = {...this.state, errors: {}}
        }
        this.state.errors = {
            ...this.state.errors,
            [id]: {
                'special': special,
                'notAssigned': notAssigned,
                'repeated': repeated
            }
        };
    }

    // Each value of the array will be passed to the Boolean function
    // if any of those values is truthy, .some(Boolean) will return true.
    errorOccurred() {
        if (this.props.item)
            return Object.values(this.state.errors[this.props.item._id] || {}).some(Boolean);
    }

    // used locally
    getSerialToIds(stock_lot) {
        let serialIdsMap = new Map()
        stock_lot.map((item) => {
            serialIdsMap.set(item.name, item.product_id[0])
        })
        return serialIdsMap
    }

    // fires up parent's validation
    validateEnterPressed() {
        if (this.props.item.text === '') return
        this.trigger('validate-single-line', {input_text: this.props.item.text, input_id: this.props.item._id})
    }


    // triggers clearPopupErrors in the parent (EditListPopup)
    // used in 't-on-click' within trash icon functionality
    clearErrors = () => {
        this.trigger('clear-errors', {input_id: this.props.item._id, text: this.props.item.text});
    }
}
Registries.Component.extend(EditListInput, EditListInputInherit)
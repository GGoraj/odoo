/** @odoo-module **/
import {PosGlobalState} from 'point_of_sale.models'
import Registries from 'point_of_sale.Registries'

const StockLotGlobalState = (PosGlobalState) => class NewPosGlobalState extends PosGlobalState {
    async _processData(loadedData) {
        await super._processData(...arguments);
        this.stock_lot = loadedData['stock.lot'];
    }
}
Registries.Model.extend(PosGlobalState, StockLotGlobalState);
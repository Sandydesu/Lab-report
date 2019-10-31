import { ADDING_NEW_ITEM, DISPLAY_LIST, ADDED_NEW_ITEM, EDIT_ITEM } from '../constants';
function List(state = { itemList: [], isNewRecord: false }, action) {
    switch (action.type) {
        case ADDING_NEW_ITEM:
            return Object.assign({}, state, { isNewRecord: false });
        case ADDED_NEW_ITEM:
            const list = state.itemList;
            list.push(action.payload);
            return Object.assign({}, state, { itemList: list, count: list.length, isNewRecord: true });
        case DISPLAY_LIST:
            return Object.assign({}, state, { itemList: action.payload, count: action.payload.length, isNewRecord: false });
        case EDIT_ITEM:
            const updatelist = state.itemList;
            const index = updatelist.findIndex((value) => value.itemId === action.payload.itemId);
            updatelist[index] = action.payload;
            return Object.assign({}, state, { itemList: updatelist, count: updatelist.length });
        default:
            return state;
    }
}

export default List;
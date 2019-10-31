import Database from '../../../database';
import { DISPLAY_LIST, ADDED_NEW_ITEM, EDIT_ITEM } from '../constants';
const db = new Database();

function addNewItemToStore(items) {
    return {
        type: ADDED_NEW_ITEM,
        payload: items
    }
}

function storeAllItems(items) {
    return {
        type: DISPLAY_LIST,
        payload: items
    }
}

function updateItemToStore(item) {
    return {
        type: EDIT_ITEM,
        payload: item
    }
}

export const getList = () => {
    return function (dispatch) {
        db.createItemsTable().then(() => {
            db.listItems().then((data) => {
                dispatch(storeAllItems(data));
            }).catch((err) => {
                dispatch(storeAllItems([]));
            })
        }).catch(() => {
            dispatch(storeAllItems([]));
        });
    }
}


export const addNewItem = (data) => {
    return function (dispatch) {
        db.addItem(data).then((res) => {
            dispatch(addNewItemToStore(data));
        }).catch((err) => {
            console.log(err);
        })
    }
}


export const updateItem = (data) => {
    return function (dispatch) {
        db.updateItem(data).then((res) => {
            dispatch(updateItemToStore(data));
        }).catch((err) => {
            console.log(err);
        })
    }
}



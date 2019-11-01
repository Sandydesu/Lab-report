import { DISPLAY_LIST, GET_REPORTS } from '../constants';
import Database from '../../../database';
const db = new Database();

export const createItemsReportTable = () => {
    return function (dispatch) {
        db.createItemsTable().then(() => {
            dispatch({
                type: DISPLAY_LIST,
                payload: []
            });
            db.createReportsTable().then(() => {
                dispatch({
                    type: GET_REPORTS,
                    payload: []
                });
            }).catch(() => {
            });
        }).catch(() => {
        });
    }
};
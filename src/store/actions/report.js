import { CREATE_NEW_REPORT, GET_REPORTS, EDIT_REPORT, REMOVE_EDIT_FLAG_FOR_REPORT, UPDATE_REPORTS } from '../constants';
import Database from '../../../database';
const db = new Database();

function createNewReport(value) {
    return {
        type: CREATE_NEW_REPORT,
        payload: value
    }
}

function storeAllReports(items) {
    return {
        type: GET_REPORTS,
        payload: items
    }
}


function updateOldReport(items) {
    return {
        type: UPDATE_REPORTS,
        payload: items
    }
}

export const selectedReportEdit = (item) => {
    return {
        type: EDIT_REPORT,
        payload: item
    }
}

export const removeEditFlag = () => {
    return {
        type: REMOVE_EDIT_FLAG_FOR_REPORT
    }
}



export const getReports = () => {
    return function (dispatch) {
        db.listReports().then((data) => {
            dispatch(storeAllReports(data));
        }).catch((err) => {
            dispatch(storeAllReports([]));
        });
    }
}


export const addNewReport = (data) => {
    return function (dispatch) {
        db.addReport(data).then((res) => {
            dispatch(createNewReport(data));
        }).catch((err) => {
            console.log(err);
        })
    }
}

export const updateReport = (data) => {
    return function (dispatch) {
        dispatch(removeEditFlag());
        db.updateReport(data).then((res) => {
            dispatch(updateOldReport(data));
        }).catch((err) => {
            console.log(err);
        })
    }
}

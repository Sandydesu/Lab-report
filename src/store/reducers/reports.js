import { CREATE_NEW_REPORT, GET_REPORTS, EDIT_REPORT, REMOVE_EDIT_FLAG_FOR_REPORT, UPDATE_REPORTS } from '../constants';
function Report(state = { reportsList: [], count: 0, selectedItem: null, actionType: null }, action) {
    switch (action.type) {
        case CREATE_NEW_REPORT:
            const list = state.reportsList;
            list.push(action.payload);
            return Object.assign({}, state, { reportsList: list, count: list.length, actionType: null });
        case GET_REPORTS:
            return Object.assign({}, state, { reportsList: action.payload, count: action.payload.length, actionType: null });
        case EDIT_REPORT:
            return Object.assign({}, state, { selectedItem: action.payload, actionType: "edit" });
        case REMOVE_EDIT_FLAG_FOR_REPORT:
            return Object.assign({}, state, { actionType: null, selectedItem: null });
        case UPDATE_REPORTS:
            const listReports = state.reportsList;
            const index = listReports.findIndex((value) => value.reportId === action.payload.reportId);
            listReports[index] = action.payload;
            return Object.assign({}, state, { reportsList: listReports, count: listReports.length, actionType: null });
        default:
            return state;
    }
}

export default Report;
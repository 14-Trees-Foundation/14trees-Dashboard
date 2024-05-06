import { UnknownAction } from "redux";
import { fetchDataFromLocal } from "../../api/apiClient/apiClient";
import onsiteStaffActionTypes from "../actionTypes/onSiteStaffActionTypes";
import { OnsiteStaff, OnsiteStaffDataState } from "../../types/onSiteStaff";

export const onsiteStaffsDataReducer = (state = fetchDataFromLocal("onsiteStaffDataState"), action: UnknownAction ): OnsiteStaffDataState => {
    switch (action.type) {
        case onsiteStaffActionTypes.GET_ONSITE_STAFFS_SUCCEEDED:
            if (action.payload) {
                let onsiteStaffDataState: OnsiteStaffDataState = {}
                let payload = action.payload as [OnsiteStaff]
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i]?._id) {
                        payload[i].key = payload[i]._id
                        onsiteStaffDataState[payload[i]._id] = payload[i]
                    }
                }
                const nextState: OnsiteStaffDataState = onsiteStaffDataState;
                return nextState;
            }
            return state;
        case onsiteStaffActionTypes.CREATE_ONSITE_STAFF_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as OnsiteStaffDataState;
                let payload = action.payload as OnsiteStaff
                payload.key = payload._id
                nextState[payload._id] = payload;
                return nextState;
            }
            return state;
        case onsiteStaffActionTypes.UPDATE_ONSITE_STAFF_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as OnsiteStaffDataState;
                let payload = action.payload as OnsiteStaff
                payload.key = payload._id
                nextState[payload._id] = payload;
                return nextState;
            }
            return state;
        case onsiteStaffActionTypes.DELETE_ONSITE_STAFF_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as OnsiteStaffDataState;
                Reflect.deleteProperty(nextState, action.payload as string)
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};
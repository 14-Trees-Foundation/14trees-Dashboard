import { UnknownAction } from "redux";
import { Organization, OrganizationsDataState } from "../../types/organization";
import organizationActionTypes from "../actionTypes/organizationActionTypes";
import { fetchDataFromLocal } from "../../api/apiClient/apiClient";

export const organizationsDataReducer = (state = fetchDataFromLocal("organizationsDataState"), action: UnknownAction ): OrganizationsDataState => {
    switch (action.type) {
        case organizationActionTypes.GET_ORGANIZATIONS_SUCCEEDED:
            if (action.payload) {
                let organizationsDataState: OrganizationsDataState = {}
                let payload = action.payload as [Organization]
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i]?._id) {
                        payload[i].key = payload[i]._id
                        organizationsDataState[payload[i]._id] = payload[i]
                    }
                }
                const nextState: OrganizationsDataState = organizationsDataState;
                return nextState;
            }
            return state;
        case organizationActionTypes.CREATE_ORGANIZATION_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as OrganizationsDataState;
                let payload = action.payload as Organization
                payload.key = payload._id
                nextState[payload._id] = payload;
                return nextState;
            }
            return state;
        case organizationActionTypes.UPDATE_ORGANIZATION_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as OrganizationsDataState;
                let payload = action.payload as Organization
                payload.key = payload._id
                nextState[payload._id] = payload;
                return nextState;
            }
            return state;
        case organizationActionTypes.DELETE_ORGANIZATION_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as OrganizationsDataState;
                Reflect.deleteProperty(nextState, action.payload as string)
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};
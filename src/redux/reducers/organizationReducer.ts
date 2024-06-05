import { UnknownAction } from "redux";
import { Organization, OrganizationPaginationResponse, OrganizationsDataState } from "../../types/organization";
import organizationActionTypes from "../actionTypes/organizationActionTypes";

export const organizationsDataReducer = (state = { totalOrganizations:0, organizations: {} }, action: UnknownAction ): OrganizationsDataState => {
    switch (action.type) {
        case organizationActionTypes.GET_ORGANIZATIONS_SUCCEEDED:
            if (action.payload) {
                let organizationsDataState: OrganizationsDataState = { totalOrganizations: state.totalOrganizations, organizations: { ...state.organizations }}
                let payload = action.payload as OrganizationPaginationResponse
                organizationsDataState.totalOrganizations = payload.total
                let organizations = payload.result
                for (let i = 0; i < organizations.length; i++) {
                    if (organizations[i]?._id) {
                        organizations[i].key = organizations[i]._id
                        organizationsDataState.organizations[organizations[i]._id] = organizations[i]
                    }
                }
                const nextState: OrganizationsDataState = organizationsDataState;
                return nextState;
            }
            return state;
        case organizationActionTypes.CREATE_ORGANIZATION_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalOrganizations: state.totalOrganizations, organizations: { ...state.organizations } } as OrganizationsDataState;
                let payload = action.payload as Organization
                payload.key = payload._id
                nextState.organizations[payload._id] = payload;
                nextState.totalOrganizations += 1;
                return nextState;
            }
            return state;
        case organizationActionTypes.UPDATE_ORGANIZATION_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalOrganizations: state.totalOrganizations, organizations: { ...state.organizations } } as OrganizationsDataState;
                let payload = action.payload as Organization
                payload.key = payload._id
                nextState.organizations[payload._id] = payload;
                return nextState;
            }
            return state;
        case organizationActionTypes.DELETE_ORGANIZATION_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalOrganizations: state.totalOrganizations, organizations: { ...state.organizations } } as OrganizationsDataState;
                Reflect.deleteProperty(nextState.organizations, action.payload as string)
                nextState.totalOrganizations -= 1;
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};

export const searchOrganizationsDataReducer = (state = { totalOrganizations:0, organizations: {} }, action: UnknownAction ): OrganizationsDataState => {
    switch(action.type) {
        case organizationActionTypes.SEARCH_ORGANIZATIONS_SUCCEEDED:
            if (action.payload) {
                let organizationsDataState: OrganizationsDataState = { totalOrganizations: state.totalOrganizations, organizations: { ...state.organizations }}
                let payload = action.payload as [Organization]
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i]?._id) {
                        payload[i].key = payload[i]._id
                        organizationsDataState.organizations[payload[i]._id] = payload[i]
                    }
                }
                const nextState: OrganizationsDataState = organizationsDataState;
                return nextState;
            }
            return state;
        default:
            return state;
    }
}
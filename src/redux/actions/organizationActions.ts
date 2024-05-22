import ApiClient from "../../api/apiClient/apiClient";
import organizationActionTypes from "../actionTypes/organizationActionTypes";
import { Organization, OrganizationPaginationResponse } from "../../types/organization";

export const getOrganizations = (offset: number, limit: number) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: organizationActionTypes.GET_ORGANIZATIONS_REQUESTED,
        });
        apiClient.getOrganizations(offset, limit).then(
            (value: OrganizationPaginationResponse) => {
                for (let i = 0; i < value.result.length; i++) {
                    if (value.result[i]?._id) {
                        value.result[i].key = value.result[i]._id
                    }
                }
                dispatch({
                    type: organizationActionTypes.GET_ORGANIZATIONS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: organizationActionTypes.GET_ORGANIZATIONS_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const searchOrganizations = (searchStr: string) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: organizationActionTypes.SEARCH_ORGANIZATIONS_REQUESTED,
        });
        apiClient.searchOrganizations(searchStr).then(
            (value: Organization[]) => {
                for (let i = 0; i < value.length; i++) {
                    if (value[i]?._id) {
                        value[i].key = value[i]._id
                    }
                }
                dispatch({
                    type: organizationActionTypes.SEARCH_ORGANIZATIONS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: organizationActionTypes.SEARCH_ORGANIZATIONS_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const createOrganization = (record: Organization) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: organizationActionTypes.CREATE_ORGANIZATION_REQUESTED,
        });
        apiClient.createOrganization(record).then(
            (value: Organization) => {
                dispatch({
                    type: organizationActionTypes.CREATE_ORGANIZATION_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: organizationActionTypes.CREATE_ORGANIZATION_FAILED,
                });
            }
        )
    };
};

export const updateOrganization = (record: Organization) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: organizationActionTypes.UPDATE_ORGANIZATION_REQUESTED,
        });
        apiClient.updateOrganization(record).then(
            (value: Organization) => {
                dispatch({
                    type: organizationActionTypes.UPDATE_ORGANIZATION_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: organizationActionTypes.UPDATE_ORGANIZATION_FAILED,
                });
            }
        )
    };
};


export const deleteOrganization = (record: Organization) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: organizationActionTypes.DELETE_ORGANIZATION_FAILED,
        });
        apiClient.deleteOrganization(record).then(
            (id: string) => {
                dispatch({
                    type: organizationActionTypes.DELETE_ORGANIZATION_SUCCEEDED,
                    payload: id,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: organizationActionTypes.DELETE_ORGANIZATION_FAILED,
                });
            }
        )
    };
};
import ApiClient from "../../api/apiClient/apiClient";
import onsiteStaffActionTypes from "../actionTypes/onSiteStaffActionTypes";
import { OnsiteStaff } from "../../types/onSiteStaff";

export const getOnsiteStaffs = () => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: onsiteStaffActionTypes.GET_ONSITE_STAFFS_REQUESTED,
        });
        apiClient.getOnsiteStaffs().then(
            (value: OnsiteStaff[]) => {
                for (let i = 0; i < value.length; i++) {
                    if (value[i]?._id) {
                        value[i].key = value[i]._id
                    }
                }
                dispatch({
                    type: onsiteStaffActionTypes.GET_ONSITE_STAFFS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: onsiteStaffActionTypes.GET_ONSITE_STAFFS_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const createOnsiteStaff = (record: OnsiteStaff) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: onsiteStaffActionTypes.CREATE_ONSITE_STAFF_REQUESTED,
        });
        apiClient.createOnsiteStaff(record).then(
            (value: OnsiteStaff) => {
                dispatch({
                    type: onsiteStaffActionTypes.CREATE_ONSITE_STAFF_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: onsiteStaffActionTypes.CREATE_ONSITE_STAFF_FAILED,
                });
            }
        )
    };
};

export const updateOnsiteStaff = (record: OnsiteStaff) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: onsiteStaffActionTypes.UPDATE_ONSITE_STAFF_REQUESTED,
        });
        apiClient.updateOnsiteStaff(record).then(
            (value: OnsiteStaff) => {
                dispatch({
                    type: onsiteStaffActionTypes.UPDATE_ONSITE_STAFF_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: onsiteStaffActionTypes.UPDATE_ONSITE_STAFF_FAILED,
                });
            }
        )
    };
};


export const deleteTreeTypes = (record: OnsiteStaff) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: onsiteStaffActionTypes.DELETE_ONSITE_STAFF_REQUESTED,
        });
        apiClient.deleteOnsiteStaff(record).then(
            (id: string) => {
                dispatch({
                    type: onsiteStaffActionTypes.DELETE_ONSITE_STAFF_SUCCEEDED,
                    payload: id,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: onsiteStaffActionTypes.DELETE_ONSITE_STAFF_FAILED,
                });
            }
        )
    };
};
import ApiClient from "../../api/apiClient/apiClient";
import siteActionTypes from "../actionTypes/siteActionTypes";
import { Site } from "../../types/site";
import { PaginatedResponse } from "../../types/pagination";
import { toast } from 'react-toastify';

export const getSites = (offset: number, limit: number, filters?: any[]) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: siteActionTypes.GET_SITES_REQUESTED,
        });
        apiClient.getSites(offset, limit, filters).then(
            (value: PaginatedResponse<Site>) => {
                for (let i = 0; i < value.results.length; i++) {
                    if (value.results[i]?.id) {
                        value.results[i].key = value.results[i].id
                    }
                }
                dispatch({
                    type: siteActionTypes.GET_SITES_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: siteActionTypes.GET_SITES_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const createSite = (record: Site) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: siteActionTypes.CREATE_SITE_REQUESTED,
        });
        apiClient.createSite(record).then(
            (value: Site) => {
                toast.success('New Site Added successfully')
                dispatch({
                    type: siteActionTypes.CREATE_SITE_SUCCEEDED,
                    payload: value,
                   
                });
                console.log("Added new Site : ",value)
                return(value)
            },
            (error: any) => {
                console.error(error);
                toast.error('Failed to add new Site')
                dispatch({
                    type: siteActionTypes.CREATE_SITE_FAILED,
                });
                return(error)
            }
        )
    };
};

export const updateSite = (record: Site , files?: Blob[]) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {

        dispatch({
            type: siteActionTypes.UPDATE_SITE_REQUESTED,
        });
         apiClient.updateSite(record , files?files:[]).then(
            (value: Site) => {
                toast.success('Site data Edited successfully')
                dispatch({
                    type: siteActionTypes.UPDATE_SITE_SUCCEEDED,
                    payload: value,
                   
                });
                
            },
            (error: any) => {
                toast.error('Failed to edit site data')
                dispatch({
                    type: siteActionTypes.UPDATE_SITE_FAILED,
                    payload: error
                });
                
            }
        )
    };
};


export const deleteSite = (record: Site) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        
        dispatch({
            type: siteActionTypes.DELETE_SITE_REQUESTED,
        });
        apiClient.deleteSite(record).then(
            (id: number) => {
                toast.success('Site deleted successfully')
                dispatch({
                    type: siteActionTypes.DELETE_SITE_SUCCEEDED,
                    payload: id,
                });
            },
            (error: any) => {
                console.error(error);
                toast.error('Failed to delete Site')
                dispatch({
                    type: siteActionTypes.DELETE_SITE_FAILED,
                });
            }
        )
    };
};
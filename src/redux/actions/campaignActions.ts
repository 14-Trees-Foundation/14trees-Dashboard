import ApiClient from "../../api/apiClient/apiClient";
import campaignActionTypes from "../actionTypes/campaignActionTypes";
import { Campaign } from "../../types/campaign";
import { PaginatedResponse } from "../../types/pagination";
import { toast } from "react-toastify";
import { SortOrder } from "antd/es/table/interface";
import { GridFilterItem } from "@mui/x-data-grid";


export const getCampaigns = (
    offset: number,
    limit: number,
    filters?: GridFilterItem[],
    order_by?: SortOrder[]
) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: campaignActionTypes.GET_CAMPAIGNS_REQUESTED,
        });
        apiClient.getCampaigns(offset, limit, filters, order_by).then(
            (value: PaginatedResponse<Campaign>) => {
                const campaignsWithKey = value.results.map(campaign => ({
                    ...campaign,
                    key: campaign.id
                }));

                dispatch({
                    type: campaignActionTypes.GET_CAMPAIGNS_SUCCEEDED,
                    payload: {
                        ...value,
                        results: campaignsWithKey
                    },
                });
            },
            (error: any) => {
                toast.error(error.message);
                dispatch({
                    type: campaignActionTypes.GET_CAMPAIGNS_FAILED,
                    payload: error
                });
            }
        );
    };
};

export const createCampaign = (name: string, c_key: string, description?: string) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: campaignActionTypes.CREATE_CAMPAIGN_REQUESTED,
        });
        apiClient.createCampaign(name, c_key, description).then(
            (value: Campaign) => {
                toast.success('Campaign created successfully');
                dispatch({
                    type: campaignActionTypes.CREATE_CAMPAIGN_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                toast.error(error.message);
                dispatch({
                    type: campaignActionTypes.CREATE_CAMPAIGN_FAILED,
                });
            }
        );
    };
};

export const updateCampaign = (
    campaignId: number,
    updateFields: string[],
    updateData: Partial<Campaign>
) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: campaignActionTypes.UPDATE_CAMPAIGN_REQUESTED,
        });

        apiClient.updateCampaign(campaignId, updateFields, updateData)
            .then((value: Campaign) => {
                toast.success('Campaign updated successfully');
                dispatch({
                    type: campaignActionTypes.UPDATE_CAMPAIGN_SUCCEEDED,
                    payload: value,
                });
            })
            .catch((error: any) => {
                let errorMessage = 'Failed to update campaign';
                if (error.message) {
                    errorMessage = error.message;
                }
                toast.error(errorMessage);
                dispatch({
                    type: campaignActionTypes.UPDATE_CAMPAIGN_FAILED,
                });
            });
    };
};

/*export const deleteCampaign = (campaignId: number) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: campaignActionTypes.DELETE_CAMPAIGN_REQUESTED,
        });
        apiClient.deleteCampaign(campaignId).then(
            (id: number) => {
                toast.success('Campaign deleted successfully');
                dispatch({
                    type: campaignActionTypes.DELETE_CAMPAIGN_SUCCEEDED,
                    payload: id,
                });
            },
            (error: any) => {
                toast.error(error.message);
                dispatch({
                    type: campaignActionTypes.DELETE_CAMPAIGN_FAILED,
                });
            }
        );
    };
};*/


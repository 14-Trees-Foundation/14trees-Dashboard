import ApiClient from "../../api/apiClient/apiClient";
import donationActionTypes from "../actionTypes/donationActionTypes";
import { Donation } from "../../types/donation";
import { PaginatedResponse } from "../../types/pagination";
import { toast } from "react-toastify";
import { Order } from "../../types/common";

export const getDonations = (offset: number, limit: number, filters?: any[], order_by?: Order[]) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: donationActionTypes.GET_DONATIONS_REQUESTED,
        });
        apiClient.getDonations(offset, limit, filters, order_by).then(
            (value: PaginatedResponse<Donation>) => {
                // Map the results to include key property for antd Table
                const donationsWithKey = value.results.map(donation => ({
                    ...donation,
                    key: donation.id // Add key property required by antd Table
                }));

                dispatch({
                    type: donationActionTypes.GET_DONATIONS_SUCCEEDED,
                    payload: {
                        ...value,
                        results: donationsWithKey
                    },
                });
            },
            (error: any) => {
                toast.error(error.message);
                dispatch({
                    type: donationActionTypes.GET_DONATIONS_FAILED,
                    payload: error
                });
            }
        )
    }
};


export const createDonation = (requestId: string, createdBy: number, userId: number, pledged: number | null, pledgedArea: number | null, category: string, grove: string | null, preference: string, eventName: string, alternateEmail: string, users: any[], paymentId?: number, groupId?: number, logo?: string | null) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: donationActionTypes.CREATE_DONATION_REQUESTED,
        });
        apiClient.createDonation(requestId, createdBy, userId, pledged, pledgedArea, category, grove, preference, eventName, alternateEmail, users, paymentId, groupId, logo).then(
            (value: Donation) => {
                toast.success('New Donation Added')
                dispatch({
                    type: donationActionTypes.CREATE_DONATION_SUCCEEDED,
                    payload: value,

                });
            },
            (error: any) => {
                toast.error(error.message);
                dispatch({
                    type: donationActionTypes.CREATE_DONATION_FAILED,
                });
            }
        )
    };
};

export const updateDonation = (record: Donation, users: any[]) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: donationActionTypes.UPDATE_DONATION_REQUESTED,
        });
        
        // Log the record being updated for debugging
        console.log("Updating donation record:", record);
        
        apiClient.updateDonation(record, users)
            .then((value: Donation) => {
                console.log("Donation update success:", value);
                toast.success('Donation data updated successfully');
                dispatch({
                    type: donationActionTypes.UPDATE_DONATION_SUCCEEDED,
                    payload: value,
                });
            })
            .catch((error: any) => {
                console.error("Donation update error:", error);
                let errorMessage = 'Failed to update donation';
                
                if (error.message) {
                    errorMessage = error.message;
                }
                
                toast.error(errorMessage);
                dispatch({
                    type: donationActionTypes.UPDATE_DONATION_FAILED,
                });
            });
    };
};


export const deleteDonation = (record: Donation) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: donationActionTypes.DELETE_DONATION_REQUESTED,
        });
        apiClient.deleteDonation(record).then(
            (id: number) => {
                dispatch({
                    type: donationActionTypes.DELETE_DONATION_SUCCEEDED,
                    payload: id,
                });
            },
            (error: any) => {
                toast.error(error.message);
                dispatch({
                    type: donationActionTypes.DELETE_DONATION_FAILED,
                });
            }
        )
    };
};

export const assignTreesToDonationUsers = (donationId: number) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: donationActionTypes.ASSIGN_USER_TREES_REQUESTED,
        });
        apiClient.assignTreesToDonation(donationId).then(
            (value: boolean) => {
                dispatch({
                    type: donationActionTypes.ASSIGN_USER_TREES_SUCCEEDED,
                    payload: value,
                });
                toast.success('Trees assigned successfully');
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: donationActionTypes.ASSIGN_USER_TREES_FAILED,
                });
                toast.error(error.message);
            }
        )
    };
}

export const createWorkOrderForDonation = (donationId: number) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: donationActionTypes.CREATE_WORK_ORDER_REQUESTED,
        });
        apiClient.createWorkOrderForDonation(donationId).then(
            (value: boolean) => {
                dispatch({
                    type: donationActionTypes.CREATE_WORK_ORDER_SUCCEEDED,
                    payload: value,
                });
                toast.success('Work order created successfully');
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: donationActionTypes.CREATE_WORK_ORDER_FAILED,
                });
                toast.error(error.message);
            }
        )
    };
}
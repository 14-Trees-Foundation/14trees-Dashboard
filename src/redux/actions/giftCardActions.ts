import ApiClient from "../../api/apiClient/apiClient";
import { PaginatedResponse } from "../../types/pagination";
import { toast } from 'react-toastify';
import giftCardActionTypes from "../actionTypes/giftCardActionTypes";
import { GiftCard, GiftCardUser } from "../../types/gift_card";
import { User } from "../../types/user";
import { Order } from "../../types/common";


export const getGiftCards = (offset: number, limit: number, filters?: any[], orderBy?: Order[]) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: giftCardActionTypes.GET_GIFT_CARDS_REQUESTED,
        });
        apiClient.getGiftCards(offset, limit, filters, orderBy).then(
            (value: PaginatedResponse<GiftCard>) => {

                dispatch({
                    type: giftCardActionTypes.GET_GIFT_CARDS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: giftCardActionTypes.GET_GIFT_CARDS_FAILED,
                    payload: error
                });
            }
        )
    }
};


// export const createGiftCardRequest = (requestId: string, noOfCards: number, userId: number, groupId?: number, logo?: File, messages?: any, file?: File) => {
//     const apiClient = new ApiClient();
//     return (dispatch: any) => {
//         dispatch({
//             type: giftCardActionTypes.CREATE_GIFT_CARD_REQUESTED,
//         });
//         apiClient.createGiftCard(requestId, noOfCards, userId, groupId, logo, messages, file).then(
//             (value: GiftCard) => {
//                 toast.success('Gift Cards requested!')
//                 dispatch({
//                     type: giftCardActionTypes.CREATE_GIFT_CARD_SUCCEEDED,
//                     payload: value,

//                 });
//                 return (value)
//             },
//             (error: any) => {
//                 toast.error('Gift cards request failed')
//                 dispatch({
//                     type: giftCardActionTypes.CREATE_GIFT_CARD_FAILED,
//                 });
//                 return (error)
//             }
//         )
//     };
// };

export const cloneGiftCardRequest = (giftCardRequestId: number, requestId: string) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: giftCardActionTypes.CREATE_GIFT_CARD_REQUESTED,
        });
        apiClient.cloneGiftCardRequest(giftCardRequestId, requestId).then(
            (value: GiftCard) => {
                toast.success('Gift Cards requested!')
                dispatch({
                    type: giftCardActionTypes.CREATE_GIFT_CARD_SUCCEEDED,
                    payload: value,

                });
                return (value)
            },
            (error: any) => {
                toast.error('Gift cards request failed')
                dispatch({
                    type: giftCardActionTypes.CREATE_GIFT_CARD_FAILED,
                });
                return (error)
            }
        )
    };
};

// export const updateGiftCardRequest = (request: GiftCard, noOfCards: number, userId: number, groupId?: number, logo?: File, messages?: any, file?: File) => {
//     const apiClient = new ApiClient();
//     return (dispatch: any) => {
//         dispatch({
//             type: giftCardActionTypes.UPDATE_GIFT_CARD_REQUESTED,
//         });
//         apiClient.updateGiftCard(request, noOfCards, userId, groupId, logo, messages, file).then(
//             (value: GiftCard) => {
//                 toast.success('Updated Gift Cards requested!')
//                 dispatch({
//                     type: giftCardActionTypes.UPDATE_GIFT_CARD_SUCCEEDED,
//                     payload: value,

//                 });
//                 return (value)
//             },
//             (error: any) => {
//                 toast.error('Gift cards request failed')
//                 dispatch({
//                     type: giftCardActionTypes.UPDATE_GIFT_CARD_FAILED,
//                 });
//                 return (error)
//             }
//         )
//     };
// };

export const deleteGiftCardRequest = (request: GiftCard) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: giftCardActionTypes.DELETE_GIFT_CARD_REQUESTED,
        });
        apiClient.deleteGiftCardRequest(request.id).then(
            () => {
                toast.success('Deleted GIft Card request!')
                dispatch({
                    type: giftCardActionTypes.DELETE_GIFT_CARD_SUCCEEDED,
                    payload: request.id
                });
                return;
            },
            (error: any) => {
                toast.error('Failed to delete gift card request')
                dispatch({
                    type: giftCardActionTypes.DELETE_GIFT_CARD_FAILED,
                });
            }
        )
    };
};

export const getBookedGiftCards = (giftCardId: number, offset: number = 0, limit: number = 10) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: giftCardActionTypes.GET_BOOKED_GIFT_CARDS_REQUESTED,
        });
        apiClient.getBookedGiftTrees(giftCardId, offset, limit).then(
            (value: PaginatedResponse<GiftCardUser>) => {
                dispatch({
                    type: giftCardActionTypes.GET_BOOKED_GIFT_CARDS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                dispatch({
                    type: giftCardActionTypes.GET_BOOKED_GIFT_CARDS_FAILED,
                });
            }
        )
    }
}

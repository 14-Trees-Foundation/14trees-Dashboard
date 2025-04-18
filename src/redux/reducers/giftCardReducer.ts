import { GiftCard, GiftCardUser, GiftCardUsersDataState, GiftCardsDataState } from "../../types/gift_card";
import { UnknownAction } from "redux";

import giftCardActionTypes from "../actionTypes/giftCardActionTypes";
import { PaginatedResponse } from "../../types/pagination";


export const giftCardsDataReducer = (state = { totalGiftCards: 0, giftCards: {}, loading: false, paginationMapping: {} }, action: UnknownAction): GiftCardsDataState => {
    switch (action.type) {
        case giftCardActionTypes.GET_GIFT_CARDS_SUCCEEDED:
            if (action.payload) {

                let giftCardsDataState: GiftCardsDataState = { 
                    loading: state.loading,
                    totalGiftCards: state.totalGiftCards, 
                    giftCards: { ...state.giftCards }, 
                    paginationMapping: { ...state.paginationMapping }
                };
                let payload = action.payload as PaginatedResponse<GiftCard>;
                const offset = payload.offset;

                if (payload.offset === 0){ 
                    giftCardsDataState.giftCards = {}
                    giftCardsDataState.paginationMapping = {}
                }

                let giftCards = payload.results;
                for (let i = 0; i < giftCards.length; i++) {
                    if (giftCards[i]?.id) {
                        giftCards[i].key = giftCards[i].id
                        giftCardsDataState.giftCards[giftCards[i].id] = giftCards[i]
                        giftCardsDataState.paginationMapping[offset + i] = giftCards[i].id
                    }
                }

                return { ...giftCardsDataState, loading: false, totalGiftCards: payload.total };
            }
            return state;

        case giftCardActionTypes.GET_GIFT_CARDS_REQUESTED:
            return { totalGiftCards: state.totalGiftCards, giftCards: { ...state.giftCards }, paginationMapping: { ...state.paginationMapping }, loading: true };

        case giftCardActionTypes.GET_GIFT_CARDS_FAILED:
            return { totalGiftCards: state.totalGiftCards, giftCards: { ...state.giftCards }, paginationMapping: { ...state.paginationMapping }, loading: false };

        case giftCardActionTypes.CREATE_GIFT_CARD_SUCCEEDED:
            if (action.payload) {
                let nextState: GiftCardsDataState = { 
                    loading: state.loading,
                    totalGiftCards: state.totalGiftCards, 
                    giftCards: { ...state.giftCards }, 
                    paginationMapping: { ...state.paginationMapping }
                };

                let payload = action.payload as GiftCard
                payload.key = payload.id
                nextState.giftCards[payload.id] = payload;
                nextState.totalGiftCards += 1;
                return nextState;
            }
            return state;
        case giftCardActionTypes.UPDATE_GIFT_CARD_SUCCEEDED:
            if (action.payload) {
                let nextState: GiftCardsDataState = { 
                    loading: state.loading,
                    totalGiftCards: state.totalGiftCards, 
                    giftCards: { ...state.giftCards }, 
                    paginationMapping: { ...state.paginationMapping }
                };

                let payload = action.payload as GiftCard
                payload.key = payload.id
                nextState.giftCards[payload.id] = payload;
                return nextState;
            }
            return state;
        case giftCardActionTypes.DELETE_GIFT_CARD_SUCCEEDED:
            if (action.payload) {
                let nextState: GiftCardsDataState = { 
                    loading: state.loading,
                    totalGiftCards: state.totalGiftCards, 
                    giftCards: { ...state.giftCards }, 
                    paginationMapping: { ...state.paginationMapping }
                };

                Reflect.deleteProperty(nextState.giftCards, action.payload as number)
                nextState.totalGiftCards -= 1;
                return nextState;
            }
            return state;

        default:
            return state;
    }
};

export const giftCardUsersDataReducer = (state = { totalGiftCardUsers: 0, giftCardUsers: {} }, action: UnknownAction): GiftCardUsersDataState => {
    switch (action.type) {
        case giftCardActionTypes.GET_BOOKED_GIFT_CARDS_SUCCEEDED:
            if (action.payload) {
                let giftCardUsersDataState: GiftCardUsersDataState = { totalGiftCardUsers: state.totalGiftCardUsers, giftCardUsers: { ...state.giftCardUsers } };
                let payload = action.payload as PaginatedResponse<GiftCardUser>;
                if (giftCardUsersDataState.totalGiftCardUsers !== payload.total) {
                    giftCardUsersDataState.giftCardUsers = {}
                }
                giftCardUsersDataState.totalGiftCardUsers = payload.total;
                let giftCardUsers = payload.results;

                for (let i = 0; i < giftCardUsers.length; i++) {
                    if (giftCardUsers[i]?.id) {
                        giftCardUsers[i].key = giftCardUsers[i].id
                        giftCardUsersDataState.giftCardUsers[giftCardUsers[i].id] = giftCardUsers[i]
                    }
                }

                const nextState: GiftCardUsersDataState = giftCardUsersDataState;
                return nextState;
            }
            return state;
        
        case giftCardActionTypes.REDEEM_GIFT_CARD_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalGiftCardUsers: state.totalGiftCardUsers, giftCardUsers: { ...state.giftCardUsers } } as GiftCardUsersDataState;
                let payload = action.payload as GiftCardUser
                payload.key = payload.id
                nextState.giftCardUsers[payload.id] = payload;
                return nextState;
            }
            return state;
        default:
            return state;
    }
}
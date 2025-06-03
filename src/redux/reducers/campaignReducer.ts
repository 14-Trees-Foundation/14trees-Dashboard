import { Campaign, CampaignsDataState } from "../../types/campaign";
import { UnknownAction } from "redux";
import campaignActionTypes from "../actionTypes/campaignActionTypes";
import { PaginatedResponse } from "../../types/pagination";

export const campaignsDataReducer = (
    state = {
        totalCampaigns: 0,
        campaigns: {},
        loading: false,
        paginationMapping: {}
    },
    action: UnknownAction
): CampaignsDataState => {
    switch (action.type) {
        case campaignActionTypes.GET_CAMPAIGNS_SUCCEEDED:
            if (action.payload) {
                let campaignsDataState: CampaignsDataState = {
                    loading: state.loading,
                    totalCampaigns: state.totalCampaigns,
                    campaigns: { ...state.campaigns },
                    paginationMapping: { ...state.paginationMapping }
                };

                let payload = action.payload as PaginatedResponse<Campaign>;
                const offset = payload.offset;

                if (payload.offset === 0) {
                    campaignsDataState.campaigns = {};
                    campaignsDataState.paginationMapping = {};
                }

                let campaigns = payload.results;
                for (let i = 0; i < campaigns.length; i++) {
                    if (campaigns[i]?.id) {
                        campaigns[i].key = campaigns[i].id;
                        campaignsDataState.campaigns[campaigns[i].id] = campaigns[i];
                        campaignsDataState.paginationMapping[offset + i] = campaigns[i].id;
                    }
                }

                return {
                    ...campaignsDataState,
                    loading: false,
                    totalCampaigns: payload.total
                };
            }
            return state;

        case campaignActionTypes.GET_CAMPAIGNS_REQUESTED:
            return {
                totalCampaigns: state.totalCampaigns,
                campaigns: { ...state.campaigns },
                paginationMapping: { ...state.paginationMapping },
                loading: true
            };

        case campaignActionTypes.GET_CAMPAIGNS_FAILED:
            return {
                totalCampaigns: state.totalCampaigns,
                campaigns: { ...state.campaigns },
                paginationMapping: { ...state.paginationMapping },
                loading: false
            };

        case campaignActionTypes.CREATE_CAMPAIGN_SUCCEEDED:
            if (action.payload) {
                let nextState: CampaignsDataState = {
                    loading: state.loading,
                    totalCampaigns: state.totalCampaigns,
                    campaigns: { ...state.campaigns },
                    paginationMapping: { ...state.paginationMapping }
                };

                let payload = action.payload as Campaign;
                payload.key = payload.id;
                nextState.campaigns[payload.id] = payload;
                nextState.totalCampaigns += 1;
                return nextState;
            }
            return state;

        case campaignActionTypes.UPDATE_CAMPAIGN_SUCCEEDED:
            if (action.payload) {
                let nextState: CampaignsDataState = {
                    loading: state.loading,
                    totalCampaigns: state.totalCampaigns,
                    campaigns: { ...state.campaigns },
                    paginationMapping: { ...state.paginationMapping }
                };

                let payload = action.payload as Campaign;
                payload.key = payload.id;
                nextState.campaigns[payload.id] = payload;
                return nextState;
            }
            return state;

        case campaignActionTypes.DELETE_CAMPAIGN_SUCCEEDED:
            if (action.payload) {
                let nextState: CampaignsDataState = {
                    loading: state.loading,
                    totalCampaigns: state.totalCampaigns,
                    campaigns: { ...state.campaigns },
                    paginationMapping: { ...state.paginationMapping }
                };

                Reflect.deleteProperty(nextState.campaigns, action.payload as number);
                nextState.totalCampaigns -= 1;
                return nextState;
            }
            return state;

        default:
            return state;
    }
};
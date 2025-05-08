import { UnknownAction } from "redux";
import { Site, SitesDataState } from "../../types/site";
import siteActionTypes from "../actionTypes/siteActionTypes";
import { PaginatedResponse } from "../../types/pagination";

export const sitesDataReducer = (state = { loading: false, totalSites: 0, sites: {}, paginationMapping: {} }, action: UnknownAction): SitesDataState => {
    switch (action.type) {
        case siteActionTypes.GET_SITES_SUCCEEDED:
            if (action.payload) {
                let sitesDataState: SitesDataState = {
                    loading: state.loading,
                    totalSites: state.totalSites,
                    sites: { ...state.sites },
                    paginationMapping: { ...state.paginationMapping }
                };
                let payload = action.payload as PaginatedResponse<Site>;
                const offset = payload.offset;

                if (payload.offset === 0) {
                    sitesDataState.sites = {}
                    sitesDataState.paginationMapping = {}
                }

                let sites = payload.results;
                for (let i = 0; i < sites.length; i++) {
                    if (sites[i]?.id) {
                        sites[i].key = sites[i].id
                        sitesDataState.sites[sites[i].id] = sites[i]
                        sitesDataState.paginationMapping[offset + i] = sites[i].id
                    }
                }
                return { ...sitesDataState, loading: false, totalSites: payload.total };
            }
            return state;

        case siteActionTypes.GET_SITES_REQUESTED:
            return { totalSites: state.totalSites, sites: { ...state.sites }, paginationMapping: { ...state.paginationMapping }, loading: true };

        case siteActionTypes.GET_SITES_FAILED:
            return { totalSites: state.totalSites, sites: { ...state.sites }, paginationMapping: { ...state.paginationMapping }, loading: false };

        case siteActionTypes.CREATE_SITE_SUCCEEDED:
            if (action.payload) {
                const nextState = { 
                    loading: state.loading,
                    totalSites: state.totalSites, 
                    sites: { ...state.sites },
                    paginationMapping: { ...state.paginationMapping }
                } as SitesDataState;

                let payload = action.payload as Site
                payload.key = payload.id
                nextState.sites[payload.id] = payload;
                nextState.totalSites += 1;
                return nextState;
            }
            return state;

        case siteActionTypes.UPDATE_SITE_SUCCEEDED:
            if (action.payload) {
                const nextState = { 
                    loading: state.loading,
                    totalSites: state.totalSites, 
                    sites: { ...state.sites },
                    paginationMapping: { ...state.paginationMapping }
                } as SitesDataState;

                let payload = action.payload as Site
                payload.key = payload.id
                nextState.sites[payload.id] = payload;
                return nextState;
            }
            return state;

        case siteActionTypes.DELETE_SITE_SUCCEEDED:
            if (action.payload) {
                const nextState = { 
                    loading: state.loading,
                    totalSites: state.totalSites, 
                    sites: { ...state.sites },
                    paginationMapping: { ...state.paginationMapping }
                } as SitesDataState;

                Reflect.deleteProperty(nextState.sites, action.payload as number)
                nextState.totalSites -= 1;
                return nextState;
            }
            return state;

        default:
            return state;
    }
};
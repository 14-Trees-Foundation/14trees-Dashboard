import { UnknownAction } from "redux";
import { Site, SitesDataState } from "../../types/site";
import siteActionTypes from "../actionTypes/siteActionTypes";
import { PaginatedResponse } from "../../types/pagination";

export const sitesDataReducer = (state = { totalSites:0, sites: {}}, action: UnknownAction ): SitesDataState => {
    switch (action.type) {
        case siteActionTypes.GET_SITES_SUCCEEDED:
            if (action.payload) {
                let sitesDataState: SitesDataState = { totalSites: state.totalSites, sites: { ...state.sites }};
                let payload = action.payload as PaginatedResponse<Site>;
                console.log(payload)
                if (sitesDataState.totalSites != payload.total) {
                    sitesDataState.sites = {}
                }
                sitesDataState.totalSites = payload.total;
                let sites = payload.results;
                for (let i = 0; i < sites.length; i++) {
                    if (sites[i]?.id) {
                        sites[i].key = sites[i].id
                        sitesDataState.sites[sites[i].id] = sites[i]
                    }
                }
                const nextState: SitesDataState = sitesDataState;
                return nextState;
            }
            return state;
        case siteActionTypes.CREATE_SITE_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalSites: state.totalSites, sites: { ...state.sites }} as SitesDataState;
                let payload = action.payload as Site
                payload.key = payload.id
                nextState.sites[payload.id] = payload;
                nextState.totalSites += 1;
                return nextState;
            }
            return state;
        case siteActionTypes.UPDATE_SITE_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalSites: state.totalSites, sites: { ...state.sites }} as SitesDataState;
                let payload = action.payload as Site
                payload.key = payload.id
                nextState.sites[payload.id] = payload;
                return nextState;
            }
            return state;
        case siteActionTypes.DELETE_SITE_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalSites: state.totalSites, sites: { ...state.sites }} as SitesDataState;
                Reflect.deleteProperty(nextState.sites, action.payload as number)
                nextState.totalSites -= 1;
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};

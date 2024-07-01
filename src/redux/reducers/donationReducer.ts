import { UnknownAction } from "redux";
import { Donation, DonationDataState } from "../../types/donation";
import donationActionTypes from "../actionTypes/donationActionTypes";
import { PaginatedResponse } from "../../types/pagination";

export const donationsDataReducer = (state = { totalDonations:0, donations: {}}, action: UnknownAction ): DonationDataState => {
  switch (action.type) {
      case donationActionTypes.GET_DONATIONS_SUCCEEDED:
          if (action.payload) {
              let donationDataState: DonationDataState = { totalDonations: state.totalDonations, donations: {...state.donations}};
              let payload = action.payload as PaginatedResponse<Donation>;
              console.log(payload)
              if (donationDataState.totalDonations != payload.total) {
                donationDataState.donations = {}
              }
              donationDataState.totalDonations = payload.total;
              let donations = payload.results;
              for (let i = 0; i < donations.length; i++) {
                  if (donations[i]?.id) {
                    donations[i].key = donations[i].id
                    donationDataState.donations[donations[i].id] = donations[i]
                  }
              }
              const nextState: DonationDataState = donationDataState;
              return nextState;
          }
          return state;
      
          case donationActionTypes.CREATE_DONATION_SUCCEEDED:
          if (action.payload) {
              const nextState = { totalDonations: state.totalDonations, donations: { ...state.donations }} as DonationDataState;
              let payload = action.payload as Donation
              payload.key = payload.id
              nextState.donations[payload.id] = payload;
              nextState.totalDonations += 1;
              return nextState;
          }
          return state;
      case donationActionTypes.UPDATE_DONATION_SUCCEEDED:
          if (action.payload) {
              const nextState = { totalDonations: state.totalDonations, donations: { ...state.donations }} as DonationDataState;
              let payload = action.payload as Donation
              payload.key = payload.id
              nextState.donations[payload.id] = payload;
              return nextState;
          }
          return state;
      case donationActionTypes.DELETE_DONATION_SUCCEEDED:
          if (action.payload) {
              const nextState = { totalDonations: state.totalDonations, donations: { ...state.donations }} as DonationDataState;
              Reflect.deleteProperty(nextState.donations, action.payload as number)
              nextState.totalDonations -= 1;
              return nextState;
          }
          return state;
      
      default:
          return state;
  }
};


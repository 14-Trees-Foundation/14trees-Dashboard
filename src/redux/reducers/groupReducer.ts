import { UnknownAction } from "redux";
import { Group, GroupsDataState } from "../../types/Group";
import groupActionTypes from "../actionTypes/groupActionTypes";
import { PaginatedResponse } from "../../types/pagination";

export const groupsDataReducer = (state: GroupsDataState = { loading: false, totalGroups: 0, groups: {}, paginationMapping: {} }, action: UnknownAction): GroupsDataState => {
    switch (action.type) {
        case groupActionTypes.GET_GROUPS_SUCCEEDED:
            if (action.payload) {
            const payload = action.payload as PaginatedResponse<Group>;
             let groupsDataState: GroupsDataState = { loading: false, totalGroups: payload.total, groups: { ...state.groups }, paginationMapping: { ...state.paginationMapping }};

             if (payload.offset === 0) { 
                groupsDataState.groups = {};
                groupsDataState.paginationMapping = {}; 
               }

            payload.results.forEach((group: Group, index: number) => {
             if (group?.id) {
                group.key = group.id;
                groupsDataState.groups[group.id] = group;
                groupsDataState.paginationMapping[payload.offset + index] = group.id;
            }
        });
        return groupsDataState;
      }
      return state;
    case groupActionTypes.CREATE_GROUP_SUCCEEDED:
      if (action.payload) {
        const payload = action.payload as Group;
        return {
          loading: false,
          totalGroups: state.totalGroups + 1,
          groups: { 
            ...state.groups, 
            [payload.id]: { ...payload, key: payload.id } 
          },
          paginationMapping: { ...state.paginationMapping }
        };
      }
      return state;

    case groupActionTypes.UPDATE_GROUP_SUCCEEDED:
      if (action.payload) {
        const payload = action.payload as Group;
        return {
          ...state,
          groups: { 
            ...state.groups, 
            [payload.id]: { ...payload, key: payload.id } 
          }
        };
      }
      return state;

    case groupActionTypes.DELETE_GROUP_SUCCEEDED:
      if (action.payload) {
        const id = action.payload as number;
        const newGroups = { ...state.groups };
        delete newGroups[id];
        const newMapping = { ...state.paginationMapping };
        Object.entries(newMapping).forEach(([index, groupId]) => {
          if (groupId === id) {
            delete newMapping[Number(index)];
          }
        });

        return {
          ...state,
          totalGroups: state.totalGroups - 1,
          groups: newGroups,
          paginationMapping: newMapping
        };
      }
      return state;

    default:
      return state;
  }
};

export const searchGroupsDataReducer = (state: GroupsDataState = { loading: false, totalGroups: 0, 
    groups: {}, 
    paginationMapping: {} 
  }, 
  action: UnknownAction
): GroupsDataState => {
  switch(action.type) {
    case groupActionTypes.SEARCH_GROUPS_SUCCEEDED:
      if (action.payload) {
        const payload = action.payload as PaginatedResponse<Group>;
        let groupsDataState: GroupsDataState = { 
          ...state,
          groups: {},
          paginationMapping: {}
        };

        payload.results.forEach((group: Group) => {
          if (group?.id) {
            group.key = group.id;
            groupsDataState.groups[group.id] = group;
          }
        });

        return groupsDataState;
      }
      return state;
    default:
      return state;
  }
}
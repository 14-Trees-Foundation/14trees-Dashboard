import { UnknownAction } from "redux";
import { GroupMappingState } from "../../types/Group";
import userGroupActionTypes from "../actionTypes/userGroupsActionTypes";

export const userGroupsDataReducer = (state = {}, action: UnknownAction ): GroupMappingState => {
    switch (action.type) {
        case userGroupActionTypes.CREATE_BULK_USER_GROUP_MAPPING_SUCCEEDED:
            if (action.payload) {
                let groupsDataState: GroupMappingState = { ...state }
                const { groupId, data } = action.payload as any
                groupsDataState[groupId] = data;    
                return groupsDataState;
            }
            return state;
        
        default:
            return state;
    }
};
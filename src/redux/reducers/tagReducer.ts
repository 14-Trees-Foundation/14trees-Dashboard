import { Tag, TagsDataState } from "../../types/tag";
import { UnknownAction } from "redux";

import tagActionTypes from "../actionTypes/tagActionTypes";
import { PaginatedResponse } from "../../types/pagination";


export const tagsDataReducer = (state = { totalTags: 0, tags: {} }, action: UnknownAction): TagsDataState => {
    switch (action.type) {
        case tagActionTypes.GET_TAGS_SUCCEEDED:
            if (action.payload) {
                let tagsDataState: TagsDataState = { totalTags: state.totalTags, tags: { ...state.tags } };
                let payload = action.payload as PaginatedResponse<Tag>;

                if (tagsDataState.totalTags !== payload.total) {
                    tagsDataState.tags = {}
                }
                tagsDataState.totalTags = payload.total;
                let tags = payload.results;

                for (let i = 0; i < tags.length; i++) {
                    if (tags[i]?.id) {
                        tags[i].key = tags[i].id
                        tagsDataState.tags[tags[i].id] = tags[i]
                    }
                }

                const nextState: TagsDataState = tagsDataState;
                return nextState;
            }
            return state;

        case tagActionTypes.CREATE_TAGS_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalTags: state.totalTags, tags: { ...state.tags } } as TagsDataState;
                let payload = action.payload as Tag

                nextState.tags[payload.id] = payload;
                nextState.totalTags += 1;
                return nextState;
            }
            return state;

        default:
            return state;
    }
};


import ApiClient from "../../api/apiClient/apiClient";
import tagActionTypes from "../actionTypes/tagActionTypes";
import { toast } from "react-toastify";
import { PaginatedResponse } from "../../types/pagination";
import { Tag } from "../../types/tag";

export const getTags = (offset: number, limit: number) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: tagActionTypes.GET_TAGS_REQUESTED,
        });
        apiClient.getTags(offset, limit).then(
            (value: PaginatedResponse<Tag>) => {
                for (let i = 0; i < value.results.length; i++) {
                    if (value.results[i]?.id) {
                        value.results[i].key = value.results[i].id
                    }
                }
                dispatch({
                    type: tagActionTypes.GET_TAGS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                toast.error(error.message);
                dispatch({
                    type: tagActionTypes.GET_TAGS_FAILED,
                    payload: error
                });
            }
        )
    }
};
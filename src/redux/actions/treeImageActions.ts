import { toast } from "react-toastify";
import ApiClient from "../../api/apiClient/apiClient";
import treeImageActionTypes from "../actionTypes/treeImagesActionTypes";
import { TreeImage } from "../../types/tree_snapshots";
import { PaginatedResponse } from "../../types/pagination";

export const getTreeImages = (saplingId: string, offset: number, limit: number) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: treeImageActionTypes.GET_TREE_IMAGES_REQUESTED,
        });
        apiClient.getTreeImages(saplingId, offset, limit).then(
            (value: PaginatedResponse<TreeImage>) => {
                for (let i = 0; i < value.results.length; i++) {
                    if (value.results[i]?.id) {
                        value.results[i].key = value.results[i].id
                    }
                }
                dispatch({
                    type: treeImageActionTypes.GET_TREE_IMAGES_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                toast.error(error.message);
                dispatch({
                    type: treeImageActionTypes.GET_TREE_IMAGES_FAILED,
                    payload: error
                });
            }
        )
    }
};
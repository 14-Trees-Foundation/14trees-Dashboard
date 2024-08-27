import { UnknownAction } from "redux";
import { PaginatedResponse } from "../../types/pagination";
import treeImageActionTypes from "../actionTypes/treeImagesActionTypes";
import { TreeImage, TreeImagesDataState } from "../../types/tree_snapshots";

export const treeImagesDataReducer = (state = { totalTreeImages:0, treeImages: {}}, action: UnknownAction ): TreeImagesDataState => {
    switch (action.type) {
        case treeImageActionTypes.GET_TREE_IMAGES_SUCCEEDED:
            if (action.payload) {
                let treeImagesDataState: TreeImagesDataState = { totalTreeImages: state.totalTreeImages, treeImages: { ...state.treeImages }};
                let payload = action.payload as PaginatedResponse<TreeImage>;
                console.log(payload)
                if (treeImagesDataState.totalTreeImages != payload.total) {
                    treeImagesDataState.treeImages = {}
                }
                treeImagesDataState.totalTreeImages = payload.total;
                let treeImages = payload.results;
                for (let i = 0; i < treeImages.length; i++) {
                    if (treeImages[i]?.id) {
                        treeImages[i].key = treeImages[i].id
                        treeImagesDataState.treeImages[treeImages[i].id] = treeImages[i]
                    }
                }
                const nextState: TreeImagesDataState = treeImagesDataState;
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};

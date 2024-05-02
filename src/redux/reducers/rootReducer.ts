import { combineReducers } from "redux";
import { treeTypesDataReducer } from "./treeTypeReducer";

const rootReducer = combineReducers({
    treeTypesData: treeTypesDataReducer,
});

export default rootReducer;

import { combineReducers } from "redux";
import { treeTypesDataReducer } from "./treeTypeReducer";
import { onsiteStaffsDataReducer } from "./onsiteStaffReducer";
import { organizationsDataReducer } from "./organizationReducer";
import { plotsDataReducer } from "./plotReducer";
import { pondsDataReducer } from "./pondReducer";
import { treesDataReducer } from "./treeReducer";
import { usersDataReducer } from "./userReducer";
import { userTreesDataReducer } from "./userTreeReducer";

const rootReducer = combineReducers({
    treeTypesData: treeTypesDataReducer,
    onsiteStaffsData: onsiteStaffsDataReducer,
    organizationsData: organizationsDataReducer,
    plotsData: plotsDataReducer,
    pondsData: pondsDataReducer,
    treesData: treesDataReducer,
    usersData: usersDataReducer,
    userTreesData: userTreesDataReducer,

});

export default rootReducer;

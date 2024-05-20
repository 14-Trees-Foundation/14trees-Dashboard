import { combineReducers } from "redux";
import { treeTypesDataReducer, searchTreeTypesDataReducer } from "./treeTypeReducer";
import { onsiteStaffsDataReducer } from "./onsiteStaffReducer";
import { organizationsDataReducer, searchOrganizationsDataReducer } from "./organizationReducer";
import { plotsDataReducer, searchPlotsDataReducer } from "./plotReducer";
import { pondsDataReducer, searchPondsDataReducer } from "./pondReducer";
import { treesDataReducer } from "./treeReducer";
import { usersDataReducer, searchUsersDataReducer } from "./userReducer";
import { userTreesDataReducer, userTreeCountDataReducer } from "./userTreeReducer";

const rootReducer = combineReducers({
    treeTypesData: treeTypesDataReducer,
    onsiteStaffsData: onsiteStaffsDataReducer,
    organizationsData: organizationsDataReducer,
    plotsData: plotsDataReducer,
    pondsData: pondsDataReducer,
    treesData: treesDataReducer,
    usersData: usersDataReducer,
    userTreesData: userTreesDataReducer,
    userTreeCountData: userTreeCountDataReducer,
    searchTreeTypesData: searchTreeTypesDataReducer,
    searchPondsData: searchPondsDataReducer,
    searchPlotsData: searchPlotsDataReducer,
    searchUsersData: searchUsersDataReducer,
    searchOrganizationsData: searchOrganizationsDataReducer,
});

export default rootReducer;

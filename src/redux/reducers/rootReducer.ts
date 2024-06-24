import { combineReducers } from "redux";
import { plantTypesDataReducer, searchPlantTypesDataReducer } from "./plantTypeReducer";
import { onsiteStaffsDataReducer } from "./onsiteStaffReducer";
import { groupsDataReducer } from "./groupReducer";
import { plotsDataReducer, searchPlotsDataReducer, getPlotTagsDataReducer } from "./plotReducer";
import { sitesDataReducer } from "./siteReducer";
import { pondsDataReducer, searchPondsDataReducer, pondHistoryDataReducer } from "./pondReducer";
import { treesDataReducer } from "./treeReducer";
import { usersDataReducer, searchUsersDataReducer } from "./userReducer";
import { userTreesDataReducer, userTreeCountDataReducer } from "./userTreeReducer";
import { userGroupsDataReducer } from "./userGroupReducer";

const rootReducer = combineReducers({
    plantTypesData: plantTypesDataReducer,
    onsiteStaffsData: onsiteStaffsDataReducer,
    groupsData: groupsDataReducer,
    userGroupsData: userGroupsDataReducer,
    sitesData: sitesDataReducer,
    plotsData: plotsDataReducer,
    plotTags: getPlotTagsDataReducer,
    pondsData: pondsDataReducer,
    pondHistoryData: pondHistoryDataReducer,
    treesData: treesDataReducer,
    usersData: usersDataReducer,
    userTreesData: userTreesDataReducer,
    userTreeCountData: userTreeCountDataReducer,
    searchPlantTypesData: searchPlantTypesDataReducer,
    searchPondsData: searchPondsDataReducer,
    searchPlotsData: searchPlotsDataReducer,
    searchUsersData: searchUsersDataReducer,
});

export default rootReducer;

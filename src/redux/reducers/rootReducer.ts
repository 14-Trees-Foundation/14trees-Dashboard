import { combineReducers } from "redux";
import { plantTypesDataReducer, searchPlantTypesDataReducer } from "./plantTypeReducer";
import { onsiteStaffsDataReducer } from "./onsiteStaffReducer";
import { organizationsDataReducer, searchOrganizationsDataReducer } from "./organizationReducer";
import { plotsDataReducer, searchPlotsDataReducer, getPlotTagsDataReducer } from "./plotReducer";
import { pondsDataReducer, searchPondsDataReducer, pondHistoryDataReducer } from "./pondReducer";
import { treesDataReducer } from "./treeReducer";
import { usersDataReducer, searchUsersDataReducer } from "./userReducer";
import { userTreesDataReducer, userTreeCountDataReducer } from "./userTreeReducer";

const rootReducer = combineReducers({
    plantTypesData: plantTypesDataReducer,
    onsiteStaffsData: onsiteStaffsDataReducer,
    organizationsData: organizationsDataReducer,
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
    searchOrganizationsData: searchOrganizationsDataReducer,
});

export default rootReducer;

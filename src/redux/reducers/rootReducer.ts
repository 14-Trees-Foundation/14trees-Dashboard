import { combineReducers } from "redux";
import { plantTypesDataReducer, searchPlantTypesDataReducer } from "./plantTypeReducer";
import { onsiteStaffsDataReducer } from "./onsiteStaffReducer";
import { groupsDataReducer, searchGroupsDataReducer } from "./groupReducer";
import { plotsDataReducer, searchPlotsDataReducer } from "./plotReducer";
import { sitesDataReducer } from "./siteReducer";
import { pondsDataReducer, searchPondsDataReducer } from "./pondReducer";
import { pondWaterLevelUpdatesDataReducer } from "./pondWaterLevelUpdateReducer";
import { treesDataReducer } from "./treeReducer";
import { usersDataReducer, searchUsersDataReducer } from "./userReducer";
import { userTreesDataReducer, userTreeCountDataReducer } from "./userTreeReducer";
import { userGroupsDataReducer } from "./userGroupReducer";
import { donationsDataReducer } from "./donationReducer";
import { eventsDataReducer } from "./eventReducer";
import { visitsDataReducer } from "./visitReducer";
import { visitUsersDataReducer} from "./visitUserReducer";
import { treeImagesDataReducer } from "./treeImageReducer";
import { giftCardUsersDataReducer, giftCardsDataReducer } from "./giftCardReducer";
import { tagsDataReducer } from "./tagReducer";

const rootReducer = combineReducers({
    plantTypesData: plantTypesDataReducer,
    onsiteStaffsData: onsiteStaffsDataReducer,
    groupsData: groupsDataReducer,
    userGroupsData: userGroupsDataReducer,
    sitesData: sitesDataReducer,
    plotsData: plotsDataReducer,
    pondsData: pondsDataReducer,
    pondWaterLevelUpdatesData: pondWaterLevelUpdatesDataReducer,
    treesData: treesDataReducer,
    treeImagesData: treeImagesDataReducer,
    usersData: usersDataReducer,
    userTreesData: userTreesDataReducer,
    userTreeCountData: userTreeCountDataReducer,
    searchPlantTypesData: searchPlantTypesDataReducer,
    searchPondsData: searchPondsDataReducer,
    searchPlotsData: searchPlotsDataReducer,
    searchUsersData: searchUsersDataReducer,
    searchGroupsData: searchGroupsDataReducer,
    donationsData: donationsDataReducer,
    eventsData: eventsDataReducer,
    visitsData:visitsDataReducer,
    visitUserData: visitUsersDataReducer,
    giftCardsData: giftCardsDataReducer,
    giftCardUsersData: giftCardUsersDataReducer,
    tagsData: tagsDataReducer,
});

export default rootReducer;

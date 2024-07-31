import { atom } from "recoil";

const treeTypesList = atom({
  key: "treetypes",
  default: [],
});

const plotsList = atom({
  key: "plots",
  default: [],
});

const albums = atom({
  key: "albums",
  default: [],
});

const adminNavIndex = atom({
  key: "adminnavindex",
  default: 0,
});

const summary = atom({
  key: "summary",
  default: {},
});

const treeByPlots = atom({
  key: "treebyplots",
  default: {},
});

const treeLoggedByDate = atom({
  key: "treebydate",
  default: {},
});

const treeLogByPlotDate = atom({
  key: "treelogbyplotdate",
  default: {},
});

const selectedPlot = atom({
  key: "selectedplot",
  default: "",
});

const treeTypeCount = atom({
  key: "treetypecount",
  default: {},
});

const treeTypeCountByPlot = atom({
  key: "treetypecountbyplot",
  default: {},
});

const wwSelectedAlbumImage = atom({
  key: "selectedalbum",
  default: {},
});

const searchTreeData = atom({
  key: "tree",
  default: {},
});

const allUserProfile = atom({
  key: "userprofile",
});

const userTreeHoldings = atom({
  key: "treeholdings",
});

const allPonds = atom({
  key: "allponds",
  default: {},
});

const selectedPond = atom({
  key: "selectedpond",
  default: "",
});

const pondHistory = atom({
  key: "pondhistory",
  default: "",
});

export {
  treeTypesList,
  plotsList,
  adminNavIndex,
  summary,
  treeByPlots,
  treeLoggedByDate,
  albums,
  wwSelectedAlbumImage,
  searchTreeData,
  treeLogByPlotDate,
  selectedPlot,
  treeTypeCount,
  treeTypeCountByPlot,
  allUserProfile,
  allPonds,
  selectedPond,
  pondHistory,
  userTreeHoldings,
};

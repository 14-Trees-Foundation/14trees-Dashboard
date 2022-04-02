import { atom } from "recoil";

const navIndex = atom({
  key: "navindex",
  default: 0,
});

const usersData = atom({
  key: "userinfo",
  default: {},
});

const selUsersData = atom({
  key: "seluserinfo",
  default: {},
});

const overallData = atom({
  key: "overallinfo",
  default: {},
});

const pondsImages = atom({
  key: "pondsimages",
  default: {},
});

const activitiesData = atom({
  key: "activities",
  default: {},
});

const openVideo = atom({
  key: "openVideo",
  default: false,
});

const openMemoryPopup = atom({
  key: "openMemoryPopup",
  default: false,
});

const openProfilePopup = atom({
  key: "openProfilePopup",
  default: false,
});

const videoUrl = atom({
  key: "videoUrl",
  default: "",
});

const searchResults = atom({
  key: "searchResults",
  default: {
    users: {},
  },
});

const searchKey = atom({
  key: "searchKey",
  default: "",
});

const searchError = atom({
  key: "searchError",
  default: false,
});

const birthdayData = atom({
  key: "birthday",
  default: {},
});

export {
  usersData,
  selUsersData,
  overallData,
  pondsImages,
  navIndex,
  activitiesData,
  openVideo,
  videoUrl,
  searchResults,
  searchKey,
  searchError,
  openMemoryPopup,
  openProfilePopup,
  birthdayData,
};

import { activitiesData } from "./atoms";
import {
  albums,
  treeLogByPlotDate,
  selectedPlot,
  treeTypeCountByPlot,
} from "./adminAtoms";
import { selector } from "recoil";

const sortedActivites = selector({
  key: "sortedActivites",
  get: ({ get }) => {
    const activities = get(activitiesData);
    let sortedA = [...activities];

    return sortedA.sort((a, b) => (a.date < b.date ? 1 : -1));
  },
});

const selectedAlbum = selector({
  key: "selectedAlbum",
  get: ({ get }) => {
    const a = get(albums);
    if (a.length > 0) {
      return a[0];
    } else {
      return {};
    }
  },
});

const selectedAlbumName = selector({
  key: "albumnName",
  get: ({ get }) => {
    const a = get(albums);
    if (a.length > 0) {
      return a[0].album_name;
    } else {
      return "";
    }
  },
});

const selectedImages = selector({
  key: "selectedImages",
  get: ({ get }) => {
    const a = get(albums);
    if (a.length > 0) {
      return a[0].images.map((image) => ({
        src: image,
      }));
    } else {
      return [];
    }
  },
});

const filteredTreeLogByPlotDate = selector({
  key: "treeLogByPlotDate",
  get: ({ get }) => {
    const a = get(treeLogByPlotDate);
    const selPlot = get(selectedPlot);
    let res = a.filter((data) => {
      return data.plot.name === selPlot;
    });
    return res;
  },
});

const filteredTreeTypeCountByPlot = selector({
  key: "treeTypeCountByPlot",
  get: ({ get }) => {
    const a = get(treeTypeCountByPlot);
    const selPlot = get(selectedPlot);
    let res = a.filter((data) => {
      return data.plot.name === selPlot;
    });
    return res;
  },
});

export {
  sortedActivites,
  selectedAlbum,
  selectedAlbumName,
  selectedImages,
  filteredTreeLogByPlotDate,
  filteredTreeTypeCountByPlot,
};

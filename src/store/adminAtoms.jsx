import { atom } from 'recoil';

const albums = atom({
    key: 'albums',
    default: []
})

const adminNavIndex = atom({
    key: 'adminnavindex',
    default: 0
})

const summary = atom({
    key: 'summary',
    default: {},
});

const treeByPlots = atom({
    key: 'treebyplots',
    default: {}
})

const treeLoggedByDate = atom({
    key: 'treebydate',
    default: {}
})

const treeLogByPlotDate = atom({
    key: 'treelogbyplotdate',
    default: {}
})

const selectedPlot = atom({
    key: 'selectedplot',
    default: ''
})

const treeTypeCount = atom({
    key: 'treetypecount',
    default: {}
})

const wwSelectedAlbumImage = atom({
    key: 'selectedalbum',
    default: {},
})

const searchTreeData = atom({
    key: 'tree',
    default: {},
})

export {
    adminNavIndex,
    summary,
    treeByPlots,
    treeLoggedByDate,
    albums,
    wwSelectedAlbumImage,
    searchTreeData,
    treeLogByPlotDate,
    selectedPlot,
    treeTypeCount
}
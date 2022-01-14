import { atom } from 'recoil';

const albums = atom({
    key: 'albums',
    default: []
})

const adminNavIndex = atom({
    key: 'adminnavindex',
    default: 0
})

const totalTrees = atom({
    key: 'totaltree',
    default: {},
});

const totalTreeTypes = atom({
    key: 'totaltreetypes',
    default: {},
});

const uniqueUsers = atom({
    key: 'uniqueusers',
    default: {},
});

const totalPlots = atom({
    key: 'totalplots',
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
    totalTrees,
    totalTreeTypes,
    uniqueUsers,
    totalPlots,
    treeByPlots,
    treeLoggedByDate,
    albums,
    wwSelectedAlbumImage,
    searchTreeData
}
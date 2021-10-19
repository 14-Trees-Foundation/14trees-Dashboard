import { atom } from 'recoil';

const navIndex = atom({
    key: 'navindex',
    default: 0
})

const usersData = atom({
    key: 'userinfo',
    default: {},
});

const overallData = atom({
    key: 'overallinfo',
    default: {},
});

const pondsImages = atom({
    key: 'pondsimages',
    default: {},
});

const activitiesData = atom({
    key: 'activities',
    default: {}
})

const currSelTree = atom({
    key: 'currTree',
    default: 0
})

const openVideo = atom({
    key: 'openVideo',
    default: false
})

const videoUrl = atom({
    key: 'videoUrl',
    default: ''
})

const searchResults = atom({
    key: 'searchResults',
    default: {
        users: {},
    },
})

const searchKey = atom({
    key: 'searchKey',
    default: "",
})

export {
    usersData,
    overallData,
    pondsImages,
    navIndex,
    activitiesData,
    currSelTree,
    openVideo,
    videoUrl,
    searchResults,
    searchKey
};
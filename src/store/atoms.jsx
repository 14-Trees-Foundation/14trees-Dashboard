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

export {
    usersData,
    overallData,
    pondsImages,
    navIndex,
    activitiesData,
    currSelTree
};
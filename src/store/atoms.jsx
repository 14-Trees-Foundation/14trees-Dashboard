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

export { usersData, overallData, pondsImages, navIndex };
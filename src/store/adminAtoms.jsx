import { atom } from 'recoil';

const navIndex = atom({
    key: 'navindex',
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

export {
    navIndex,
    totalTrees,
    totalTreeTypes
}
import { activitiesData } from './atoms';
import { selector } from 'recoil';

const sortedActivites = selector({
    key: 'sortedActivites',
    get: ({ get }) => {
        const activities = get(activitiesData);
        let sortedA = [...activities]

        return sortedA.sort((a, b) =>
            a.date < b.date ? 1 : -1
        );
    },
});

export {
    sortedActivites,
};
import { activitiesData } from './atoms';
import { albums } from './adminAtoms';
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

const selectedAlbum = selector({
    key: 'selectedAlbum',
    get: ({ get }) => {
        const a = get(albums);
        if (a.length > 0) {
            return a[0];
        } else {
            return {}
        }
    }
})

const selectedAlbumName = selector({
    key: 'albumnName',
    get: ({ get }) => {
        const a = get(albums);
        if (a.length > 0) {
            return a[0].album_name;
        } else {
            return ""
        }
    }
})

const selectedImages = selector({
    key: 'selectedImages',
    get: ({ get }) => {
        const a = get(albums);
        if (a.length > 0) {
            return a[0].images.map((image) => ({
                src: image
            }));
        } else {
            return []
        }
    }
})

export {
    sortedActivites,
    selectedAlbum,
    selectedAlbumName,
    selectedImages
};
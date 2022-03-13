import { createStyles, makeStyles } from '@mui/styles';
import { useRecoilValue, useRecoilState } from 'recoil';

import { TreesPlanted } from '../../../stories/TreesPlanted/TreesPlanted';
import { usersData, currSelTree } from '../../../store/atoms';

export const Trees = () => {

    const classes = useStyles();

    const userinfo = useRecoilValue(usersData);
    const [currTree, setCurrTree] = useRecoilState(currSelTree);
    // const setIndex = useSetRecoilState(navIndex);
    let numTrees = userinfo.trees.length
    let images = [];
    for (const tree of userinfo.trees) {
        images.push.apply(images, tree['memories']);
    }

    return (
        <div className={classes.main}>
            <div className={classes.card}>
                <div style={{ display: 'flex', lineHeight: '30px', padding: '10px 0 0 10px' }}>
                    <div style={{ padding: "1%", fontSize: '14px' }}>Trees Planted ({numTrees})</div>
                    {/* {
                        numTrees > 2 &&
                        <div style={{ marginLeft: 'auto', marginRight: '5%' }}>
                            <Chip label={"See All >"} mode={'primary'} size={'small'} handleClick={handleSeeAllClick}/>
                        </div>
                    } */}
                </div>
                <div className={classes.trees}>
                    <div className={classes.scroll}>
                        {
                            userinfo.trees.map((tree, idx) => {
                                const date = tree.tree.date_added.slice(0, 10)
                                return (
                                    <div key={idx} onClick={() => setCurrTree(idx)} style={{ cursor: 'pointer' }}>
                                        {
                                            currTree === idx ?
                                                <TreesPlanted
                                                    id={tree.tree.sapling_id}
                                                    name={tree.tree.tree_id.name}
                                                    img={tree.tree.image[0] === '' ? tree.tree.tree_id.image[0] : tree.tree.image[0]}
                                                    date={date}
                                                    selected={true} />
                                                :
                                                <TreesPlanted
                                                    id={tree.tree.sapling_id}
                                                    name={tree.tree.tree_id.name}
                                                    img={tree.tree.tree_id.image[0]}
                                                    date={date} />
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const useStyles = makeStyles((theme) =>
    createStyles({
        main: {
            width: '100%',
            height: '100%',
        },
        card: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            height: '100%',
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
        },
        trees: {
            width: 'calc(100% - 30px)',
            marginLeft: '15px',
            paddingTop: '5px',
            margin: '10px',
            height: '90%',
        },
        scroll: {
            maxHeight: 'calc(100% - 50px)',
            overflowX: 'hidden',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
                width: '0.2em',

            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#1F3625',
                borderRadius: '0.3em',
                height: '10px'
            },
        }
    })
)
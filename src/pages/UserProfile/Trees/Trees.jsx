import { createStyles, makeStyles } from '@mui/styles';

import { Chip } from "../../../stories/Chip/Chip";
import { TreesPlanted } from '../../../stories/TreesPlanted/TreesPlanted';

import { useRecoilValue } from 'recoil';
import { usersData } from '../../../store/atoms';

export const Trees = () => {

    const classes = useStyles();

    const userinfo = useRecoilValue(usersData);
    let numTrees = userinfo.trees.length
    let images = [];
    for (const tree of userinfo.trees) {
        images.push.apply(images, tree['memories']);
    }

    return (
        <div className={classes.main}>
            <div className={classes.card}>
                <div style={{ display: 'flex', lineHeight: '30px', padding: '10px 0 0 10px' }}>
                    <div style={{ padding: "1%", fontSize: '14px' }}>Trees Planted({numTrees})</div>
                    {
                        // numTrees > 2 &&
                        <div style={{ marginLeft: 'auto', marginRight: '5%' }}>
                            <Chip label={"See All >"} mode={'primary'} size={'small'} />
                        </div>
                    }
                </div>
                <div style={{ width: 'calc(100% - 30px)', marginLeft: '15px', paddingTop: '5px', height: '100%', overflow: 'hidden' }}>
                    <TreesPlanted
                        id={userinfo.trees[0].tree.sapling_id}
                        name={userinfo.trees[0].tree.tree_id.name}
                        img={userinfo.trees[0].tree.tree_id.image[0]}
                        date={userinfo.trees[0].tree.date_added} />
                    <TreesPlanted
                        id={userinfo.trees[0].tree.sapling_id}
                        name={userinfo.trees[0].tree.tree_id.name}
                        img={userinfo.trees[0].tree.tree_id.image[0]}
                        date={userinfo.trees[0].tree.date_added} />
                    <TreesPlanted
                        id={userinfo.trees[0].tree.sapling_id}
                        name={userinfo.trees[0].tree.tree_id.name}
                        img={userinfo.trees[0].tree.tree_id.image[0]}
                        date={userinfo.trees[0].tree.date_added} />
                </div>
            </div>
        </div>
        //                     <h2 style={{ "margin": "0 0px 5px 0", paddingTop: '5px' }}>Trees Planted</h2>
        //                     {
        //                         numTrees > 2 &&
        //                         <Chip label={"See All >"} mode={'secondary'} size={'small'} />
        //                     }
        //                 </div>
        //                 <div className="p-col-6 p-lg-6 p-md-6" style={{ "padding": 0, "cursor": "pointer" }}>
        //                     {
        //                         numTrees > 0
        //                             ?
        //                             <TreesPlanted
        //                                 id={userinfo.trees[0].tree.sapling_id}
        //                                 name={userinfo.trees[0].tree.tree_id.name}
        //                                 img={userinfo.trees[0].tree.tree_id.image[0]}
        //                                 date={userinfo.trees[0].tree.date_added} />
        //                             :
        //                             <TreesPlanted />
        //                     }
        //                 </div>
        //                 <div className="p-col-6 p-lg-6 p-md-6" style={{ "padding": 0, "cursor": "pointer" }}>
        //                     {
        //                         numTrees > 1
        //                             ?
        //                             <TreesPlanted
        //                                 id={userinfo.trees[1].tree.sapling_id}
        //                                 name={userinfo.trees[1].tree.tree_id.name}
        //                                 img={userinfo.trees[1].tree.tree_id.image[0]}
        //                                 date={userinfo.trees[1].tree.date_added} />
        //                             :
        //                             <TreesPlanted />
        //                     }
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
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
            maxHeight: '100%'
        }
    })
)
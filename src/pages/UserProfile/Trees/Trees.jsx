import { useHistory } from "react-router-dom";

import { Memories } from "./Memories/Memories";
import { Chip } from "../../../stories/Chip/Chip";
import { TreesPlanted } from '../../../stories/TreesPlanted/TreesPlanted';
import './trees.scss'
import 'primeflex/primeflex.css';

export const Trees = (props) => {
    console.log(props)

    const history = useHistory();

    let numTrees = props.trees.length
    let images = [];
    for (const tree of props.trees){
        images.push.apply(images,tree['memories']);
    }
    images = images.sort((a, b) => 0.5 - Math.random());

    const onAllTreeSelect = () => {
        history.push({
                pathname: '/trees',
                state: { trees: props.trees }
            });
    }
    return (
        <div className="trees">
            {/* <h2>Trees Planted</h2> */}
            <div className="p-grid nested-grid">
                <div className="p-col-12 p-lg-6 p-md-6 treesplanted">
                    <div className="p-grid" style={{"margin":0}}>
                        <div className="p-col-12" style={{"padding":0, "display":"flex"}}>
                            <h2 style={{"margin":"0 0px 5px 0", paddingTop:'5px'}}>Trees Planted</h2>
                            {
                                numTrees > 2 &&
                                <Chip label={"See All >"} mode={'secondary'} size={'small'} handleClick={onAllTreeSelect}/>
                            }
                        </div>
                        <div className="p-col-6 p-lg-6 p-md-6" style={{"padding":0}}>
                            {
                                numTrees > 0
                                ?
                                    <TreesPlanted
                                        id={props.trees[0].tree.sapling_id}
                                        name={props.trees[0].tree.tree_id.name}
                                        img={props.trees[0].tree.tree_id.image[0]}
                                        date={props.trees[0].tree.date_added}/>
                                :
                                    <TreesPlanted/>
                            }
                        </div>
                        <div className="p-col-6 p-lg-6 p-md-6" style={{"padding":0}}>
                            {
                                numTrees > 1
                                ?
                                    <TreesPlanted
                                    id={props.trees[1].tree.sapling_id}
                                    name={props.trees[1].tree.tree_id.name}
                                    img={props.trees[1].tree.tree_id.image[0]}
                                    date={props.trees[1].tree.date_added}/>
                                :
                                    <TreesPlanted/>
                            }
                        </div>
                    </div>
                </div>
                <div className="p-col-12 p-lg-6 p-md-6 memories">
                    <div className="p-grid" style={{"margin":0}}>
                        <div className="p-col-12" style={{"padding":0}}>
                            <h2 style={{"margin":"0 0 15px 0"}}>Memories</h2>
                        </div>
                            <div className="p-col-7 p-lg-7 p-md-7" style={{"padding":"0 0.3rem 0.2rem 0"}}>
                                <Memories
                                    img={images[0]}
                                    overlay="false"/>
                            </div>
                            <div className="p-col-5 p-lg-5 p-md-5" style={{"padding":"0 0.3rem 0.2rem 0"}}>
                                <Memories 
                                    img={images[1]}
                                    overlay="false"/>
                            </div>
                            <div className="p-col-7 p-lg-7 p-md-7" style={{"padding":"0 0.3rem 0.2rem 0"}}>
                                <Memories
                                    img={images[2]}
                                    overlay="false"/>
                            </div>
                            <div className="p-col-5 p-lg-5 p-md-5" style={{"padding":"0 0.3rem 0.2rem 0"}}>
                                <Memories 
                                img={images[3]}
                                overlay="true"/>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
import React, { Fragment, useState } from 'react';

import { createStyles, makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Carousel from 'react-gallery-carousel';

import { Appbar } from './Appbar';
import headerimg from '../../assets/header.png';
import logos from '../../assets/logos.png';
import item1 from '../../assets/item1.png';
import item2 from '../../assets/item2.png';
import vector1 from '../../assets/vector1.png';
import vector2 from '../../assets/treevector.png';
import gatimg from '../../assets/gaticon.png';
import treeicon from '../../assets/treeicon.png';
import footicon from "../../assets/footicon.png";
import footericon from "../../assets/footericon.png";
import 'react-gallery-carousel/dist/index.css';

import { Divider } from '@mui/material';
import { Chip } from '../../stories/Chip/Chip'

const images = [1,2,3,4,5,6,7,8,9].map((number) => ({
    src: `https://14treesplants.s3.ap-south-1.amazonaws.com/memories/kpit${number}.jpeg`
}));

const treeimages = [
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_07d6effc-6d4a-4480-9d75-e1d29780e894.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_efb3533f-92b6-4219-a7f4-463e49fd2db7.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_fec3b15a-62ab-49ef-8e86-cef80cef02c2.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_ee6f6b8a-126a-4e82-bc8e-906e4aefc3a4.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_712bbd26-de42-4d4d-b580-70f438aa13db.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_d8f1b606-ae21-4de8-8adf-55cd3d23534e.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_0bf4687d-b54b-4c06-9dbb-6c244a85e27b.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_b730a046-a838-4243-a4c5-7ffb4590d165.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_dde63c15-dc36-471f-bda9-a1300189c2c5.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_245135e1-971e-4551-8b84-ffa30d6a038c.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_157c6708-6ba4-4a97-bc70-5f60a88891f5.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_78e638ae-aeda-4380-b14e-a5d0da4e9af5.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_7f433a08-d260-432c-bf60-9cd12db33f18.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_1622ed99-9eb8-48fc-b22a-68bad2470810.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_dfa2714c-45a1-4741-b3cb-9c956ef8c14e.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_0406cd0e-95d6-4edb-a997-13de3e980f36.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_ed35e6b1-c129-43ac-af3b-9ed1f936a3de.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_f9278d0f-af15-454e-b7c4-f9375e6cb826.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_1c9d4a0d-f267-4452-b1da-b49e33c78036.jpg",
    "https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_24fa5f0a-4aec-4114-acbf-6bde2547368b.jpg",

]

export const Events = () => {
    const [showMore, setShowMore] = useState(true);
    const [treeList,setTreeList] = useState(treeimages.slice(0, 8));
    const [index,setIndex] = useState(8);

    const loadMore = () =>{
        const newIndex = index + 8;
        const newShowMore = newIndex < 19;
        const newList = treeimages.slice(0, newIndex);
        setIndex(newIndex);
        setTreeList(newList);
        setShowMore(newShowMore);
    }

    const classes = useStyles();
    return (
        <Fragment>
            <div className={classes.main}>
                <Appbar />
                <div className={classes.header}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={5}>
                                <div className={classes.logos}>
                                    <img className={classes.logo} src={logos} alt="logo" />
                                </div>
                                <p className={classes.maintxt}>
                                    Celebrating 20 years of reimagining mobility together
                                </p>
                                <Divider style={{background: '#ffffff'}}/>
                                <div className={classes.detail}>
                                    <div style={{marginBottom: '5px'}}>Event name: <b>KPIT-DENSO</b></div>
                                    <div style={{marginBottom: '20px'}}>Organized On: <b>28th of oct, 2021</b></div>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <div className={classes.num}>
                                        12
                                    </div>
                                    <div className={classes.numDetail}>
                                        People Attended
                                    </div>
                                    <div style={{width: '20px'}}></div>
                                    <div className={classes.num}>
                                        20
                                    </div>
                                    <div className={classes.numDetail}>
                                        Trees Planted
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <div style={{position: 'relative'}}>
                                    <img className={classes.item2} src={item2} alt="item1" />
                                    <img className={classes.headerimg} src={headerimg} alt="header logo"/>
                                    <img className={classes.item1} src={item1} alt="item2" />
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
                <img style={{width: '100%', height: '50px'}} src={vector1} alt="vector1"/>
                <div className={classes.general}>
                    <div className={classes.msgTitle}>
                        Some message about the event from 14trees
                    </div>
                    <div className={classes.imageC}>
                        <Carousel hasMediaButton={false} hasIndexBoard={false} images={images}/>
                    </div>
                    <div className={classes.msg}>
                    We are honoured to plant trees in memory of her. Here the letter will come. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque placerat risus neque, non lobortis felis gravida vel. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque vitae bibendum metus. Integer rutrum sed tellus et luctus. Suspendisse vel lobortis augue. Ut sed dolor a ipsum mollis dictum. Nullam vestibulum dolor sed ultrices auctor. Nullam at tempor enim. Praesent ornare vel nulla eu bibendum. Cras ante ex, dignissim eu laoreet rutrum, imperdiet quis urna.
                    Vivamus sed semper ex, id sodales velit. Suspendisse libero augue, cursus in sodales vitae, porta id tellus. Vestibulum porta fermentum sem, eget fringilla nisl pharetra nec. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque placerat risus neque, non lobortis felis gravida vel. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                    </div>
                    <div style={{fontSize: '15px', fontWeight: 'bold', marginTop: '16px', marginLeft: 'auto', marginRight: 'auto', width: '80%'}}>
                    -14 Trees Foundation.
                    </div>
                    <div className={classes.gatinfo}>
                        <div style={{width: '90px', marginLeft: 'auto', marginRight: 'auto'}}>
                            <img src={gatimg} alt="gat" className={classes.gatimg}/>
                        </div>
                        <div className={classes.gatheader}>
                            Site of Plantation : Gat 703
                        </div>
                        <div className={classes.gatdesc}>
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. 
                        </div>
                    </div>
                </div>
                <div style={{height: '900px'}}>
                    <div
                        style={{position: 'relative', top: '-100px' ,height: '400px', background: 'linear-gradient(360deg, rgba(233, 234, 231, 0) 0%, #E5E5E7 58.96%)', zIndex:"-1"}}
                    ></div>
                    <img src="https://14treesplants.s3.ap-south-1.amazonaws.com/gat/gat_703.jpg"
                        style={{top: '-500px', zIndex: '-2', width: '100%', position: 'relative', height: '100%', objectFit: 'cover'}} alt=""/>
                    <div
                        style={{top: '-900px' ,position: 'relative',height: '400px',transform: 'rotate(180deg)', background: 'linear-gradient(360deg, rgba(150, 120, 95, 0) 0%, #1F3625 85.27%)', zIndex: '4', marginBottom: '-550px'}}
                    >
                    </div>
                </div>
                <div className={classes.trees}>
                    <div style={{width: '130px', marginLeft: 'auto', marginRight: 'auto'}}>
                        <img src={treeicon} alt="tree" className={classes.treeicon}/>
                    </div>
                    <div className={classes.treedesc}>
                        The Trees Planted
                    </div>
                    <div style={{width: '80%', marginLeft: 'auto', marginRight: 'auto'}}>
                        <Grid container spacing={3}>
                            {
                                treeList.map((image, idx) => {
                                    return (
                                        <Grid item xs={6} md={3}>
                                            <img src={image} alt="" className={classes.treeimg}/>
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                        {
                            showMore && 
                            (
                                <div style={{padding: '24px', textAlign: 'center'}}>
                                    <Chip label={"See More"} mode={'primary'} size={'large'} handleClick={()=>loadMore()}/>
                                </div>
                            )
                        }
                    </div>
                </div>
                <img src={vector2} alt="" style={{height: '100px',width: '100%'}}/>
                <div className={classes.footer}>
                    <div style={{width: '150px', marginLeft: 'auto', marginRight: 'auto'}}>
                        <img src={footicon} alt="" style={{height: '120px'}}/>
                    </div>
                    <div className={classes.footthanks}>
                        We thank you for your contribution!
                    </div>
                    <div style={{display: 'flex'}}>
                        <img src={footericon} alt="" style={{height: '180px', width: '50%'}}/>
                        <img src={footericon} alt="" style={{height: '180px', width: '50%'}}/>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

const useStyles = makeStyles((theme) =>
    createStyles({
        main:{
            maxHeight: '120px',
            backgroundColor: '#846C5B',
        },
        header: {
            padding: theme.spacing(15),
            backgroundColor: '#846C5B',
            paddingTop: theme.spacing(4),
            minHeight: '100%',
            maxWidth: '100vw',
            marginLeft: "auto",
            marginRight: 'auto',
            [theme.breakpoints.down('480')]: {
                padding: theme.spacing(3),
            },
        },
        item2: {
            position: 'absolute',
            zIndex: '1',
            width: '130px',
            height: '80px',
            left: '-40px'
        },
        item1: {
            position: 'absolute',
            zIndex: '1',
            width: '80px',
            height: '80px',
            left:'90%',
            top: '58vh'
        },
        headerimg:{
            position: 'absolute',
            width: '100%',
            height: '65vh',
            top: '10px',
            objectFit: 'cover',
            [theme.breakpoints.down('480')]: {
                height: '45vh',
            },
        },
        logos: {
            display: 'flex',
        },
        logo: {
            maxWidth: '320px',
            height: '70px',
            padding: theme.spacing(1),
        },
        maintxt: {
            fontSize: '40px',
            lineHeight: '60px',
            color: '#ffffff',
            fontWeight: 'bold',
        },
        detail: {
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '350',
            marginTop: theme.spacing(6),
            display: 'block'
        },
        num:{
            fontSize: '45px',color: '#EDD9A3', fontWeight: '500'
        },
        numDetail: {
            fontSize: '13px', width: '60px', color: '#ffffff', fontWeight: '400', padding: theme.spacing(1)
        },
        general: {
            backgroundColor: '#e5e5e5',
            marginTop: '-30px',
            padding: theme.spacing(15),
            [theme.breakpoints.down('480')]: {
                padding: theme.spacing(3),
            },
        },
        msgTitle: {
            color: '#846C5B',
            fontSize: '45px',
            lineHeight: '60px',
            fontWeight: 'bold',
            width: '50%',
        },
        imageC:{
            marginTop: '40px', height: '75vh', width: '80%', marginLeft: 'auto', marginRight: 'auto'
        },
        msg: {
            fontSize: '16px',
            lineHeight: '24px',
            paddingTop: '40px',
            color: '#54503C',
            fontWeight: '300',
            width: '80%', marginLeft: 'auto', marginRight: 'auto'
        },
        gatinfo:{
            marginTop: '80px',
            width: '100%',
            zIndex: '4',
        },
        gatimg: {
            height: '100px',
            width: '100px'
        },
        gatheader: {
            marginTop: '20px', width: '80%', marginLeft: 'auto', marginRight: 'auto',
            fontSize: '40px', textAlign: 'center', color:'#846C5B', fontWeight: '550'
        },
        gatdesc: {
            fontSize: '16px',
            fontWeight: '300',
            textAlign: 'center',
            color: '#54503C',
            width: '50%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '20px'
        },
        trees:{
            backgroundColor: '#1F3625',
            width: '100%',
            marginTop: '-100px'
        },
        treeicon: {
            height: '120px',
            width: '120px',
            marginTop: '10px'
        },
        treedesc: {
            fontSize: '40px',
            fontWeight: '500',
            textAlign: 'center',
            color: '#ffffff',
            width: '50%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '20px',
            paddingBottom: '50px'
        },
        treeimg: {
            width: '100%',
            maxHeight: '300px',
            objectFit: 'cover',
            borderRadius: '12px'
        },
        footer: {
            backgroundColor: '#e5e5e5',
            marginTop: '-80px',
            paddingTop: '80px'
        },
        footthanks: {
            width: '80%',
            color: '#1F3625',
            fontSize: '24px',
            fontWeight: '24px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
            padding: '24px'
        }
    })
)
import React, { Fragment, useState } from 'react';

import { createStyles, makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Carousel from 'react-gallery-carousel';

import { Appbar } from './Appbar';
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

const images = [5,4,6,7,8,9,10,1,11,12].map((number) => ({
    src: `https://14treesplants.s3.ap-south-1.amazonaws.com/memories/kpit${number}.jpeg`
}));

const treeimages = [
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_07d6effc-6d4a-4480-9d75-e1d29780e894.jpg",name:'Bahava', id: "34048"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_efb3533f-92b6-4219-a7f4-463e49fd2db7.jpg",name:'Bahava', id: "34050"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_fec3b15a-62ab-49ef-8e86-cef80cef02c2.jpg",name:'Bahava', id: "34051"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_ee6f6b8a-126a-4e82-bc8e-906e4aefc3a4.jpg",name:'Bahava', id: "34053"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_712bbd26-de42-4d4d-b580-70f438aa13db.jpg",name:'Bahava', id: "34052"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_d8f1b606-ae21-4de8-8adf-55cd3d23534e.jpg",name:'Bahava', id: "34049"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_0bf4687d-b54b-4c06-9dbb-6c244a85e27b.jpg",name:'Bahava', id: "34055"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_b730a046-a838-4243-a4c5-7ffb4590d165.jpg",name:'Bahava', id: "34056"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_dde63c15-dc36-471f-bda9-a1300189c2c5.jpg",name:'Bahava', id: "34057"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_245135e1-971e-4551-8b84-ffa30d6a038c.jpg",name:'Bahava', id: "34058"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_157c6708-6ba4-4a97-bc70-5f60a88891f5.jpg",name:'Bahava', id: "34054"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_78e638ae-aeda-4380-b14e-a5d0da4e9af5.jpg",name:'Bahava', id: "34063"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_7f433a08-d260-432c-bf60-9cd12db33f18.jpg",name:'Bahava', id: "34065"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_1622ed99-9eb8-48fc-b22a-68bad2470810.jpg",name:'Bahava', id: "34066"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_dfa2714c-45a1-4741-b3cb-9c956ef8c14e.jpg",name:'Bahava', id: "34064"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_0406cd0e-95d6-4edb-a997-13de3e980f36.jpg",name:'Bahava', id: "34059"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_ed35e6b1-c129-43ac-af3b-9ed1f936a3de.jpg",name:'Bahava', id: "34061"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_f9278d0f-af15-454e-b7c4-f9375e6cb826.jpg",name:'Bahava', id: "34060"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_1c9d4a0d-f267-4452-b1da-b49e33c78036.jpg",name:'Bahava', id: "34062"},
    {img:"https://14treesplants.s3.ap-south-1.amazonaws.com/trees/rn_image_picker_lib_temp_24fa5f0a-4aec-4114-acbf-6bde2547368b.jpg",name:'Bahava', id: "34067"},

]

export const Corporate = () => {
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

    const collapse = () => {
        setIndex(8);
        setTreeList(treeimages.slice(0, 8));
        setShowMore(true);
    }

    const classes = useStyles();
    return (
        <Fragment>
            <div className={classes.main}>
                <Appbar />
                <div className={classes.header}>
                    <Box >
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={5}>
                                <div className={classes.logos}>
                                    <img className={classes.logo} src={logos} alt="logo" />
                                </div>
                                <p className={classes.maintxt}>
                                    Celebrating 20 years of reimagining mobility together
                                </p>
                                <Divider style={{background: '#ffffff', width: '85%'}}/>
                                <div className={classes.detail}>
                                    <div style={{marginBottom: '5px'}}>Event name: <b>KPIT-DENSO</b></div>
                                    <div style={{marginBottom: '20px'}}>Organized On: <b>28 October, 2021</b></div>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <div className={classes.num}>
                                        02
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
                                    <img className={classes.headerimg} src="https://14treesplants.s3.ap-south-1.amazonaws.com/events/denso_header-min.png" alt="header logo"/>
                                    <img className={classes.item1} src={item1} alt="item2" />
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
                <img className={classes.topvector} src={vector1} alt="vector1"/>
                <div className={classes.general}>
                    <div className={classes.msgTitle}>
                        KPIT's commitment to Ecology Restoration by planting trees and supporting environment causes
                    </div>
                    <div className={classes.imageC}>
                        <Carousel hasMediaButton={false} hasIndexBoard={false} images={images}/>
                    </div>
                    <div className={classes.msg}>
                    KPIT and DENSO are celebrating 20 years of their partnership on 9th November. KPIT, with its commitment to supporting environmental causes, is partnering with a nature conservation NGO named ‘14 Trees’ to celebrate this important milestone in a unique way.
                    <br />
                    <br />
                    Mr. Sanjivkumar Bajikar DENSO KPIT delivery manager and Mr. Tushar Juvekar head of CSR KPIT planted 20 flowering bahava trees -- one for each year of DENSO-KPIT partnership -- on a barren, ecologically devastated land near village Vetale, near Pune, India.
                    <br/>
                    <br/>
                    The trees planted on KPIT grove will support a larger effort by 14 Trees Foundation to transform barren, ecologically devastated hills of Sahyadri mountain range into thriving biodiverse forests full of native flora and fauna, while creating local livelihoods.
                    <br/>
                    <br/>
                    DENSO-KPIT celebration trees are an example of how urban citizens, village communities, tribal workers and corporates can join hands in taking concrete action towards undoing environmental damage, in creating employment and entrepreneurship and in building a sustainable future for the next generation.
                    </div>
                    <div style={{fontSize: '15px', fontWeight: 'bold', marginTop: '16px', marginLeft: 'auto', marginRight: 'auto', width: '80%'}}>
                    -14 Trees Foundation.
                    </div>
                    <div className={classes.gatinfo}>
                        <div style={{width: '130px', marginLeft: 'auto', marginRight: 'auto'}}>
                            <img src={gatimg} alt="gat" className={classes.gatimg}/>
                        </div>
                        <div className={classes.gatheader}>
                        Site of Plantation: Near Gat 703, Village - Vetale
                        </div>
                        <div className={classes.gatdesc}>
                        KPIT grove is a portion of a very large tract of completely barren land on a hilltop in village Vetale near Pune. Slowly and steadily, a team of 100+ tribal workers is restoring green cover, repairing damaged ecology, creating rainwater storage ponds, digging pits and planting trees.
                        </div>
                    </div>
                </div>
                <div style={{height: '900px'}}>
                    <div
                        style={{position: 'relative', top: '-100px' ,height: '400px', background: 'linear-gradient(360deg, rgba(233, 234, 231, 0) 0%, #E5E5E7 58.96%)', zIndex:"-1"}}
                    ></div>
                    <img src="https://14treesplants.s3.ap-south-1.amazonaws.com/gat/gat_703.jpg"
                        className={classes.plotimg} alt=""/>
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
                    <div className={classes.treeimgcontainer}>
                        <Grid container spacing={3}>
                            {
                                treeList.map((tree, idx) => {
                                    return (
                                        <Grid item xs={6} md={3}>
                                            <img src={tree.img} alt="" className={classes.treeimg}/>
                                            <div style={{padding: '5px', fontWeight:'400', fontSize: '13px', color:'#ffffff'}}>Tree Name: {tree.name}</div>
                                            <div style={{padding: '5px', fontWeight:'400', fontSize: '13px', color:'#ffffff'}}>Tree ID: {tree.id}</div>
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
                        {
                            !showMore &&
                            <div style={{padding: '24px', textAlign: 'center'}}>
                                <Chip label={"See less"} mode={'primary'} size={'large'} handleClick={()=>collapse()}/>
                            </div>
                        }
                    </div>
                </div>
                <img src={vector2} alt="" className={classes.treefootvector}/>
                <div className={classes.footer}>
                    <div style={{width: '150px', marginLeft: 'auto', marginRight: 'auto'}}>
                        <img src={footicon} alt="" style={{height: '120px'}}/>
                    </div>
                    <div className={classes.footthanks}>
                        We thank you for your contribution!
                    </div>
                    <img src={footericon} alt="" className={classes.footericon}/>
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
            height: 'calc(100vh - 200px)',
            maxWidth: '100vw',
            marginLeft: "auto",
            marginRight: 'auto',
            [theme.breakpoints.down('480')]: {
                padding: theme.spacing(3),
                height: 'calc(100vh * 1.3)',
            },
        },
        item2: {
            position: 'absolute',
            zIndex: '1',
            width: '130px',
            height: '80px',
            left: '-40px',
            [theme.breakpoints.down('480')]: {
                width: '100px',
                height: '80px',
                left: '-20px',
            },
        },
        item1: {
            position: 'absolute',
            zIndex: '1',
            width: '80px',
            height: '80px',
            left:'90%',
            top: '58vh',
            [theme.breakpoints.down('480')]: {
                left:'80%',
                top: '35vh'
            },
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
            [theme.breakpoints.up('1480')]: {
                marginTop: '10%'
            },
        },
        logo: {
            maxWidth: '320px',
            height: '60px',
        },
        maintxt: {
            fontSize: '40px',
            lineHeight: '60px',
            color: '#ffffff',
            fontWeight: 'bold',
            [theme.breakpoints.down('480')]: {
                fontSize: '35px',
                lineHeight: '50px',
            },
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
        topvector: {
            width: '100%', height: '50px',
            [theme.breakpoints.down('480')]: {
                height: '15px',
            },
        },
        general: {
            backgroundColor: '#e5e5e5',
            marginTop: '-30px',
            padding: theme.spacing(15),
            [theme.breakpoints.down('480')]: {
                padding: theme.spacing(1),
                marginTop: '-10px',
            },
        },
        msgTitle: {
            color: '#846C5B',
            fontSize: '45px',
            lineHeight: '60px',
            fontWeight: '600',
            width: '70%',
            marginLeft: 'auto', marginRight: 'auto',
            textAlign: 'center',
            [theme.breakpoints.down('480')]: {
                width: '85%',
                fontSize: '30px',
                lineHeight: '40px',
                marginTop: '20px'
            },
        },
        imageC:{
            marginTop: '40px', height: '75vh', width: '80%', marginLeft: 'auto', marginRight: 'auto',
            [theme.breakpoints.down('480')]: {
                width: '100%',
                height: '45vh',
            },
        },
        msg: {
            fontSize: '17px',
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
            [theme.breakpoints.down('480')]: {
                marginTop: '40px',
            },
        },
        plotimg: {
            top: '-500px', zIndex: '-2', width: '100%', position: 'relative', height: '100%', objectFit: 'cover',
            [theme.breakpoints.down('480')]: {
                height: '80%',
            },
        },
        gatimg: {
            height: '120px',
            width: '120px',
        },
        gatheader: {
            marginTop: '20px', width: '80%', marginLeft: 'auto', marginRight: 'auto',
            fontSize: '40px', textAlign: 'center', color:'#846C5B', fontWeight: '600',
            [theme.breakpoints.down('480')]: {
                fontSize: '25px',
                width: '100%',
                marginTop: '5px'
            },
        },
        gatdesc: {
            fontSize: '17px',
            fontWeight: '300',
            textAlign: 'center',
            color: '#54503C',
            width: '50%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '20px',
            [theme.breakpoints.down('480')]: {
                width: '100%',
            },
        },
        trees:{
            backgroundColor: '#1F3625',
            width: '100%',
            marginTop: '-100px',
            [theme.breakpoints.down('480')]: {
                marginTop: '-280px',
            },
        },
        treeicon: {
            height: '120px',
            width: '120px',
            marginTop: '10px',
            [theme.breakpoints.down('480')]: {
                height: '85px',
                width: '85px',
                marginLeft: '20px'
            },
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
            paddingBottom: '50px',
            [theme.breakpoints.down('480')]: {
                fontSize: '25px',
                width: '80%',
            },
        },
        treeimgcontainer: {
            width: '80%', marginLeft: 'auto', marginRight: 'auto',
            [theme.breakpoints.down('480')]: {
                width: '90%',
            },
        },
        treeimg: {
            width: '100%',
            maxHeight: '300px',
            objectFit: 'cover',
            borderRadius: '5px',
            [theme.breakpoints.down('480')]: {
                maxHeight: '180px',
            },
        },
        treefootvector: {
            height: '100px',width: '100%',
            [theme.breakpoints.down('480')]: {
                height: '50px'
            },
        },
        footer: {
            backgroundColor: '#e5e5e5',
            marginTop: '-80px',
            paddingTop: '80px',
            [theme.breakpoints.down('480')]: {
                marginTop: '-50px',
            },
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
        },
        footericon: {
            height: '400px', width: '100%', objectFit:'cover',
            [theme.breakpoints.down('480')]: {
                height: 'auto',
            },
        },
    })
)
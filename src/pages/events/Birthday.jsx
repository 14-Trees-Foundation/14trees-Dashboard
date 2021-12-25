import React, { Fragment, useState } from 'react';

import { createStyles, makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
import Carousel from 'react-gallery-carousel';

import bdayItem1 from '../../assets/bdayItem1.png';
import logo_white_small from '../../assets/logo_white_small.png';
import bdayItem2 from '../../assets/bdayItem2.png';
import bdayItem3 from '../../assets/bdayItem3.png';
import bdayFooter from '../../assets/bdayFooter.png';
import gatimg from '../../assets/gaticon.png';
import bdayTreeIcon from '../../assets/bdayTreeIcon.png';
import bdayfootIcon from "../../assets/bdayfootIcon.png";
import bdayFooterIcon from "../../assets/bdayFooterIcon.png";
import 'react-gallery-carousel/dist/index.css';

import { Divider } from '@mui/material';
import { Chip } from '../../stories/Chip/Chip'

const images = [5,4,6].map((number) => ({
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

export const Birthday = () => {
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
                <div className={classes.header}>
                    <Box >
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={5}>
                            <div className={classes.logos}>
                                    <img className={classes.logo} src={logo_white_small} alt="logo" />
                                </div>
                                <p className={classes.maintxt}>
                                A thicket of 10 trees has been <br /> planted in the name of <br /> Mr Sanjeev Rathava on the <br /> occassion of his birthday.
                                </p>
                                <div className={classes.detail}>
                                    <div style={{marginBottom: '5px', marginLeft:'-30px'}}>Donated by: Mr Biswarup Dutta</div>
                                    <div style={{marginBottom: '20px', marginLeft:'-30px'}}>Date: 21st August 2021</div>
                                </div> 
                                
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <div style={{position: 'relative'}}>
                                    <img className={classes.item2} src={bdayItem1} alt="item1" />
                                    <img className={classes.item1} src={bdayItem2} alt="item2" />
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
                <Card className={classes.card}>
                <div className={classes.general}>
                    <div className={classes.msgTitle}>
                        Wishing you a very <br />Happy Birthday!
                    </div>
                    <div className={classes.imageC}>
                        <Carousel hasMediaButton={false} hasIndexBoard={false} images={images}/>
                    </div>
                    <div className={classes.msg}>
                    KPIT and DENSO are celebrating 20 years of their partnership on 9th November. KPIT with it's commitment to environment causes through it's CSR initiatives decided partner with 14 trees NGO to plant 20 trees at the 14 Trees site near Pune. 20 trees were planted one each dedicated to 1 year of DENSO-KPIT partnership. Mr Sanjivkumar Bajikar DENSO KPIT delivery manager and Mr. Tushar Juvekar head of CSR KPIT visited the 14 Trees site to plant the trees.14 Trees is committed to building sustainable, carbon-footprint-neutral eco-systems through re-forestation and has created lush forests from barren lands in over 100 acres in the village Vetale near Pune. 
                    <br />
                    <br />
                    Apart from reforestation on acquired barren land 14 Trees also partners with local village governments, forest department, farmers, schools etc to plant trees on their land increasing awareness to combat the effects of environmental degradation and climate change as well as support projects on habitat restoration, ground water recharging, biodiversity experiments and also provide livelihood for local tribal villagers.
                    </div>
                    <Divider style={{background: '#483924', width: '85%', marginTop:'80px', marginLeft:'auto', marginRight:'auto'}}/>
                    </div>
                    </Card>
                    <div style={{position: 'relative'}}>
                         <img className={classes.item3} src={bdayItem3} alt="item1" />
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
                        <img src={bdayTreeIcon} alt="tree" className={classes.treeicon}/>
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
                                            <div style={{padding: '2px', fontFamily:'Noto Serif JP', textAlign:'center', fontWeight:'400', fontSize: '13px', color:'#664E2D'}}>{tree.name}</div>
                                            <div style={{padding: '2px', fontFamily:'Noto Serif JP', textAlign:'center', fontWeight:'400', fontSize: '13px', color:'#664E2D'}}>Giridhari Lal Ji Sarda</div>
                                            <div style={{padding: '2px', fontFamily:'Noto Serif JP', textAlign:'center', fontWeight:'400', fontSize: '13px', color:'#664E2D'}}>#{tree.id}</div>
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
                <img src={bdayFooter} alt="" className={classes.treefootvector}/>
                <div className={classes.footer}>
                    <div style={{width: '150px', marginLeft: 'auto', marginRight: 'auto'}}>
                        <img src={bdayfootIcon} alt="" style={{height: '120px'}}/>
                    </div>
                    <div className={classes.footthanks}>
                        We thank you for your contribution!
                    </div>
                    <img src={bdayFooterIcon} alt="" className={classes.footericon}/>
                </div>
            </div>
        </Fragment>
    )
}

const useStyles = makeStyles((theme) =>
    createStyles({
        main:{
            maxHeight: '120px',
            backgroundColor: '#664E2D',
        },
        header: {
            padding: theme.spacing(15),
            backgroundColor: '#664E2D',
            paddingTop: theme.spacing(0),
            height: 'calc(100vh - 45px)',
            maxWidth: '100vw',
            marginLeft: "auto",
            marginRight: 'auto',
            [theme.breakpoints.down('480')]: {
                padding: theme.spacing(3),
                height: 'calc(100vh * 1)',
            },
        },
        item1: {
            position: 'absolute',
            zIndex: '0',
            width: '120%',
            height: '150vh',
            left:'1%',
            top: '28vh',
            [theme.breakpoints.down('480')]: {
                width: '100%',
                height: '200px',
                left: '24px',
                top: '17vh'
            },
        },
        item2: {
            position: 'absolute',
            zIndex: '1',
            width: '150%',
            height: '65vh',
            left: '-30%',
            top:'0vh',
            [theme.breakpoints.down('480')]: {
                width: '100%',
                height: '200px',
                left: '24px',
            },
        },
        item3: {
            position: 'absolute',
            zIndex: '-1',
            width: '40%',
            height: '120vh',
            left: '1px',
            top:'-50vh',
            [theme.breakpoints.down('480')]: {
                width: '45%',
                height: '200px',
                left: '25px',
                top:'-10vh',
            },
        },
        logos: {  
            display: 'flex',
            [theme.breakpoints.up('1480')]: {
                marginTop: '10%'
            },
        },
        logo: {
            marginTop:'63px',
            maxWidth: '320px',
            height: '80px',
            marginLeft:'-30px',
            [theme.breakpoints.down('480')]: {
                marginLeft:'-20px',
                marginTop:'10px'
            },
            
        },
        maintxt: {
            fontSize: '35px',
            fontFamily:'Noto Serif JP',
            lineHeight: '40px',
            color: '#ffffff',
            fontWeight: 'normal',
            marginTop:'100px',
            marginLeft:'-30px',
            [theme.breakpoints.down('480')]: {
                fontSize: '25px',
                lineHeight: '40px',
                marginTop:'50px',
                marginLeft:'-20px',
            },
        },
        card:{
            position:'relative',
            marginTop:'120px',
            marginLeft:'130px',
            width:'80%',
            [theme.breakpoints.down('480')]: {
                marginTop:'120px',
                marginLeft:'35px',
                width:'80%',
            },
            
        },
        detail: {
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '350',
            marginTop: theme.spacing(6),
            display: 'block',
            [theme.breakpoints.down('480')]: {
                marginLeft:'10px',
            },
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
            backgroundColor: '#fff',
            marginTop: '-30px',
            padding: theme.spacing(15),
            [theme.breakpoints.down('480')]: {
                padding: theme.spacing(1),
                marginTop: '-10px',
            },
        },
        msgTitle: {
            color: '#483924',
            fontFamily:'Noto Serif JP',
            fontSize: '40px',
            lineHeight: '50px',
            fontWeight: '500',
            width: '70%',
            marginLeft: 'auto', marginRight: 'auto',
            textAlign: 'center',
            [theme.breakpoints.down('480')]: {
                width: '85%',
                fontSize: '25px',
                lineHeight: '40px',
                marginTop: '20px'
            },
        },
        imageC:{
            marginTop: '40px', height: '75vh', width: '100%', marginLeft: 'auto', marginRight: 'auto',
            [theme.breakpoints.down('480')]: {
                width: '100%',
                height: '45vh',
            },
        },
        msg: {
            fontSize: '15px',
            lineHeight: '24px',
            paddingTop: '40px',
            color: '#54503C',
            fontWeight: '300',
            width: '100%', marginLeft: 'auto', marginRight: 'auto'
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
            backgroundColor: '#E5E5E5',
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
            color: '#664E2D',
            width: '50%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '20px',
            paddingBottom: '10px',
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
            marginTop:'-60px',
            height: '100px',width: '100%',
            [theme.breakpoints.down('480')]: {
                height: '30px'
            },
        },
        footer: {
            backgroundColor: '#664E2D',
            marginTop: '-40px',
            paddingTop: '80px',
            [theme.breakpoints.down('480')]: {
                marginTop: '-40px',
            },
        },
        footthanks: {
            width: '80%',
            color: '#ffffff',
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
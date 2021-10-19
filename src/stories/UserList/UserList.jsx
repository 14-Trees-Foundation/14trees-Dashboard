import React from "react";
import { createStyles, makeStyles } from '@mui/styles';
import { useRecoilValue } from 'recoil';
import { searchResults } from '../../store/atoms';

export const UserList = ({ handleClick }) => {
    const searchResult = useRecoilValue(searchResults);
    const classes = UseStyle();
    if(Object.keys(searchResult.users).length !== 0) {
        return (
            <div>
                <div className={classes.header}>
                    <div className={classes.itemlong}>Name</div>
                    <div className={classes.itemlong}>Organization</div>
                    <div className={classes.itemshort}>No. Of Plants</div>
                    <div className={classes.itemshort}>Number of Vsit</div>
                    <div className={classes.itemshort}>Last Vsit</div>
                </div>
                {searchResult.users.map((i) => {
                    return (
                        <div className={classes.box} key={i.id} onClick={() => {handleClick(i.id)}}>
                            <div className={classes.itemlong}>{i.name}</div>
                            <div className={classes.itemlong}>{i.org}</div>
                            <div className={classes.itemshort}>{i.num_plants}</div>
                            <div className={classes.itemshort}>{i.num_visit}</div>
                            <div className={classes.itemshort}>{i.last_visit}</div>
                        </div>
                    )
                })}
            </div>
        )
    } else {
        return <div></div>
    }
};

const UseStyle = makeStyles((theme) =>
    createStyles({
        header: {
            display: 'flex',
            width: '100%',
            height: '15px',
            fontSize: '12px',
            fontWeight: '400',
            color: '#000000',
            margin: '2px',
        },
        itemlong: {
            width: '23%',
            textAlign: 'center',
            alignSelf: 'center',
        },
        itemshort: {
            width: '17%',
            textAlign: 'center',
            alignSelf: 'center',
        },
        box: {
            marginBottom: '10px',
            width: '100%',
            minHeight: '60px',
            borderRadius: '5px',
            backgroundColor: '#ffffff',
            fontSize: '16px',
            fontWeight: '450',
            display: 'flex',
            cursor: 'pointer',
            justifyContent: 'center',
            '&:hover': {
                transform: 'scale(1.01)'
            }
        },
    }),
);

export default UserList;

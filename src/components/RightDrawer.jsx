import { createStyles, makeStyles } from '@mui/styles';
import Divider from '@mui/material/Divider';

import { Impact } from "../stories/Impact/Impact";

export const RightDrawer = () => {
    const classes = useStyles();
    return (
        <div>
            <h3 style={{ marginLeft: '9%' }}>Overall Impact</h3>
            <Divider style={{ margin: '0 9% 2% 9%' }} />
            <div className={classes.infobox}>
                <Impact count={'150+'} text={"People employed from local community"} />
                <Impact count={'190+'} text={"Ponds created to increase water label"} />
            </div>
            <div className={classes.infobox}>
                <Impact size={'large'} count={'28000+'} text={"Trees planted till date"} />
            </div>

        </div>
    )
}


const useStyles = makeStyles((theme) =>
    createStyles({
        infobox: {
            marginLeft: '9%',
            marginRight: '20px',
            display: 'flex'
        },
    }))
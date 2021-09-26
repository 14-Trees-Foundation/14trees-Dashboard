import React from "react";
import PropTypes from "prop-types";

import { createStyles, makeStyles } from '@mui/styles';

export const InfoChip = ({ count, label, ...props }) => {
    const classes = useStyles();
    return (
        <button
            type="button"
            className={classes.infochip}
            {...props}
        >
            <div className={classes.info}>
                <div className={classes.count}>
                    {count}
                </div>
                <div className={classes.label}>
                    {label}
                </div>
            </div>
        </button>
    );
};

InfoChip.propTypes = {
    label: PropTypes.string.isRequired,
};

InfoChip.defaultProps = {
    count: 0,
    label: "Trees Planted",
};


const useStyles = makeStyles((theme) =>
    createStyles({
        infochip: {
            minWidth: '80px',
            minHeight: '40px',
            borderRadius: '10px',
            fontWeight: '300',
            border: '0',
            color: '#ffffff',
            backgroundColor: '#1F3625',
            marginRight: '2%',
            // boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
            cursor: 'pointer',
        },
        info: {
            display: 'flex',
        },
        count: {
            color: '#9BC53D',
            fontSize: '25px',
            marginLeft: '5px',
            marginRight: '3px',
        },
        label: {
            fontSize: '12px',
            textAlign: 'center',
        },
    })
)

export default InfoChip;

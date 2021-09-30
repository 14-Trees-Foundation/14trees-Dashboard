import React from "react";
import PropTypes from "prop-types";
import CancelIcon from '@mui/icons-material/Cancel';
import { createStyles, makeStyles } from '@mui/styles';

export const Popup = ({ toggle, ...props }) => {
  const classes = useStyles();  
  return (
      <div className={classes.main}>
          <div className={classes.window}>
              <div className={classes.close} onClick={toggle}>
                <CancelIcon fontSize={"medium"} />
              </div>
              {props.children}
          </div>
      </div>
    );
  }

Popup.propTypes = {
  toggle: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) =>
  createStyles({
    main: {
      background: 'rgba(110, 121, 113, 0.41)',
      backdropFilter: 'blur(54px)',
      width: '100vw',
      height: '100vh',
      top: '0',
      left: '0',
      position: 'fixed',
      zIndex: '1'
    },
    window: {
      width: '80vw',
        height: '80vh',
        marginLeft: '10vw',
        marginTop: '10vh',
        backgroundColor: '#1F3625',
        borderRadius: '5px',
        position: 'absolute',
    },
    close: {
        float: 'right',
        paddingTop: '5px',
        paddingRight: '5px',
        cursor: 'pointer'
    },
  })
)

export default Popup;

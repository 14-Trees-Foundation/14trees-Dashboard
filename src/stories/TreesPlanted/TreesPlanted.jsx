import React from "react";
import PropTypes from "prop-types";
import { createStyles, makeStyles } from '@mui/styles';

import tree from '../../assets/sample.png';

const footer = (id, name, date) => {
  date = date !== undefined ? date.slice(0, 10) : "";
  name = name !== undefined ? name : "Yet to Plant";
  if (name !== "Yet to Plant") {
    return (
      <div>
        <p className="title">{name}</p>
        <p className="info">
          Sapling ID : {id}
          <br />
          Date : {date}
          <br />
          Event : Independant Visit
        </p>
      </div>
    )
  } else {
    return (
      <div>
        <p className="emptytitle">{name}</p>
      </div>
    )
  }
};
export const TreesPlanted = (props) => {

  const classes = useStyles(props);

  return (
    <div className={classes.main}>
      <img src={props.img} alt={"Tree"} className={classes.img} />
      <div style={{ marginLeft: '15px', marginTop: '10px' }}>
        <div style={{ fontSize: '18px', fontWeight: '700' }}>{props.name}</div>
        <div style={{ fontSize: '15px', fontWeight: '500', marginTop: '10px' }}>Sapling ID : {props.id}</div>
        <div style={{ fontSize: '15px', fontWeight: '500', marginTop: '5px' }}>Date : {props.date}</div>
        <div style={{ fontSize: '15px', fontWeight: '500', marginTop: '5px' }}>Event : {props.event}</div>
      </div>
    </div>
  );
};

TreesPlanted.propTypes = {
  mode: PropTypes.oneOf(["primary", "secondary"]),
  id: PropTypes.string,
  name: PropTypes.string,
  img: PropTypes.string,
  date: PropTypes.string,
  props: PropTypes.bool,
};

TreesPlanted.defaultProps = {
  mode: "secondary",
  img: "",
  event: 'Independent Event',
  selected: false
};

const useStyles = makeStyles({
  main: {
    width: '91%',
    maxHeight: '140px',
    padding: '15px',
    margin: '0 0px 10px 4px',
    borderRadius: '12px',
    display: 'flex',
    backgroundColor: props => props.selected ? '#1f3625' : '#ffffff',
    color: props => props.selected ? '#ffffff' : '#000000',
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.15)'
  },
  selected: {
    color: '#ffffff',
    backgroundColor: '#1F3625'
  },
  img: {
    width: '160px',
    height: '130px',
    objectFit: 'cover',
    borderRadius: '12px'
  }
}
)

export default TreesPlanted;

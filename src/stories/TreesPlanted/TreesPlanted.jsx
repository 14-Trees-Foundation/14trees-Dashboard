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
export const TreesPlanted = ({ mode, id, name, img, date, ...props }) => {

  const classes = useStyles();

  return (
    <div className={classes.main}>
      <img src={img} alt={"Tree"} className={classes.img} />
      <div>

      </div>
    </div>
    // <Card
    //   className={[`box-${mode}`]}
    //   header={header(img)}
    //   {...props}
    // >
    //   {footer(id, name, date)}
    // </Card>
  );
};

TreesPlanted.propTypes = {
  mode: PropTypes.oneOf(["primary", "secondary"]),
  id: PropTypes.string,
  name: PropTypes.string,
  img: PropTypes.string,
  date: PropTypes.string
};

TreesPlanted.defaultProps = {
  mode: "secondary",
  img: ""
};

const useStyles = makeStyles((theme) =>
  createStyles({
    main: {
      width: '91%',
      maxHeight: '150px',
      padding: '15px',
      margin: '0 0px 10px 4px',
      borderRadius: '12px',
      display: 'flex',
      backgroundColor: '#ffffff',
      boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.15)'
    },
    img: {
      width: '160px',
      height: '140px',
      objectFit: 'cover',
      borderRadius: '12px'
    }
  })
)

export default TreesPlanted;

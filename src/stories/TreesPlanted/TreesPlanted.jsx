import React from "react";
import PropTypes from "prop-types";
import { Card } from "primereact/card";
import tree from '../../assets/sample.png';
import "./treesplanted.scss";

const header = (img) => {
  if(img === "") {
     return <img alt="Card" src={tree} className="img"/>
  } else {
    return <img alt="Card" src={img} className="img"/>
  }
};

const footer = (id, name, date) => {
  date = date !== undefined ? date.slice(0,10) : "";
  name = name !== undefined ? name : "Tree Name";
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
};
export const TreesPlanted = ({ mode, id, name, img, date, ...props }) => {

  return (
    <Card
      className={[`box-${mode}`]}
      header={header(img)}
      {...props}
    >
      {footer(id, name, date)}
    </Card>
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

export default TreesPlanted;

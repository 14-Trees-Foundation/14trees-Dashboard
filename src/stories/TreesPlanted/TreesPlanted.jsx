import React from "react";
import PropTypes from "prop-types";
import { Card } from "primereact/card";
import "./treesplanted.scss";

const header = (
  <img alt="Card" src="https://picsum.photos/536/354" className="img"/>
);

const footer = (
  <div>
    <p className="title">Tree Name</p>
    <p className="info">
      Sapling ID : #12890100
      <br />
      Date : 29/04/2021
      <br />
      Event : Independant Visit
    </p>
  </div>
);
export const TreesPlanted = ({ mode, ...props }) => {
  return (
    <Card
      className={[`box-${mode}`]}
      header={header}
      {...props}
    >
      {footer}
    </Card>
  );
};

TreesPlanted.propTypes = {
  mode: PropTypes.oneOf(["primary", "secondary"]),
};

TreesPlanted.defaultProps = {
  mode: "secondary",
};

export default TreesPlanted;

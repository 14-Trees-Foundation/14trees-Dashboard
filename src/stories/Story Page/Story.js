import React from "react";
import PropTypes from "prop-types";
import { Card } from "primereact/card";
import "./Story.scss";

const header = (
  <img alt="Card" src="https://picsum.photos/536/354" className="img" />
);

const footer = (
  <span>
    <p className="txt">Hivar</p>
    <p className="txt2">
      Sapling ID : #12890100
      <br />
      Date : 29/04/2021
      <br />
      Event : Independant Visit
    </p>
  </span>
);
export const Story = ({ mode, ...props }) => {
  return (
    <Card className={[`box--${mode}`]} header={header} {...props}>
      {footer}
    </Card>
  );
};

Story.propTypes = {
  mode: PropTypes.oneOf(["primary", "secondary"]),
};

Story.defaultProps = {
  mode: "secondary",
};

export default Story;

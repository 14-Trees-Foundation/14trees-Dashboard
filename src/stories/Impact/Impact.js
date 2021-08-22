import React from "react";
import { Card } from "primereact/card";
import "./Impact.scss";

const header = (text) => (
  <h1 className="header-text">
    {text}
  </h1>
);

const footer = (text) => (
  <p className="footer-text">
    {text}
  </p>
);

export const Impact = ({ mainText, footText, ...props }) => {
  return (
    <Card
      className={[`box`]}
      header={header(`${mainText}`)}
      footer={footer(`${footText}`)}
      {...props}
    ></Card>
  );
};

Impact.defaultProps = {
  mainText: "190",
  footText: "Some text to be shown as footer"
};
export default Impact;

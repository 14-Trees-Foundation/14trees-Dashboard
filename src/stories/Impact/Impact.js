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

export const Impact = ({ count, text, ...props }) => {
  return (
    <Card
      className={[`box`]}
      header={header(`${count}`)}
      footer={footer(`${text}`)}
      {...props}
    ></Card>
  );
};

Impact.defaultProps = {
  count: "190",
  text: "14 Trees"
};
export default Impact;

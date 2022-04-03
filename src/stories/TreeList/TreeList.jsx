import React from "react";
import "./treelist.scss";

export const TreeList = ({ data, ...props }) => {
  return (
    <div>
      <div className="tl-header">
        <div className="tl-item-long">Name</div>
        <div className="tl-item-long">Tree Name</div>
        <div className="tl-item-short">Sapling ID</div>
        <div className="tl-item-short">Gut ID</div>
        <div className="tl-item-short">Plantation Date</div>
      </div>
      {data.map((i) => {
        return (
          <div className="tl-box" key={i.id}>
            <div className="tl-item-long">{i.name}</div>
            <div className="tl-item-long">{i.tree_name}</div>
            <div className="tl-item-short">{i.sapling_id}</div>
            <div className="tl-item-short">{i.gut_id}</div>
            <div className="tl-item-short">{i.planted_on}</div>
          </div>
        );
      })}
    </div>
  );
};

TreeList.defaultProps = {
  data: [
    {
      name: "Ajay Singh",
      tree_name: "Neem",
      sapling_id: 5,
      gut_id: 3,
      planted_on: "2021-08-21",
    },
    {
      name: "Ajay Madan",
      tree_name: "Mango",
      sapling_id: 2,
      gut_id: 6,
      planted_on: "2021-03-21",
    },
  ],
};

export default TreeList;

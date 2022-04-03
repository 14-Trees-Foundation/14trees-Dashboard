import React from "react";
import "./orglist.scss";

export const OrgList = ({ data, ...props }) => {
  return (
    <div>
      <div className="ol-header">
        <div className="ol-name-header">Name</div>
        <div className="ol-image"></div>
        <div className="ol-item-short">No. Of Plants</div>
        <div className="ol-item-short">No. of Events</div>
      </div>
      {data.map((i) => {
        return (
          <div className="ol-box" key={i.id}>
            <img src={i.img} alt="" className="ol-image" />
            <div className="ol-name">{i.name}</div>
            <div className="ol-item-short">{i.num_plants}</div>
            <div className="ol-item-short">{i.num_events}</div>
          </div>
        );
      })}
    </div>
  );
};

OrgList.defaultProps = {
  data: [
    {
      name: "Tata Consultancy Service",
      img: "https://picsum.photos/212/354",
      num_plants: 5,
      num_events: 3,
    },
    {
      name: "Arista Networks",
      img: "https://picsum.photos/516/354",
      num_plants: 2,
      num_events: 4,
    },
    {
      name: "Google LLC",
      img: "https://picsum.photos/516/67",
      num_plants: 2,
      num_events: 4,
    },
    {
      name: "Mojo Networks",
      img: "https://picsum.photos/345/354",
      num_plants: 2,
      num_events: 4,
    },
  ],
};

export default OrgList;

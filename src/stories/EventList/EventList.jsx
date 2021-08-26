import React from "react";
import PropTypes from "prop-types";
import { Card } from "primereact/card";
import "./eventlist.scss";

export const EventList = ({ data, ...props }) => {
    return (
        <div>
            <div className="el-header">
                <div className="el-name-header">Name</div>
                <div className="el-image"></div>
                <div className="el-item-short">No. Of Plants</div>
                <div className="el-item-short">Date</div>
            </div>
            {data.map((i) => {
                return (
                    <div className="el-box" key={i.id}>
                        <img src={i.img} alt="" className="el-image"/>
                        <div className="el-name">
                            <div className="el-name-h">{i.event_name}</div>
                            <div className="el-name-i">
                                <div className="el-name-o">Organized by:</div>
                                <div className="el-name-ii">
                                    {i.name}
                                </div>
                            </div>
                        </div>
                        <div className="el-item-short">{i.num_plants}</div>
                        <div className="el-item-short">{i.date}</div>
                    </div>
                )
            })}
        </div>
    )
};

EventList.defaultProps = {
    data: [
        {
            name: 'Sanjeev Rathava',
            event_name: '60th Birthday Anniversary',
            img: "https://picsum.photos/222/354",
            num_plants: 5,
            date: "21-05-2021",
        },
        {
            name: 'Vasudev Gohil',
            img: "https://picsum.photos/596/354",
            num_plants: 2,
            event_name: 'Independence Day',
            date: "29-05-2021",
        }
    ]
};

export default EventList;

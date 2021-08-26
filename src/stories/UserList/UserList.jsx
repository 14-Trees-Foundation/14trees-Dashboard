import React from "react";
import PropTypes from "prop-types";
import { Card } from "primereact/card";
import "./userlist.scss";

export const UserList = ({ data, handleClick, ...props }) => {
    return (
        <div>
            <div className="ul-header">
                <div className="ul-item-long">Name</div>
                <div className="ul-item-long">Organization</div>
                <div className="ul-item-short">No. Of Plants</div>
                <div className="ul-item-short">No. of Visits</div>
                <div className="ul-item-short">Last Vsit</div>
            </div>
            {data.map((i) => {
                return (
                    <div className="ul-box" key={i.id} onClick={() => {handleClick(i.id)}}>
                        <div className="ul-item-long">{i.name}</div>
                        <div className="ul-item-long">{i.org}</div>
                        <div className="ul-item-short">{i.num_plants}</div>
                        <div className="ul-item-short">{i.num_visits}</div>
                        <div className="ul-item-short">{i.last_visit}</div>
                    </div>
                )
            })}
        </div>
    )
};

UserList.defaultProps = {
    data: [
        {
            id: 1,
            name: 'Ajay Singh',
            org: 'TCS Tata consultancy services',
            num_plants: 5,
            num_visits: 3,
            last_visit: '2021-08-21'
        },
        {
            id: 2,
            name: 'Ajay Madan',
            org: 'VmWare',
            num_plants: 2,
            num_visits: 3,
            last_visit: '2021-08-23'
        },
        {
            id: 3,
            name: 'Ajay Nagar',
            org: 'IIT Kapur',
            num_plants: 6,
            num_visits: 4,
            last_visit: '2021-07-21'
        },
        {
            id: 4,
            name: 'Ajay Singh',
            org: 'TCS Tata consultancy services',
            num_plants: 5,
            num_visits: 3,
            last_visit: '2021-08-21'
        },
        {
            id: 5,
            name: 'Ajay Madan',
            org: 'VmWare',
            num_plants: 2,
            num_visits: 3,
            last_visit: '2021-08-23'
        },
        {
            id: 6,
            name: 'Ajay Nagar',
            org: 'IIT Kapur',
            num_plants: 6,
            num_visits: 4,
            last_visit: '2021-07-21'
        },
        {
            id: 7,
            name: 'Ajay Singh',
            org: 'TCS Tata consultancy services',
            num_plants: 5,
            num_visits: 3,
            last_visit: '2021-08-21'
        },
        {
            id: 8,
            name: 'Ajay Madan',
            org: 'VmWare',
            num_plants: 2,
            num_visits: 3,
            last_visit: '2021-08-23'
        },
        {
            id: 9,
            name: 'Ajay Nagar',
            org: 'IIT Kapur',
            num_plants: 6,
            num_visits: 4,
            last_visit: '2021-07-21'
        },
        {
            id: 10,
            name: 'Ajay Singh',
            org: 'TCS Tata consultancy services',
            num_plants: 5,
            num_visits: 3,
            last_visit: '2021-08-21'
        }
    ]
};

export default UserList;

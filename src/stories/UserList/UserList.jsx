import React from "react";
import PropTypes from "prop-types";
import { Card } from "primereact/card";
import "./userlist.scss";

export const UserList = ({ data, ...props }) => {
    return (
        <div>
            <div className="ul-header">
                <div className="ul-space">Name</div>
                <div className="ul-space">Organization</div>
                <div className="ul-space">No. Of Plants</div>
                <div className="ul-space">No. of Visits</div>
                <div className="ul-space">Last Vsit</div>
            </div>
            {data.map((i) => {
                return (
                    <div className="ul-box" key={i.id}>
                        <div className="ul-space">{i.name}</div>
                        <div className="ul-space">{i.org}</div>
                        <div className="ul-space">{i.num_plants}</div>
                        <div className="ul-space">{i.num_visits}</div>
                        <div className="ul-space">{i.last_visit}</div>
                    </div>
                )
            })}
        </div>
    )
};

UserList.defaultProps = {
    data: [
        {
            name: 'Ajay Singh',
            org: 'TCS Tata consultancy services',
            num_plants: 5,
            num_visits: 3,
            last_visit: '2021-08-21'
        },
        {
            name: 'Ajay Madan',
            org: 'VmWare',
            num_plants: 2,
            num_visits: 3,
            last_visit: '2021-08-23'
        },
        {
            name: 'Ajay Nagar',
            org: 'IIT Kapur',
            num_plants: 6,
            num_visits: 4,
            last_visit: '2021-07-21'
        },
        {
            name: 'Ajay Singh',
            org: 'TCS Tata consultancy services',
            num_plants: 5,
            num_visits: 3,
            last_visit: '2021-08-21'
        },
        {
            name: 'Ajay Madan',
            org: 'VmWare',
            num_plants: 2,
            num_visits: 3,
            last_visit: '2021-08-23'
        },
        {
            name: 'Ajay Nagar',
            org: 'IIT Kapur',
            num_plants: 6,
            num_visits: 4,
            last_visit: '2021-07-21'
        },
        {
            name: 'Ajay Singh',
            org: 'TCS Tata consultancy services',
            num_plants: 5,
            num_visits: 3,
            last_visit: '2021-08-21'
        },
        {
            name: 'Ajay Madan',
            org: 'VmWare',
            num_plants: 2,
            num_visits: 3,
            last_visit: '2021-08-23'
        },
        {
            name: 'Ajay Nagar',
            org: 'IIT Kapur',
            num_plants: 6,
            num_visits: 4,
            last_visit: '2021-07-21'
        },
        {
            name: 'Ajay Singh',
            org: 'TCS Tata consultancy services',
            num_plants: 5,
            num_visits: 3,
            last_visit: '2021-08-21'
        }
    ]
};

export default UserList;

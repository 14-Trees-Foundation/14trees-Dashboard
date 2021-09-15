import React from "react";
import PropTypes from "prop-types";
import gif from '../../assets/loader_light.gif';
import "./spinner.scss";

export const Spinner = ({text}) => {
  return (
        <div className="spinner">
            <img className="img" src={gif} alt="Loader"/>
            <p className="s-text">{text}</p>
        </div>
  );
};

Spinner.defaultProps = {
  text: 'This forest is dense, taking some time to reach your destination!'
};

export default Spinner;

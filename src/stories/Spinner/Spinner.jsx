import React from "react";
import PropTypes from "prop-types";
import gif from '../../assets/loader_light.gif';
import "./spinner.scss";

export const Spinner = () => {
  return (
        <div className="spinner">
            <img className="img" src={gif} alt="Loader"/>
            <p className="s-text">This forest is dense, taking some time to reach your Tree!</p>
        </div>
  );
};

export default Spinner;

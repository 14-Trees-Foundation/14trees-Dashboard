import React from "react";
import PropTypes from "prop-types";
import { InputText } from 'primereact/inputtext';

import Button from '@mui/material/Button';

import "./searchbar.scss";

/**
 * Primary UI component for user interaction
 */
export const SearchBar = ({ value, onClick, onSubmit, ...props }) => {
  return(
      <div className="sb-box">
        <InputText
            placeholder="Search by Name/Event/Organization"
            value={value}
            onChange={(e)=>onClick(e.target.value)}
            className="input"/>
            <div className="sb-button-div">
                <Button variant="contained" color="primary" className="sb-button" onClick={onSubmit}>
                    Submit
                </Button>
            </div>
      </div>
  )
};

SearchBar.propTypes = {
    value: PropTypes.string,
    onClick: PropTypes.func,
    onSubmit: PropTypes.func,
};

SearchBar.defaultProps = {
};

export default SearchBar;

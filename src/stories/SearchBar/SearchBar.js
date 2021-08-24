import React from "react";
import PropTypes from "prop-types";
import { InputText } from 'primereact/inputtext';
import { Button } from "../Button/Button";
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
        <Button
            primary={true}
            size={'large'}
            className="sb-button"
            label={"Submit"}
            onClick={onSubmit}/>
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

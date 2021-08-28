import React from "react";
import PropTypes from "prop-types";
import 'primeicons/primeicons.css';
import "./popup.scss";

export const Popup = ({ display, toggle, ...props }) => {
  if (display) {
    return (
      <div className="modal-bg">
          <div className="modal-window">
              <div className="modal-close" onClick={toggle}>
                  <i class="pi pi-times-circle" style={{"color":"#e5e5e5"}}></i>
              </div>
              {props.children}
          </div>
      </div>
    );
  } else {
    return null;
  }
};

Popup.propTypes = {
  toggle: PropTypes.func.isRequired,
};

export default Popup;

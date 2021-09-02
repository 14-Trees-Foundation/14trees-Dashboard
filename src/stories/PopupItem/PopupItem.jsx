import React from "react";
import PropTypes from "prop-types";
import "./popupitem.scss";
import "primeflex/primeflex.css";
import { Divider } from "primereact/divider";
import ponds from "../../../src/assets/ponds.png";

export const PopupItem = ({ img, title, header, ...props }) => {
  return (
    <div className="p-item">
      <div className="p-grid nested-grid">
        <div className="p-col-12 p-md-7 p-lg-7" style={{ padding: 0 }}>
          <img src={ponds} alt="ponds" className="p-modal-img" />
        </div>
        <div className="p-col-12 p-md-5 p-lg-5 p-modal-desc">
          <div className="p-header">Restoring the Water Table</div>
          <div className="p-desc">
            Some description of the pond. Some description of the pond. Some
            description of the pond.
          </div>
          <div className="p-box p-grid">
            <div className="p-col-6 p-box-left">
              <div className="p-box-count">190 Ponds</div>
              <div className="p-box-desc">
                Some description Some Description
              </div>
            </div>

            <div
              //   style={{ fontSize: "15px", marginTop: "2%" }}
              className="p-col-6 p-box--desc"
            >
              That is enough to water 15 farm lands
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupItem;

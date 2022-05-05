import React from "react";
import "../../../styles/CalenderDayDiscuss/index.css";
import icon from "../../../styles/photos/beer.jpg";

const index = ({ textData }) => {
  return (
    <>
      <div className="discussDetail">
        <img src={icon} alt="" />
        <span className="discussName">Jena：</span>
        <span className="discussSaying">{textData}</span>
      </div>
    </>
  );
};

export default index;

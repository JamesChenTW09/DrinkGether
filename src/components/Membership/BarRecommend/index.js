import React from "react";

import "../../styles/Membership/index.css";

const Index = ({ recommendBar, myKey }) => {
  return (
    <>
      <div>
        <input name={myKey} type="checkbox" />
        <h4>{recommendBar.barName}</h4>
        <p>{recommendBar.barRceommendText}</p>
      </div>
    </>
  );
};

export default Index;

import React from "react";

const Day = ({ item }) => {
  const click2 = () => {
    console.log("click2");
  };
  return (
    <>
      <p onClick={click2}>{item["name"]}</p>
    </>
  );
};

export default Day;

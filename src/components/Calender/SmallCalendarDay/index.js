import React from "react";
import dayjs from "dayjs";

const Day = ({ day }) => {
  function checkCurrentDay() {
    return dayjs().format("DD-MM-YY") === day.format("DD-MM-YY")
      ? {
          color: "white",
          cursor: "pointer",
        }
      : { color: "black", cursor: "pointer" };
  }

  return (
    <>
      <p id={day.format("YYYY-MM-DD")} style={checkCurrentDay()}>
        {day.format("DD")}
      </p>
    </>
  );
};

export default Day;

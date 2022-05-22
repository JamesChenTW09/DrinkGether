import React from "react";
import dayjs from "dayjs";

const Day = ({ day }) => {
  function checkCurrentDay() {
    return dayjs().format("DD-MM-YY") === day.format("DD-MM-YY")
      ? {
          color: "#3e5969",
          backgroundColor: "rgb(250,250,209)",
          fontWeight: "bolder",
        }
      : {};
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

import React from "react";
import dayjs from "dayjs";
import "../../../styles/Calendar/CalendarMain/index.css";
import { v4 as uuidv4 } from "uuid";

const Day = ({
  day,
  list,
  moreList,
  setShowAllEventsBox,
  scaleAnimation,
  showAllEventsBox,
  setKeepDay,
}) => {
  function checkCurrentDay() {
    return dayjs().format("DD-MM-YY") === day.format("DD-MM-YY")
      ? {
          color: "blue",
          cursor: "pointer",
        }
      : { color: "black", cursor: "pointer" };
  }
  const handleShowAllEvents = (e) => {
    if (scaleAnimation) {
      return;
    }
    e.stopPropagation();
    setKeepDay(e.target.id);
    setShowAllEventsBox(!showAllEventsBox);
  };

  return (
    <>
      <p style={checkCurrentDay()}>{day.format("DD")}</p>
      <div>
        {list.map((item) => {
          return item.eventDate === day.format("YYYY-MM-DD") ? (
            <div
              onMouseDown={(e) => handleShowAllEvents(e)}
              key={uuidv4()}
              className="eventListDetail"
              id={item.eventDate}
            >
              {item.eventPlace + " " + item.eventTime}
            </div>
          ) : (
            ""
          );
        })}
        {moreList.map((item) => {
          return item.eventDate === day.format("YYYY-MM-DD") ? (
            <div
              onClick={(e) => handleShowAllEvents(e)}
              key={uuidv4()}
              className="eventListDetail"
              id={item.eventDate}
            >
              {item.eventPlace + " " + item.eventTime}
            </div>
          ) : (
            ""
          );
        })}
      </div>
    </>
  );
};

export default Day;

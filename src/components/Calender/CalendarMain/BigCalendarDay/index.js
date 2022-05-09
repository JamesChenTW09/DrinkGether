import React from "react";
import dayjs from "dayjs";
import "../../../styles/Calendar/CalendarMain/index.css";
import { v4 as uuidv4 } from "uuid";

const Day = ({
  day,
  bigDateEventList,
  setShowAllEventsBox,
  showStartEventBox,
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
    if (showStartEventBox) {
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
        {bigDateEventList.map((item) => {
          const { eventDate, eventPlace } = item;
          return eventDate === day.format("YYYY-MM-DD") ? (
            <div
              onMouseDown={(e) => handleShowAllEvents(e)}
              key={uuidv4()}
              className="eventListDetail"
              id={eventDate}
            >
              {eventPlace}
            </div>
          ) : (
            ""
          );
        })}
        {/* {moreList.map((item) => {
          const { eventDate, eventPlace } = item;
          return eventDate === day.format("YYYY-MM-DD") ? (
            <div
              onClick={(e) => handleShowAllEvents(e)}
              key={uuidv4()}
              className="eventListDetail"
              id={eventDate}
            >
              {eventPlace}
            </div>
          ) : (
            ""
          );
        })} */}
      </div>
    </>
  );
};

export default Day;

import React from "react";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { reserveClickDate } from "../../../../redux_toolkit/slice/eventList";
import { showAllEventsBox } from "../../../../redux_toolkit/slice/boolean";
import "../../../styles/Calendar/CalendarMain/index.css";

const Day = ({ day }) => {
  const { allEventsBox, startEventBox } = useSelector((state) => state.boolean);
  const { calendarEventList } = useSelector((state) => state.eventList);
  const dispatch = useDispatch();
  function checkCurrentDay() {
    return dayjs().format("DD-MM-YY") === day.format("DD-MM-YY")
      ? {
          color: "blue",
          cursor: "pointer",
        }
      : { color: "black", cursor: "pointer" };
  }
  const handleShowAllDailyEvents = (e) => {
    if (startEventBox || allEventsBox) {
      return;
    }
    e.stopPropagation();
    dispatch(reserveClickDate(e.target.id));
    if (!allEventsBox) {
      dispatch(showAllEventsBox());
    }
  };

  return (
    <>
      <p style={checkCurrentDay()}>{day.format("DD")}</p>
      <div className="eventListDetailBox">
        {calendarEventList.map((item) => {
          const { eventDate, eventPlace } = item;
          return eventDate === day.format("YYYY-MM-DD") ? (
            <div
              onMouseDown={(e) => handleShowAllDailyEvents(e)}
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
      </div>
    </>
  );
};

export default Day;

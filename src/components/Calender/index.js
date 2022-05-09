import React, { useState } from "react";
import CalendarFeatures from "./CalendarFeatures";
import CalendarHeader from "./CalendarHeader";
import CalendarMain from "./CalendarMain";
import dayjs from "dayjs";
import "../styles/Calendar/index.css";

const Index = () => {
  const [bigDateBox, setBigDateBox] = useState(getMonth());
  const [smallDateBox, setSmallDateBox] = useState(getMonth());
  const [showAllEventsBox, setShowAllEventsBox] = useState(false);
  const [bigNowMonth, setBigNowMonth] = useState(dayjs().month());
  const [smallNowMonth, setSmallNowMonth] = useState(dayjs().month());
  const [bigDateEventList, setBigDateEventList] = useState([]);
  const [showStartEventBox, setShowStartEventBox] = useState(0);
  const [allEventList, setAllEventList] = useState([]);

  const [eventInputValue, setEventInputValue] = useState({
    eventPlace: "",
    eventDate: "",
    eventTime: "",
    eventMaxPal: "",
    eventDescription: "",
  });
  //

  function getMonth(month = dayjs().month()) {
    const year = dayjs().year();
    const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
    let currentMonthCount = 0 - firstDayOfTheMonth;
    const daysMatrix = new Array(5).fill([]).map(() => {
      return new Array(7).fill(null).map(() => {
        currentMonthCount++;
        return dayjs(new Date(year, month, currentMonthCount));
      });
    });
    return daysMatrix;
  }
  return (
    <>
      <CalendarHeader
        setSmallDateBox={setSmallDateBox}
        getMonth={getMonth}
        setSmallNowMonth={setSmallNowMonth}
        setBigDateBox={setBigDateBox}
        bigNowMonth={bigNowMonth}
        setBigNowMonth={setBigNowMonth}
      />

      <section className="calendarMainArea">
        <CalendarFeatures
          smallDateBox={smallDateBox}
          getMonth={getMonth}
          smallNowMonth={smallNowMonth}
          setSmallNowMonth={setSmallNowMonth}
          setBigDateBox={setBigDateBox}
          setBigNowMonth={setBigNowMonth}
          eventInputValue={eventInputValue}
          setEventInputValue={setEventInputValue}
          showStartEventBox={showStartEventBox}
          setShowStartEventBox={setShowStartEventBox}
          bigDateEventList={bigDateEventList}
          setBigDateEventList={setBigDateEventList}
          showAllEventsBox={showAllEventsBox}
          allEventList={allEventList}
          setAllEventList={setAllEventList}
        />

        <CalendarMain
          showAllEventsBox={showAllEventsBox}
          setShowAllEventsBox={setShowAllEventsBox}
          showStartEventBox={showStartEventBox}
          setShowStartEventBox={setShowStartEventBox}
          smallNowMonth={smallNowMonth}
          bigDateBox={bigDateBox}
          eventInputValue={eventInputValue}
          setEventInputValue={setEventInputValue}
          bigDateEventList={bigDateEventList}
          setBigDateEventList={setBigDateEventList}
          allEventList={allEventList}
          setAllEventList={setAllEventList}
        />
      </section>
    </>
  );
};

export default Index;

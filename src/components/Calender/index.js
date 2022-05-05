import React, { useState } from "react";
import CalendarFeatures from "./CalendarFeatures";
import CalendarHeader from "./CalendarHeader";
import CalendarMain from "./CalendarMain";
import dayjs from "dayjs";
import "../styles/Calendar/index.css";

const Index = () => {
  //test

  const [currentMonth2, setCurrentMonth2] = useState(getMonth());
  const [showAllEventsBox, setShowAllEventsBox] = useState(false);
  const [list, setList] = useState([]);
  const [scaleAnimation, setScaleAnimation] = useState(0);
  const [nowMonth, setNowMonth] = useState(dayjs().month());
  const [eventInputValue, setEventInputValue] = useState({
    eventPlace: "",
    eventDate: "",
    eventTime: "",
    eventMaxPal: "",
    eventDescription: "",
  });
  //
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const [countNum, setCountNum] = useState(dayjs().month());

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
        setCurrentMonth={setCurrentMonth}
        getMonth={getMonth}
        setCountNum={setCountNum}
        currentMonth2={currentMonth2}
        setCurrentMonth2={setCurrentMonth2}
        nowMonth={nowMonth}
        setNowMonth={setNowMonth}
      />
      <section className="calendarMainArea">
        <CalendarFeatures
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          getMonth={getMonth}
          countNum={countNum}
          setCountNum={setCountNum}
          setCurrentMonth2={setCurrentMonth2}
          setNowMonth={setNowMonth}
          eventInputValue={eventInputValue}
          setEventInputValue={setEventInputValue}
          scaleAnimation={scaleAnimation}
          setScaleAnimation={setScaleAnimation}
          list={list}
          setList={setList}
          showAllEventsBox={showAllEventsBox}
        />
        <CalendarMain
          showAllEventsBox={showAllEventsBox}
          setShowAllEventsBox={setShowAllEventsBox}
          scaleAnimation={scaleAnimation}
          countNum={countNum}
          currentMonth2={currentMonth2}
          eventInputValue={eventInputValue}
          setEventInputValue={setEventInputValue}
          setScaleAnimation={setScaleAnimation}
          list={list}
          setList={setList}
        />
      </section>
    </>
  );
};

export default Index;

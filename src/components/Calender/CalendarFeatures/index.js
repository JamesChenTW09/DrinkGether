import React, { useState, useEffect } from "react";
import SmallCalendarDay from "../SmallCalendarDay";
import LaunchEvent from "./LaunchEvent";
import dayjs from "dayjs";

import "../../styles/Calendar/CalendarFeatures/index.css";
const Index = ({
  showAllEventsBox,
  currentMonth,
  setCurrentMonth,
  getMonth,
  countNum,
  setCountNum,
  setCurrentMonth2,
  setNowMonth,
  eventInputValue,
  setEventInputValue,
  scaleAnimation,
  setScaleAnimation,
  list,
  setList,
}) => {
  useEffect(() => {
    setCurrentMonth(getMonth(countNum));
  }, [countNum, getMonth, setCurrentMonth]);
  const handleRight = () => {
    setCountNum((pre) => pre + 1);
  };
  const handleLeft = () => {
    setCountNum((pre) => pre - 1);
  };

  //change from month or day ui
  const [monthOrDay, setMonthOrDay] = useState(true);
  const handleChangeMonthDay = () => {
    setMonthOrDay(!monthOrDay);
  };

  //handle launch a new event
  const handleLaunchEvent = () => {
    if (showAllEventsBox) {
      return;
    }
    setScaleAnimation(1);
  };
  //change big calendar same month with small calendar
  const handleChangeBigCalendar = (e) => {
    setCurrentMonth2(getMonth(countNum));
    setNowMonth(countNum);
  };

  return (
    <>
      <LaunchEvent
        list={list}
        setList={setList}
        setScaleAnimation={setScaleAnimation}
        scaleAnimation={scaleAnimation}
        eventInputValue={eventInputValue}
        setEventInputValue={setEventInputValue}
      />
      <section className="calendarFeatures">
        <div onClick={handleLaunchEvent} className="launchEventBtn">
          發起活動
        </div>
        <div className="changeMonthDayBtn">
          <p onClick={handleChangeMonthDay}>＜</p>
          <h3>{monthOrDay ? "月" : "日"}</h3>
          <p onClick={handleChangeMonthDay}>＞</p>
        </div>
        <div className="smallCalendarDay">
          <div className="smallCalendarSelect">
            <p onClick={handleLeft}>＜</p>
            <h4>
              {dayjs(new Date(dayjs().year(), countNum)).format("MMM YYYY")}
            </h4>
            <p onClick={handleRight}>＞</p>
          </div>

          <ul>
            <li>日</li>
            <li>一</li>
            <li>二</li>
            <li>三</li>
            <li>四</li>
            <li>五</li>
            <li>六</li>
          </ul>
        </div>

        <div className="smallCalendar">
          {currentMonth.map((row, i) => {
            return (
              <div className="rowMap" key={i}>
                {row.map((day, idx) => (
                  <div
                    onClick={handleChangeBigCalendar}
                    className="dayMap"
                    id={day.format("DD-MM-YY")}
                    key={idx}
                    style={
                      dayjs().format("DD-MM-YY") === day.format("DD-MM-YY")
                        ? { backgroundColor: "green", borderRadius: "50%" }
                        : { backgroundColor: "rgb(252, 252, 209)" }
                    }
                  >
                    <SmallCalendarDay day={day} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Index;

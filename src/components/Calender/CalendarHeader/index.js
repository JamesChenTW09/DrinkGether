import React, { useEffect } from "react";
import dayjs from "dayjs";
import "../../styles/Calendar/CalendarHeader/index.css";

const Index = ({
  setCurrentMonth,
  setCountNum,
  getMonth,
  currentMonth2,
  setCurrentMonth2,
  nowMonth,
  setNowMonth,
}) => {
  const handleBackToToday = () => {
    setCurrentMonth(getMonth());
    setCountNum(dayjs().month());
    setCurrentMonth2(getMonth());
    setNowMonth(dayjs().month());
  };

  useEffect(() => {
    setCurrentMonth2(getMonth(nowMonth));
  }, [nowMonth, getMonth, setCurrentMonth2]);
  const right = () => {
    setNowMonth((pre) => pre + 1);
  };
  const left = () => {
    setNowMonth((pre) => pre - 1);
  };
  return (
    <div>
      <div className="calendarHeader">
        <h2>DrinkGether</h2>
        <div className="calendarMonthChange">
          <p onClick={left}>＜</p>
          <h3>
            {dayjs(new Date(dayjs().year(), nowMonth)).format("MMM YYYY")}
          </h3>
          <p onClick={right}>＞</p>
          <button onClick={handleBackToToday}>Today</button>
        </div>
      </div>
    </div>
  );
};

export default Index;

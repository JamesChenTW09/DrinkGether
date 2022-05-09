import React from "react";
import dayjs from "dayjs";
import "../../styles/Calendar/CalendarHeader/index.css";

const Index = ({
  setSmallDateBox,
  setSmallNowMonth,
  getMonth,
  setBigDateBox,
  bigNowMonth,
  setBigNowMonth,
}) => {
  const handleBackToToday = () => {
    setSmallDateBox(getMonth());
    setBigDateBox(getMonth());
    setSmallNowMonth(dayjs().month());
    setBigNowMonth(dayjs().month());
  };

  // useEffect(() => {
  //   setCurrentMonth2(getMonth(nowMonth));
  // }, [nowMonth, getMonth, setCurrentMonth2]);
  const handleAddOneMonth = () => {
    setBigNowMonth((pre) => pre + 1);
  };
  const handleMinusOneMonth = () => {
    setBigNowMonth((pre) => pre - 1);
  };
  return (
    <div>
      <div className="calendarHeader">
        <h2>DrinkGether</h2>
        <div className="calendarMonthChange">
          <p onClick={handleMinusOneMonth}>＜</p>
          <h3>
            {dayjs(new Date(dayjs().year(), bigNowMonth)).format("MMM YYYY")}
          </h3>
          <p onClick={handleAddOneMonth}>＞</p>
          <button onClick={handleBackToToday}>Today</button>
        </div>
      </div>
    </div>
  );
};

export default Index;

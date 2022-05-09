import React from "react";
import SmallCalendarDay from "../SmallCalendarDay";
import LaunchEvent from "./LaunchEvent";
import dayjs from "dayjs";

import "../../styles/Calendar/CalendarFeatures/index.css";
const Index = ({
  showAllEventsBox,
  smallDateBox,
  getMonth,
  smallNowMonth,
  setSmallNowMonth,
  setBigDateBox,
  setBigNowMonth,
  eventInputValue,
  setEventInputValue,
  showStartEventBox,
  setShowStartEventBox,
  bigDateEventList,
  setBigDateEventList,
  allEventList,
  setAllEventList,
}) => {
  // useEffect(() => {
  //   setSmallDateBox(getMonth(smallNowMonth));
  // }, [smallNowMonth, getMonth, setSmallDateBox]);
  const handleAddOneMonth = () => {
    setSmallNowMonth((pre) => pre + 1);
  };
  const handleMinusOneMonth = () => {
    setSmallNowMonth((pre) => pre - 1);
  };

  //handle launch a new event
  const handleLaunchEvent = () => {
    if (showAllEventsBox) {
      return;
    }
    setShowStartEventBox(1);
  };
  //change big calendar same month with small calendar
  const handleChangeBigCalendar = (e) => {
    setBigDateBox(getMonth(smallNowMonth));
    setBigNowMonth(smallNowMonth);
  };

  return (
    <>
      <LaunchEvent
        bigDateEventList={bigDateEventList}
        setBigDateEventList={setBigDateEventList}
        showStartEventBox={showStartEventBox}
        setShowStartEventBox={setShowStartEventBox}
        eventInputValue={eventInputValue}
        setEventInputValue={setEventInputValue}
        allEventList={allEventList}
        setAllEventList={setAllEventList}
      />
      <section className="calendarFeatures">
        <div onClick={handleLaunchEvent} className="launchEventBtn">
          發起活動
        </div>
        <div className="smallCalendarDay">
          <div className="smallCalendarSelect">
            <p onClick={handleMinusOneMonth}>＜</p>
            <h4>
              {dayjs(new Date(dayjs().year(), smallNowMonth)).format(
                "MMM YYYY"
              )}
            </h4>
            <p onClick={handleAddOneMonth}>＞</p>
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
          {smallDateBox.map((row, i) => {
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

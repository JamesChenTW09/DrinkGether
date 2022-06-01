import React from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { showStartEventBox } from "../../../redux_toolkit/slice/boolean";
import SmallCalendarDay from "../SmallCalendarDay";
import LaunchEvent from "./LaunchEvent";
import "../../../styles/Calendar/CalendarFeatures/index.css";
const Index = ({
  setSmallDateBox,
  smallDateBox,
  getMonth,
  smallNowMonth,
  setSmallNowMonth,
  setBigDateBox,
  setBigNowMonth,
  scrollRef,
}) => {
  const { allEventsBox } = useSelector((state) => state.boolean);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //handle event list
  const handleAddOneMonth = () => {
    setSmallNowMonth((pre) => pre + 1);
    setSmallDateBox(getMonth(smallNowMonth + 1));
  };
  const handleMinusOneMonth = () => {
    setSmallNowMonth((pre) => pre - 1);
    setSmallDateBox(getMonth(smallNowMonth - 1));
  };
  const handleShowNewEventBox = () => {
    if (allEventsBox) {
      return;
    }
    dispatch(showStartEventBox());
  };
  const handleBackToMainPage = () => {
    navigate("/");
    setTimeout(() => {
      scrollRef.current["main"].scrollIntoView();
    });
  };
  //change big calendar same month with small calendar
  const handleChangeBigCalendar = () => {
    setBigDateBox(getMonth(smallNowMonth));
    setBigNowMonth(smallNowMonth);
  };

  return (
    <>
      <LaunchEvent />
      <section className="calendarFeatures">
        <div onClick={handleShowNewEventBox} className="launchEventBtn">
          Start
        </div>
        <div onClick={handleBackToMainPage} className="launchEventBtn">
          Back to Main
        </div>
        <div className="smallCalendarHeader">
          <div className="smallCalendarMonth">
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

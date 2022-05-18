import React from "react";
import SmallCalendarDay from "../SmallCalendarDay";
import LaunchEvent from "./LaunchEvent";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import { showStartEventBox } from "../../../redux_toolkit/slice/boolean";
import "../../styles/Calendar/CalendarFeatures/index.css";
const Index = ({
  setSmallDateBox,
  smallDateBox,
  getMonth,
  smallNowMonth,
  setSmallNowMonth,
  setBigDateBox,
  setBigNowMonth,
}) => {
  const { allEventsBox } = useSelector((state) => state.boolean);
  const dispatch = useDispatch();

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
  //change big calendar same month with small calendar
  const handleChangeBigCalendar = (e) => {
    setBigDateBox(getMonth(smallNowMonth));
    setBigNowMonth(smallNowMonth);
  };

  return (
    <>
      <LaunchEvent />
      <section className="calendarFeatures">
        <div onClick={handleShowNewEventBox} className="launchEventBtn">
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

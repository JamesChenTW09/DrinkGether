import React, { useEffect, useState } from "react";
import BigCalendarDay from "./BigCalendarDay";
import AllEventsList from "./AllEventsList";
import dayjs from "dayjs";
import { onValue, ref } from "firebase/database";
import { showAllEventItemArr } from "../../../utils/utilities";
import { db } from "../../../firebase";
import "../../styles/Calendar/CalendarMain/index.css";

const Index = ({
  bigDateBox,
  showStartEventBox,
  setShowStartEventBox,
  eventInputValue,
  setEventInputValue,
  bigDateEventList,
  setBigDateEventList,
  showAllEventsBox,
  setShowAllEventsBox,
  allEventList,
  setAllEventList,
}) => {
  const [keepDay, setKeepDay] = useState("");

  // const [moreList, setMoreList] = useState([]);
  const handleDayClickShowEvent = (day) => {
    if (showAllEventsBox) {
      return;
    } else if (day.format("YYYY-MM-DD") < dayjs().format("YYYY-MM-DD")) {
      return;
    }
    setEventInputValue({
      ...eventInputValue,
      eventDate: day.format("YYYY-MM-DD"),
    });
    setShowStartEventBox(1);
  };

  useEffect(() => {
    const starCountRef = ref(db, "event/");
    onValue(starCountRef, (snapshot) => {
      const whichDayList = Object.keys(snapshot.val());
      const idList = whichDayList.map((item) => {
        return Object.keys(snapshot.val()[item]);
      });

      //keep all fetch list and send to AllEventList Component
      const newIdList = idList.flat(Infinity);

      const totalEventList = showAllEventItemArr(
        snapshot.val(),
        newIdList,
        whichDayList
      );

      setAllEventList(totalEventList);

      //separate event >= 3 or < 3
      const lessThreeEvents = idList.filter((item) => {
        return item.length <= 2;
      });
      const overThreeEvents = idList.filter((item) => {
        return item.length > 2;
      });
      const allLessThreeEvents = lessThreeEvents.flat(Infinity);
      const allOverThreeEvents = overThreeEvents.flat(Infinity);

      const allLessItemList = showAllEventItemArr(
        snapshot.val(),
        allLessThreeEvents,
        whichDayList
      );
      let allOverItemList = showAllEventItemArr(
        snapshot.val(),
        allOverThreeEvents,
        whichDayList
      );

      let result = {};
      allOverItemList = allOverItemList.map((item) => {
        if (item["eventDate"] in result) {
          result[item["eventDate"]]++;
        } else {
          result[item["eventDate"]] = 1;
        }
        if (result[item["eventDate"]] === 3) {
          return {
            eventPlace: "還有......",
            eventTime: "",
            eventDate: item["eventDate"],
          };
        } else if (result[item["eventDate"]] > 3) {
          item["eventDate"]++;
        } else {
          return item;
        }
        return result;
      });

      const finalEventArr = [...allOverItemList, ...allLessItemList];
      setBigDateEventList(finalEventArr);
    });
  }, [setBigDateEventList, setAllEventList]);

  return (
    <>
      <AllEventsList
        bigDateEventList={bigDateEventList}
        keepDay={keepDay}
        allEventList={allEventList}
        showAllEventsBox={showAllEventsBox}
        setShowAllEventsBox={setShowAllEventsBox}
        setBigDateEventList={setBigDateEventList}
      />
      <div className="calendarMain">
        <ul>
          <li>日</li>
          <li>一</li>
          <li>二</li>
          <li>三</li>
          <li>四</li>
          <li>五</li>
          <li>六</li>
        </ul>
        {bigDateBox.map((row, i) => {
          return (
            <div className="bigRowMap" key={i}>
              {row.map((day, idx) => (
                <div
                  onClick={() => handleDayClickShowEvent(day)}
                  className="bigDayMap"
                  key={idx}
                >
                  <BigCalendarDay
                    showStartEventBox={showStartEventBox}
                    setKeepDay={setKeepDay}
                    setShowAllEventsBox={setShowAllEventsBox}
                    showAllEventsBox={showAllEventsBox}
                    bigDateEventList={bigDateEventList}
                    day={day}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Index;

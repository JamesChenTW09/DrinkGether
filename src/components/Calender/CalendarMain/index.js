import React, { useEffect, useState } from "react";
import BigCalendarDay from "./BigCalendarDay";
import AllEventsList from "./AllEventsList";
import { ref, getDatabase, onValue } from "firebase/database";
import "../../styles/Calendar/CalendarMain/index.css";

const Index = ({
  currentMonth2,
  scaleAnimation,
  eventInputValue,
  setEventInputValue,
  setScaleAnimation,
  list,
  setList,
  showAllEventsBox,
  setShowAllEventsBox,
}) => {
  const [keepDay, setKeepDay] = useState("");
  const [testList, setTestList] = useState([]);
  const [moreList, setMoreList] = useState([]);
  const handleDayClickShowEvent = (day) => {
    if (showAllEventsBox) {
      return;
    }
    setEventInputValue({
      ...eventInputValue,
      eventDate: day.format("YYYY-MM-DD"),
    });
    setScaleAnimation(1);
  };

  useEffect(() => {
    const db = getDatabase();
    const starCountRef = ref(db, "event/");
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const whichDayList = Object.keys(snapshot.val());
        const idList = whichDayList.map((item) => {
          return Object.keys(snapshot.val()[item]);
        });
        const flattern = (arr) => {
          let result = [];
          arr.forEach((item) => {
            if (!item) {
              return;
            }
            Array.isArray(item)
              ? (result = result.concat(flattern(item)))
              : result.push(item);
          });
          return result;
        };

        //testing
        const newIdList = idList.flat(Infinity);
        const trytry = newIdList.map((item) => {
          return whichDayList.map((item2) => {
            return snapshot.val()[item2][item];
          });
        });
        const finalTry = flattern(trytry);
        setTestList(finalTry);

        //
        const lessTwoEvents = idList.filter((item) => {
          return item.length <= 2;
        });
        const overTwoEvents = idList.filter((item) => {
          return item.length > 2;
        });
        const le = lessTwoEvents.flat(Infinity);
        const mo = overTwoEvents.flat(Infinity);

        const less = le.map((item) => {
          return whichDayList.map((item2) => {
            return snapshot.val()[item2][item];
          });
        });
        const more = mo.map((item) => {
          return whichDayList.map((item2) => {
            return snapshot.val()[item2][item];
          });
        });

        const finalLess = flattern(less);
        const finalMore = flattern(more);

        let result = {};
        const trying = finalMore.map((item) => {
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
        const finalResult = trying.filter((item) => {
          return item !== undefined;
        });

        setMoreList(finalResult);
        setList(finalLess);
      }
    });
  }, [setList]);

  return (
    <>
      <AllEventsList
        keepDay={keepDay}
        testList={testList}
        showAllEventsBox={showAllEventsBox}
        setShowAllEventsBox={setShowAllEventsBox}
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
        {currentMonth2.map((row, i) => {
          return (
            <div className="bigRowMap" key={i}>
              {row.map((day, idx) => (
                <div
                  onClick={() => handleDayClickShowEvent(day)}
                  className="bigDayMap"
                  key={idx}
                >
                  <BigCalendarDay
                    scaleAnimation={scaleAnimation}
                    setKeepDay={setKeepDay}
                    setShowAllEventsBox={setShowAllEventsBox}
                    showAllEventsBox={showAllEventsBox}
                    moreList={moreList}
                    list={list}
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

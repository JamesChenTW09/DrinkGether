import React, { useEffect } from "react";
import BigCalendarDay from "./BigCalendarDay";
import AllEventsList from "./AllEventsList";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import { onValue, ref } from "firebase/database";
import { showAllEventItemArr } from "../../../utils/utilities";
import { db } from "../../../firebase";
import { showStartEventBox } from "../../../redux_toolkit/slice/boolean";
import { storeEventInput } from "../../../redux_toolkit/slice/startEvent";
import { setInitialAllEventList } from "../../../redux_toolkit/slice/eventList";
import "../../styles/Calendar/CalendarMain/index.css";

const Index = ({ bigDateBox }) => {
  const { allEventsBox } = useSelector((state) => state.boolean);
  const dispatch = useDispatch();

  const handleShowStartEventBox = (day) => {
    if (allEventsBox) {
      return;
    } else if (day.format("YYYY-MM-DD") < dayjs().format("YYYY-MM-DD")) {
      return;
    }
    dispatch(storeEventInput({ eventDate: day.format("YYYY-MM-DD") }));
    dispatch(showStartEventBox());
  };

  useEffect(() => {
    const starCountRef = ref(db, "event/");
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
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
        //store every event to present on daily box
        dispatch(setInitialAllEventList(totalEventList));

        //separate event >= 3 or < 3
        // const lessThreeEvents = idList.filter((item) => {
        //   return item.length <= 2;
        // });
        // const overThreeEvents = idList.filter((item) => {
        //   return item.length > 2;
        // });
        // const allLessThreeEvents = lessThreeEvents.flat(Infinity);
        // const allOverThreeEvents = overThreeEvents.flat(Infinity);

        // const allLessItemList = showAllEventItemArr(
        //   snapshot.val(),
        //   allLessThreeEvents,
        //   whichDayList
        // );
        // let allOverItemList = showAllEventItemArr(
        //   snapshot.val(),
        //   allOverThreeEvents,
        //   whichDayList
        // );

        // let result = {};
        // allOverItemList = allOverItemList.map((item) => {
        //   if (item["eventDate"] in result) {
        //     result[item["eventDate"]]++;
        //   } else {
        //     result[item["eventDate"]] = 1;
        //   }
        //   if (result[item["eventDate"]] === 3) {
        //     return {
        //       eventPlace: "還有......",
        //       eventTime: "",
        //       eventDate: item["eventDate"],
        //     };
        //   } else if (result[item["eventDate"]] > 3) {
        //     item["eventDate"]++;
        //   } else {
        //     return item;
        //   }
        //   return result;
        // });

        // //store event only for present on calendar, not all events
        // const finalEventArr = [...allOverItemList, ...allLessItemList];
        // dispatch(setInitialCalendarEventList(finalEventArr));
      } else {
        return;
      }
    });
  }, [dispatch]);

  return (
    <>
      <AllEventsList />
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
                  onClick={() => handleShowStartEventBox(day)}
                  className="bigDayMap"
                  key={idx}
                >
                  <BigCalendarDay day={day} />
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

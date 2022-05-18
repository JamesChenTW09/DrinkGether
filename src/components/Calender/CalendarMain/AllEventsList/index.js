import React, { useEffect } from "react";
import EventDetail from "./EventDetail";
import { dbRef } from "../../../../firebase";
import { child, get } from "firebase/database";
import { dailyEventSort } from "../../../../utils/utilities";
import { useSelector, useDispatch } from "react-redux";
import {
  showEventDetailBox,
  notShowEventDetailBox,
} from "../../../../redux_toolkit/slice/boolean";
import {
  storeEventDetail,
  setInitialDailyEventList,
  setInitialDiscussList,
} from "../../../../redux_toolkit/slice/eventList";
import "../../../styles/Calendar/AllEvensList/index.css";

const Index = () => {
  const { allEventsBox, eventDetailBox } = useSelector(
    (state) => state.boolean
  );
  const { allEventList, dailyEventList, clickDate } = useSelector(
    (state) => state.eventList
  );
  const dispatch = useDispatch();

  //handle event list
  const handleSendDetailData = (e, item) => {
    dispatch(storeEventDetail(item));
    if (eventDetailBox) {
      dispatch(notShowEventDetailBox());
    } else {
      dispatch(showEventDetailBox());
    }
    loadDiscussItems(item);
  };

  // fetch initial data
  useEffect(() => {
    //destruct allEventList to daily event by the time
    if (allEventList && clickDate) {
      const dailyEventListArr = dailyEventSort(allEventList, clickDate);
      dispatch(setInitialDailyEventList(dailyEventListArr));
    }
  }, [allEventList, clickDate, dispatch]);

  //send data to eventDeatil
  const loadDiscussItems = (eventItem) => {
    get(child(dbRef, "discuss/" + eventItem["eventId"])).then((snapshot) => {
      if (snapshot.exists()) {
        const discussListId = Object.keys(snapshot.val());
        const discussListItem = discussListId.map((item) => {
          return snapshot.val()[item];
        });
        let discussTimeArr = discussListItem.map((item) => {
          return item["discussTime"];
        });
        discussTimeArr = discussTimeArr.sort();
        let finalDiscussArr = [];
        for (let i = 0; i < discussListItem.length; i++) {
          for (let j = 0; j < discussTimeArr.length; j++) {
            if (discussTimeArr[i] === discussListItem[j]["discussTime"]) {
              finalDiscussArr.push(discussListItem[j]);
              break;
            }
          }
        }
        dispatch(setInitialDiscussList(finalDiscussArr));
      }
    });
  };

  return (
    <div
      className="allEventsBox"
      style={
        allEventsBox ? { transform: "scale(1)" } : { transform: "scale(0)" }
      }
    >
      <div className="eventDetailTitle">{clickDate}</div>
      <EventDetail />

      {dailyEventList.map((item) => {
        return (
          <div
            key={item["eventId"]}
            className="allEventDetail"
            onClick={(e) => handleSendDetailData(e, item)}
            style={eventDetailBox ? { display: "none" } : { display: "flex" }}
          >
            <h4>{item["eventPlace"]}</h4>
            <p>{item["eventTime"]}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Index;

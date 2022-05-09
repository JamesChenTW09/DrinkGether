import React, { useEffect, useState } from "react";
import EventDetail from "./EventDetail";
import { dbRef, auth } from "../../../../firebase";
import { dailyEventSort } from "../../../../utils/utilities";
import { child, get } from "firebase/database";
import "../../../styles/Calendar/AllEvensList/index.css";

const Index = ({
  showAllEventsBox,
  allEventList,
  keepDay,
  setShowAllEventsBox,
  setBigDateEventList,
  bigDateEventList,
}) => {
  const [dailyEventList, setDailyEventList] = useState([]);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [discussList, setDiscussList] = useState([]);
  const [eventDetail, setEventDetail] = useState({});

  //handle event list
  const handleSendDetailData = (e, item) => {
    setEventDetail(item);
    setShowEventDetail(!showEventDetail);
    loadDiscussItems(item);
    console.log(item);
    console.log(auth.currentUser);
  };

  // fetch initial data
  useEffect(() => {
    //destruct allEventList to daily event by the time
    if (allEventList && keepDay) {
      const dailyEventListArr = dailyEventSort(allEventList, keepDay);
      setDailyEventList(dailyEventListArr);
    }
  }, [allEventList, keepDay]);

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
        setDiscussList(finalDiscussArr);
      }
    });
  };

  return (
    <div
      className="allEventsBox"
      style={
        showAllEventsBox ? { transform: "scale(1)" } : { transform: "scale(0)" }
      }
    >
      <div className="eventDetailTitle">{keepDay}</div>
      <EventDetail
        dailyEventList={dailyEventList}
        setShowAllEventsBox={setShowAllEventsBox}
        showEventDetail={showEventDetail}
        setShowEventDetail={setShowEventDetail}
        eventDetail={eventDetail}
        showAllEventsBox={showAllEventsBox}
        discussList={discussList}
        setDiscussList={setDiscussList}
        setBigDateEventList={setBigDateEventList}
        setDailyEventList={setDailyEventList}
      />

      {dailyEventList.map((item) => {
        return (
          <div
            className="allEventDetail"
            onClick={(e) => handleSendDetailData(e, item)}
            style={showEventDetail ? { display: "none" } : { display: "flex" }}
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

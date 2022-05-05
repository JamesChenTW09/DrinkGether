import React, { useEffect, useState } from "react";
import EventDetail from "./EventDetail";
import { ref, getDatabase, child, get } from "firebase/database";
import "../../../styles/Calendar/AllEvensList/index.css";

const Index = ({
  showAllEventsBox,
  testList,
  keepDay,
  setShowAllEventsBox,
}) => {
  const [eventList, setEventList] = useState([]);
  const [showEventDetail, setShowEventDetail] = useState(false);
  useEffect(() => {
    //organize by the time
    function test() {
      if (testList && keepDay) {
        let dayArr;
        let timeArr;
        let finalArr = [];
        dayArr = testList.filter((item) => {
          return item["eventDate"] === keepDay;
        });
        timeArr = dayArr.map((item) => {
          return item["eventTime"];
        });
        timeArr = timeArr.sort();
        for (let i = 0; i < timeArr.length; i++) {
          for (let j = 0; j < dayArr.length; j++) {
            if (timeArr[i] === dayArr[j]["eventTime"]) {
              finalArr.push(dayArr[j]);
              dayArr.splice(j, 1);
              break;
            }
          }
        }
        setEventList(finalArr);
      }
    }
    if (testList && keepDay) {
      test();
    }
  }, [testList, keepDay]);

  //send data to eventDeatil
  const loadDiscussItems = (eventItem) => {
    const dbRef = ref(getDatabase());
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
  const [discussList, setDiscussList] = useState([]);
  const [eventDetail, setEventDetail] = useState({});
  const handleSendDetailData = (e, item) => {
    setEventDetail(item);
    setShowEventDetail(!showEventDetail);
    loadDiscussItems(item);
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
        eventList={eventList}
        setShowAllEventsBox={setShowAllEventsBox}
        showEventDetail={showEventDetail}
        setShowEventDetail={setShowEventDetail}
        eventDetail={eventDetail}
        showAllEventsBox={showAllEventsBox}
        discussList={discussList}
        setDiscussList={setDiscussList}
      />

      {eventList.map((item) => {
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

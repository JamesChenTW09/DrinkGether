import React, { useCallback, useEffect, useState } from "react";
import { ref, update, remove, get, child, onValue } from "firebase/database";
import DiscussBox from "./DiscussBox";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import {
  fetchData,
  auth,
  writeNewParticipant,
  writeNewNotification,
  writeMemberJoinEvent,
  db,
  dbRef,
  deleteMemberEventData,
  sendNotificationMessage,
} from "../../../../../firebase.js";
import "../../../../styles/Calendar/EventDetail/index.css";

const Index = ({
  eventDetail,
  showEventDetail,
  setShowEventDetail,
  setShowAllEventsBox,
  dailyEventList,
  discussList,
  setDiscussList,
  setDailyEventList,
  setBigDateEventList,
}) => {
  let {
    eventDate,
    eventId,
    userId,
    eventPlace,
    eventMaxPal,
    eventCurrentPal,
    eventParticipants,
    eventTime,
  } = eventDetail;

  //handle event list
  const handleBackToEventList = () => {
    setShowEventDetail(!showEventDetail);
    setShowDiscussArea((preState) => (preState = false));
    setDiscussList([]);
  };
  //delete event
  const handleDeleteEvent = () => {
    const { displayName } = auth.currentUser;
    const deleteRoute =
      "event/" + eventDate + "/" + eventId + "/eventParticipants/";
    fetchData(deleteRoute).then((data) => {
      deleteMemberEventData(data, eventDetail);

      const message = `您在${eventDetail["eventDate"]}所參加的${eventDetail["eventPlace"]}活動，已被刪除`;
      sendNotificationMessage(eventDetail, data, uuidv4(), message);
    });
    remove(ref(db, "event/" + eventDate + "/" + eventId));
    remove(ref(db, "user/" + displayName + "/info/holdEvents/" + eventId));
    if (dailyEventList.length === 1) {
      setShowAllEventsBox((preState) => (preState = false));
    }
    setBigDateEventList((preState) =>
      preState.filter((item) => {
        return item["eventId"] !== eventId;
      })
    );
    setDailyEventList((preState) =>
      preState.filter((item) => {
        return item["eventId"] !== eventId;
      })
    );
    setDiscussList([]);

    setShowEventDetail((preState) => (preState = false));
    setShowDiscussArea((preState) => (preState = false));
  };
  //cancel join event
  const handleCancelJoin = () => {
    const { displayName } = auth.currentUser;
    remove(
      ref(
        db,
        "event/" +
          eventDate +
          "/" +
          eventId +
          "/eventParticipants/" +
          displayName
      )
    );
    let currentAttendant = Number(eventDetail["eventCurrentPal"]);
    currentAttendant -= 1;
    update(ref(db, "event/" + eventDate + "/" + eventId), {
      eventCurrentPal: currentAttendant,
    });
    remove(ref(db, "user/" + displayName + "/info/joinEvents/" + eventId));
    update(ref(db, "user/" + userId + "/info/holdEvents/" + eventId), {
      memberEventCurrentPal: currentAttendant,
    });

    get(
      child(dbRef, "event/" + eventDate + "/" + eventId + "/eventParticipants/")
    ).then((snapshot) => {
      let participantsList = Object.keys(snapshot.val());

      participantsList = participantsList.filter((item) => {
        return item !== userId && item !== displayName;
      });
      participantsList.forEach((item) => {
        update(ref(db, "user/" + item + "/info/joinEvents/" + eventId), {
          memberEventCurrentPal: currentAttendant,
        });
      });

      const message = `您在${eventDate}所參加的${eventPlace}活動，${displayName}取消參加`;
      sendNotificationMessage(eventDetail, snapshot.val(), uuidv4(), message);
    });
    eventDetail["eventCurrentPal"] = currentAttendant;
    setShowEventDetail((preState) => !preState);
  };
  //one more attendent
  const handleAddOneAttend = () => {
    const { displayName } = auth.currentUser;
    const participantsIdList = Object.keys(eventParticipants);
    if (!auth.currentUser) {
      alert("log in first");
      return;
    } else if (displayName === userId) {
      alert("youre holder");
      return;
    } else if (participantsIdList.includes(displayName)) {
      alert("join already");
      return;
    }
    let maxAttendant = Number(eventMaxPal);
    let currentAttendant = Number(eventCurrentPal);
    if (maxAttendant === currentAttendant) {
      alert("full");
      return;
    } else {
      currentAttendant += 1;
      update(ref(db, "event/" + eventDate + "/" + eventId), {
        eventCurrentPal: currentAttendant,
      });
      writeNewParticipant(eventDate, eventId, "eventParticipants", displayName);

      eventCurrentPal = currentAttendant;
      writeMemberJoinEvent(
        auth.currentUser.displayName,
        eventId,
        eventPlace,
        eventDate,
        eventTime,
        currentAttendant,
        eventMaxPal,
        userId
      );
      get(
        child(
          dbRef,
          "event/" + eventDate + "/" + eventId + "/eventParticipants/"
        )
      ).then((snapshot) => {
        let participantsList = Object.keys(snapshot.val());
        let participantWithoutJoin = participantsList.filter((item) => {
          return item !== displayName;
        });
        participantsList = participantsList.filter((item) => {
          return item !== userId;
        });
        participantsList.forEach((item) => {
          update(ref(db, "user/" + item + "/info/joinEvents/" + eventId), {
            memberEventCurrentPal: currentAttendant,
          });
        });
        const message = `您在${eventDate}所參加的${eventPlace}活動，${displayName}加入活動`;
        participantWithoutJoin.forEach((item) => {
          writeNewNotification(
            item,
            uuidv4(),
            message,
            eventDate + "." + eventTime,
            dayjs().format("YYYY-MM-DD.HH:mm:ss"),
            eventId
          );
        });
      });
      update(ref(db, "user/" + userId + "/info/holdEvents/" + eventId), {
        memberEventCurrentPal: currentAttendant,
      });

      setShowEventDetail((preState) => !preState);
    }
  };

  // cross effect
  const handleEventDetailCross = () => {
    setShowAllEventsBox((preState) => !preState);
    setTimeout(() => {
      setDiscussList([]);
      setShowDiscussArea((preState) => (preState = false));
      setShowEventDetail((preState) => (preState = false));
    }, 400);
  };

  //set delete button
  const deleteBtnShow = useCallback(() => {
    if (auth.currentUser) {
      if (auth.currentUser.displayName === userId) {
        return "inline";
      } else {
        return "none";
      }
    } else {
      return "none";
    }
  }, [userId]);
  useEffect(() => {
    deleteBtnShow();
  }, [deleteBtnShow, eventDetail]);

  //handle show discuss area
  const [showDiscussArea, setShowDiscussArea] = useState(false);
  const handleShowDiscussArea = () => {
    setShowDiscussArea(!showDiscussArea);
  };

  return (
    <>
      <div onClick={handleEventDetailCross} className="EventDetailCross">
        Ｘ
      </div>
      <div
        style={showEventDetail ? { display: "block" } : { display: "none" }}
        className="eventDetail"
      >
        <div className="detailBar">
          <h4>酒吧名稱：</h4>
          <p>{eventDetail["eventPlace"]}</p>
        </div>
        <div className="detailBar">
          <h4>時間：</h4>
          <p>{eventDetail["eventTime"]}</p>
        </div>
        <div className="detailBar">
          <h4>目前人數：</h4>
          <p>
            {eventDetail["eventCurrentPal"]} / {eventDetail["eventMaxPal"]}
            <span>
              {eventDetail["eventParticipants"] && auth.currentUser
                ? Object.keys(eventDetail["eventParticipants"]).includes(
                    auth.currentUser.displayName
                  )
                  ? "已加入"
                  : ""
                : ""}
            </span>
          </p>
        </div>
        <div className="detailBar">
          <h4>活動描述：</h4>
          <p>{eventDetail["eventDescription"]}</p>
        </div>
        <div className="detailBtn">
          {eventDetail["eventParticipants"] && auth.currentUser ? (
            Object.keys(eventDetail["eventParticipants"]).includes(
              auth.currentUser.displayName
            ) ? (
              <button
                onClick={handleCancelJoin}
                className="eventAttendCancelBtn"
              >
                取消參加
              </button>
            ) : (
              <button
                onClick={handleAddOneAttend}
                className="eventAttendCancelBtn"
              >
                參加
              </button>
            )
          ) : (
            ""
          )}

          <button
            onClick={handleDeleteEvent}
            style={{ display: deleteBtnShow() }}
            className="eventDeleteBtn"
          >
            刪除
          </button>
        </div>
        <p onClick={handleBackToEventList} className="detailBackToList">
          返回上頁
        </p>
        <div className="eventDetailDiscuss">
          <h4 onClick={handleShowDiscussArea}>留言{discussList.length}</h4>{" "}
          <DiscussBox
            showDiscussArea={showDiscussArea}
            eventDetail={eventDetail}
            discussList={discussList}
            setDiscussList={setDiscussList}
          />
        </div>
      </div>
    </>
  );
};

export default Index;

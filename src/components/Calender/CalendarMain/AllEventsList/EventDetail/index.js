import React, { useCallback, useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  update,
  remove,
  get,
  child,
} from "firebase/database";
import DiscussBox from "./DiscussBox";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import {
  auth,
  writeNewParticipant,
  writeNewNotification,
  writeMemberJoinEvent,
} from "../../../../../firebase.js";
import "../../../../styles/Calendar/EventDetail/index.css";

const Index = ({
  eventDetail,
  showEventDetail,
  setShowEventDetail,
  setShowAllEventsBox,
  eventList,
  discussList,
  setDiscussList,
}) => {
  const handleBackToEventList = () => {
    setShowEventDetail(!showEventDetail);
    setShowDiscussArea((preState) => (preState = false));
    setDiscussList([]);
  };
  //delete event
  const handleDeleteEvent = () => {
    const db = getDatabase();
    const dbRef = ref(getDatabase());
    get(
      child(
        dbRef,
        "event/" +
          eventDetail["eventDate"] +
          "/" +
          eventDetail["eventId"] +
          "/eventParticipants/"
      )
    ).then((snapshot) => {
      if (snapshot.exists()) {
        const participantList = Object.keys(snapshot.val());
        let participantWithoutJoin = participantList.filter((item) => {
          return item !== auth.currentUser.displayName;
        });
        for (let i = 0; i < participantList.length; i++) {
          remove(
            ref(
              db,
              "user/" +
                participantList[i] +
                "/info/joinEvents/" +
                eventDetail["eventId"]
            )
          );
        }
        const message = `您在${eventDetail["eventDate"]}所參加的${eventDetail["eventPlace"]}活動，已被刪除`;
        participantWithoutJoin.map((item) => {
          writeNewNotification(
            item,
            uuidv4(),
            message,
            eventDetail["eventDate"] + "." + eventDetail["eventTime"],
            dayjs().format("YYYY-MM-DD.HH:mm:ss"),
            eventDetail["eventId"]
          );
        });
      }
    });

    remove(
      ref(
        db,
        "event/" + eventDetail["eventDate"] + "/" + eventDetail["eventId"]
      )
    );
    remove(
      ref(
        db,
        "user/" +
          auth.currentUser.displayName +
          "/info/holdEvents/" +
          eventDetail["eventId"]
      )
    );
    if (eventList.length === 1) {
      setShowAllEventsBox((preState) => (preState = false));
    }

    setDiscussList([]);
    setShowEventDetail((preState) => (preState = false));
    setShowDiscussArea((preState) => (preState = false));
  };
  //cancel join event
  const handleCancelJoin = () => {
    const db = getDatabase();
    remove(
      ref(
        db,
        "event/" +
          eventDetail["eventDate"] +
          "/" +
          eventDetail["eventId"] +
          "/eventParticipants/" +
          auth.currentUser.displayName
      )
    );
    let currentAttendant = Number(eventDetail["eventCurrentPal"]);
    currentAttendant -= 1;
    update(
      ref(
        db,
        "event/" + eventDetail["eventDate"] + "/" + eventDetail["eventId"]
      ),
      {
        eventCurrentPal: currentAttendant,
      }
    );
    remove(
      ref(
        db,
        "user/" +
          auth.currentUser.displayName +
          "/info/joinEvents/" +
          eventDetail["eventId"]
      )
    );
    update(
      ref(
        db,
        "user/" +
          eventDetail["userId"] +
          "/info/holdEvents/" +
          eventDetail["eventId"]
      ),
      {
        memberEventCurrentPal: currentAttendant,
      }
    );
    const dbRef = ref(getDatabase());
    get(
      child(
        dbRef,
        "event/" +
          eventDetail["eventDate"] +
          "/" +
          eventDetail["eventId"] +
          "/eventParticipants/"
      )
    ).then((snapshot) => {
      let participantsList = Object.keys(snapshot.val());
      let participantWithoutJoin = participantsList.filter((item) => {
        return item !== auth.currentUser.displayName;
      });
      participantsList = participantsList.filter((item) => {
        return (
          item !== eventDetail["userId"] &&
          item !== auth.currentUser.displayName
        );
      });
      participantsList.map((item) => {
        update(
          ref(
            db,
            "user/" + item + "/info/joinEvents/" + eventDetail["eventId"]
          ),
          {
            memberEventCurrentPal: currentAttendant,
          }
        );
      });
      const message = `您在${eventDetail["eventDate"]}所參加的${eventDetail["eventPlace"]}活動，${auth.currentUser.displayName}取消參加`;
      participantWithoutJoin.map((item) => {
        writeNewNotification(
          item,
          uuidv4(),
          message,
          eventDetail["eventDate"] + "." + eventDetail["eventTime"],
          dayjs().format("YYYY-MM-DD.HH:mm:ss"),
          eventDetail["eventId"]
        );
      });
    });
    eventDetail["eventCurrentPal"] = currentAttendant;
    setShowEventDetail((preState) => !preState);
  };
  //one more attendent
  const handleAddOneAttend = () => {
    const participantsIdList = Object.keys(eventDetail["eventParticipants"]);
    if (!auth.currentUser) {
      alert("log in first");
      return;
    } else if (auth.currentUser.displayName === eventDetail["userId"]) {
      alert("youre holder");
      return;
    } else if (participantsIdList.includes(auth.currentUser.displayName)) {
      alert("join already");
      return;
    }
    let maxAttendant = Number(eventDetail["eventMaxPal"]);
    let currentAttendant = Number(eventDetail["eventCurrentPal"]);
    if (maxAttendant === currentAttendant) {
      alert("full");
      return;
    } else {
      currentAttendant += 1;
      const db = getDatabase();
      update(
        ref(
          db,
          "event/" + eventDetail["eventDate"] + "/" + eventDetail["eventId"]
        ),
        {
          eventCurrentPal: currentAttendant,
        }
      );
      writeNewParticipant(
        eventDetail["eventDate"],
        eventDetail["eventId"],
        "eventParticipants",
        auth.currentUser.displayName
      );

      eventDetail["eventCurrentPal"] = currentAttendant;
      writeMemberJoinEvent(
        auth.currentUser.displayName,
        eventDetail["eventId"],
        eventDetail["eventPlace"],
        eventDetail["eventDate"],
        eventDetail["eventTime"],
        currentAttendant,
        eventDetail["eventMaxPal"],
        eventDetail["userId"]
      );
      const dbRef = ref(getDatabase());
      get(
        child(
          dbRef,
          "event/" +
            eventDetail["eventDate"] +
            "/" +
            eventDetail["eventId"] +
            "/eventParticipants/"
        )
      ).then((snapshot) => {
        let participantsList = Object.keys(snapshot.val());
        let participantWithoutJoin = participantsList.filter((item) => {
          return item !== auth.currentUser.displayName;
        });
        participantsList = participantsList.filter((item) => {
          return item !== eventDetail["userId"];
        });
        participantsList.map((item) => {
          update(
            ref(
              db,
              "user/" + item + "/info/joinEvents/" + eventDetail["eventId"]
            ),
            {
              memberEventCurrentPal: currentAttendant,
            }
          );
        });
        const message = `您在${eventDetail["eventDate"]}所參加的${eventDetail["eventPlace"]}活動，${auth.currentUser.displayName}加入活動`;
        participantWithoutJoin.map((item) => {
          writeNewNotification(
            item,
            uuidv4(),
            message,
            eventDetail["eventDate"] + "." + eventDetail["eventTime"],
            dayjs().format("YYYY-MM-DD.HH:mm:ss"),
            eventDetail["eventId"]
          );
        });
      });
      update(
        ref(
          db,
          "user/" +
            eventDetail["userId"] +
            "/info/holdEvents/" +
            eventDetail["eventId"]
        ),
        {
          memberEventCurrentPal: currentAttendant,
        }
      );

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
      if (auth.currentUser.displayName === eventDetail["userId"]) {
        return "inline";
      } else {
        return "none";
      }
    } else {
      return "none";
    }
  }, [eventDetail]);
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

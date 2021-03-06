import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, update, remove } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import DiscussBox from "./DiscussBox";
import {
  showAllEventsBox,
  notShowAllEventsBox,
  showEventDetailBox,
  notShowEventDetailBox,
  notShowDiscussAreaBox,
  showDiscussAreaBox,
} from "../../../../../redux_toolkit/slice/boolean";
import {
  filterDailyEvent,
  setEmptyDiscussList,
  filterAllEventList,
} from "../../../../../redux_toolkit/slice/eventList";
import {
  fetchData,
  auth,
  writeNewParticipant,
  writeMemberJoinEvent,
  db,
  deleteMemberEventData,
  sendNotificationMessage,
  updateCurrentPal,
} from "../../../../../firebase.js";
import "../../../../../styles/Calendar/EventDetail/index.css";

const Index = () => {
  const { allEventsBox, eventDetailBox, discussAreaBox } = useSelector(
    (state) => state.boolean
  );
  const { allEventList, eventDetail, dailyEventList, discussList } =
    useSelector((state) => state.eventList);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let {
    eventDate,
    eventDescription,
    eventId,
    userId,
    eventTime,
    eventPlace,
    eventMaxPal,
    eventCurrentPal,
    eventParticipants,
  } = eventDetail;
  const [eventDetailMessage, setEventDetailMessage] = useState("");
  const participantsRoute =
    "event/" + eventDate + "/" + eventId + "/eventParticipants/";

  //handle event list
  const handleBackToEventList = () => {
    if (eventDetailBox) {
      dispatch(notShowEventDetailBox());
    } else {
      dispatch(showEventDetailBox());
    }
    setEventDetailMessage("");
    dispatch(notShowDiscussAreaBox());
    dispatch(setEmptyDiscussList());
  };

  const handleShowDiscussArea = () => {
    if (discussAreaBox) {
      dispatch(notShowDiscussAreaBox());
    } else {
      dispatch(showDiscussAreaBox());
    }
  };
  //delete an event
  const handleDeleteEvent = () => {
    try {
      fetchData(participantsRoute).then((data) => {
        deleteMemberEventData(data, eventDetail);
        const message = `??????${eventDate}????????????${eventPlace}?????????????????????`;
        sendNotificationMessage(eventDetail, data, uuidv4(), message);
      });
      remove(ref(db, "event/" + eventDate + "/" + eventId));
      remove(ref(db, "discuss/" + eventId));

      // if no event today, back to calendar page
      if (dailyEventList.length === 1) {
        dispatch(notShowAllEventsBox());
      }

      dispatch(
        filterAllEventList(
          allEventList.filter((item) => {
            return item["eventId"] !== eventId;
          })
        )
      );
      dispatch(
        filterDailyEvent(
          dailyEventList.filter((item) => {
            return item["eventId"] !== eventId;
          })
        )
      );

      dispatch(setEmptyDiscussList());
      dispatch(notShowEventDetailBox());
      dispatch(notShowDiscussAreaBox());
    } catch (err) {
      console.error(err);
    }
  };
  //cancel join event
  const handleCancelJoin = () => {
    const { displayName } = auth.currentUser;
    let currentAttendant = Number(eventCurrentPal) - 1;
    const removeParticipantRoute =
      "event/" +
      eventDate +
      "/" +
      eventId +
      "/eventParticipants/" +
      displayName;
    if (displayName === userId) {
      setEventDetailMessage("?????????????????????????????????????????????");
      return;
    }
    try {
      remove(ref(db, removeParticipantRoute));
      remove(ref(db, "user/" + displayName + "/info/joinEvents/" + eventId));
      update(ref(db, "event/" + eventDate + "/" + eventId), {
        eventCurrentPal: currentAttendant,
      });

      fetchData(participantsRoute).then((data) => {
        updateCurrentPal(data, eventDetail, currentAttendant);
        const message = `??????${eventDate}????????????${eventPlace}?????????${displayName}????????????`;
        sendNotificationMessage(eventDetail, data, uuidv4(), message);
      });

      if (eventDetailBox) {
        dispatch(notShowEventDetailBox());
      } else {
        dispatch(showEventDetailBox());
      }
    } catch (err) {
      console.error(err);
    }
  };
  //one more attendent
  const handleAddOneAttend = () => {
    const { displayName } = auth.currentUser;
    let maxAttendant = Number(eventMaxPal);
    let currentAttendant = Number(eventCurrentPal);
    const participantsIdList = Object.keys(eventParticipants);
    if (!auth.currentUser) {
      setEventDetailMessage("log in first");
      return;
    } else if (displayName === userId) {
      setEventDetailMessage("youre holder");
      return;
    } else if (participantsIdList.includes(displayName)) {
      setEventDetailMessage("join already");
      return;
    } else if (maxAttendant === currentAttendant) {
      setEventDetailMessage("full");
      return;
    } else {
      currentAttendant += 1;
      try {
        update(ref(db, "event/" + eventDate + "/" + eventId), {
          eventCurrentPal: currentAttendant,
        });
        writeNewParticipant(
          eventDate,
          eventId,
          "eventParticipants",
          displayName
        );
        writeMemberJoinEvent(displayName, currentAttendant, eventDetail);
        fetchData(participantsRoute).then((data) => {
          updateCurrentPal(data, eventDetail, currentAttendant);
          const message = `??????${eventDate}????????????${eventPlace}?????????${displayName}????????????`;
          sendNotificationMessage(eventDetail, data, uuidv4(), message);
        });
        eventCurrentPal = currentAttendant;
        if (eventDetailBox) {
          dispatch(notShowEventDetailBox());
        } else {
          dispatch(showEventDetailBox());
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // cross effect
  const handleEventDetailCross = () => {
    if (allEventsBox) {
      dispatch(notShowAllEventsBox());
    } else {
      dispatch(showAllEventsBox());
    }
    setEventDetailMessage("");
    setTimeout(() => {
      dispatch(setEmptyDiscussList());
      dispatch(notShowDiscussAreaBox());
      dispatch(notShowEventDetailBox());
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

  return (
    <>
      <div onClick={handleEventDetailCross} className="EventDetailCross">
        ???
      </div>
      <div
        style={eventDetailBox ? { display: "block" } : { display: "none" }}
        className="eventDetail"
      >
        <div className="detailBar">
          <h4>???????????????</h4>
          <p>{eventPlace}</p>
        </div>
        <div className="detailBar">
          <h4>????????? :</h4>
          <p
            className="eventHolderName"
            onClick={() => navigate("/member/" + userId)}
          >
            {userId}
          </p>
        </div>
        <div className="detailBar">
          <h4>?????????</h4>
          <p>{eventTime}</p>
        </div>
        <div className="detailBar">
          <h4>???????????????</h4>
          <p>
            {eventCurrentPal} / {eventMaxPal}
            <span>
              {eventParticipants && auth.currentUser
                ? Object.keys(eventParticipants).includes(
                    auth.currentUser.displayName
                  )
                  ? "?????????"
                  : ""
                : ""}
            </span>
          </p>
        </div>
        <div className="detailBar">
          <h4>???????????????</h4>
          <p>{eventDescription}</p>
        </div>
        <div className="detailBtn">
          {eventParticipants && auth.currentUser ? (
            Object.keys(eventParticipants).includes(
              auth.currentUser.displayName
            ) ? (
              <button
                onClick={handleCancelJoin}
                className="eventAttendCancelBtn"
              >
                ????????????
              </button>
            ) : (
              <button
                onClick={handleAddOneAttend}
                className="eventAttendCancelBtn"
              >
                ??????
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
            ??????
          </button>
        </div>
        <p onClick={handleBackToEventList} className="detailBackToList">
          ????????????
        </p>
        <p className="eventDetailMessage">{eventDetailMessage}</p>
        <div className="eventDetailDiscuss">
          <h4 onClick={handleShowDiscussArea}>??????{discussList.length}</h4>
          <DiscussBox setEventDetailMessage={setEventDetailMessage} />
        </div>
      </div>
    </>
  );
};

export default Index;

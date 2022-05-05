import React, { useState } from "react";
import {
  writeNewEvent,
  auth,
  writeNewParticipant,
  writeMemberHoldEvent,
} from "../../../../firebase.js";
import { v4 as uuidv4 } from "uuid";
import "../../../styles/Calendar/LaunchEvent/index.css";

const Index = ({
  scaleAnimation,
  setScaleAnimation,
  eventInputValue,
  setEventInputValue,
  list,
  setList,
}) => {
  // handle event box cancel by clicking cross
  const handleCloseLaunch = () => {
    setScaleAnimation(0);
    setEventInputValue({
      eventPlace: "",
      eventDate: "",
      eventTime: "",
      eventMaxPal: "",
      eventDescription: "",
    });
  };
  //get the input value by onchange
  const [eventErrorMessage, setEventErrorMessage] = useState("");
  const { eventPlace, eventDate, eventTime, eventMaxPal, eventDescription } =
    eventInputValue;
  const handleGetEventInput = (e) => {
    setEventInputValue({ ...eventInputValue, [e.target.name]: e.target.value });
  };

  const handleSubmitEventData = () => {
    if (!eventPlace || !eventDate || !eventTime || !eventMaxPal) {
      setEventErrorMessage("Fill the requested(*) blanks");
      return;
    } else if (!auth.currentUser) {
      setEventErrorMessage("Please log in first");
      return;
    }
    const uuid = uuidv4();
    setList([...list, eventInputValue]);
    writeNewEvent(
      uuid,
      eventPlace,
      eventDate,
      eventTime,
      eventMaxPal,
      eventDescription,
      auth.currentUser.displayName
    );
    setEventInputValue({
      eventPlace: "",
      eventDate: "",
      eventTime: "",
      eventMaxPal: "",
      eventDescription: "",
    });
    writeMemberHoldEvent(
      auth.currentUser.displayName,
      uuid,
      eventPlace,
      eventDate,
      eventTime,
      eventMaxPal
    );
    writeNewParticipant(
      eventDate,
      uuid,
      "eventParticipants",
      auth.currentUser.displayName
    );
    setScaleAnimation(0);
  };
  return (
    <>
      <section
        style={{ transform: "scale(" + scaleAnimation + ")" }}
        className="launchEventBox"
      >
        <p className="handleCancelEventBox" onClick={handleCloseLaunch}>
          X
        </p>
        <div className="newEventBox">
          <h3>發起活動</h3>
          <div className="eventBarName">
            <h4 className="eventInputTitle">
              酒吧名稱<span>*</span>
            </h4>
            <input
              onChange={handleGetEventInput}
              name="eventPlace"
              value={eventPlace}
              type="text"
            />
          </div>
          <div className="eventBarDate">
            <h4 className="eventInputTitle">
              日期<span>*</span>
            </h4>
            <input
              onChange={handleGetEventInput}
              name="eventDate"
              value={eventDate}
              type="date"
            />
          </div>
          <div className="eventBarTime">
            <h4 className="eventInputTitle">
              時間 <span>*</span>
            </h4>
            <input
              onChange={handleGetEventInput}
              name="eventTime"
              value={eventTime}
              type="time"
            />
          </div>
          <div className="eventBarMaxPal">
            <h4 className="eventInputTitle">
              最多人數<span>*</span>
            </h4>
            <input
              onChange={handleGetEventInput}
              name="eventMaxPal"
              value={eventMaxPal}
              type="number"
            />
          </div>
          <div className="eventBarDescription">
            <h4 className="eventInputTitle">聚會描述</h4>
            <textarea
              onChange={handleGetEventInput}
              value={eventDescription}
              name="eventDescription"
            ></textarea>
          </div>
          <p className="eventErrorMessage">{eventErrorMessage}</p>
          <button onClick={handleSubmitEventData}>Submit</button>
        </div>
      </section>
    </>
  );
};

export default Index;
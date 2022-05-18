import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import { notShowStartEventBox } from "../../../../redux_toolkit/slice/boolean.js";
import { storeEventInput } from "../../../../redux_toolkit/slice/startEvent";
import {
  writeNewEvent,
  auth,
  writeNewParticipant,
  writeMemberHoldEvent,
} from "../../../../firebase.js";
import {
  addCalendarEvent,
  addAllEvent,
} from "../../../../redux_toolkit/slice/eventList";
import "../../../styles/Calendar/LaunchEvent/index.css";

const Index = () => {
  const { startEventBox } = useSelector((state) => state.boolean);
  const { eventInput } = useSelector((state) => state.eventInput);
  const { allEventList } = useSelector((state) => state.eventList);
  const dispatch = useDispatch();
  // handle event list
  const handleCloseLaunch = () => {
    dispatch(notShowStartEventBox());
    setEventErrorMessage("");
    dispatch(
      storeEventInput({
        eventPlace: "",
        eventDate: "",
        eventTime: "",
        eventMaxPal: "",
        eventDescription: "",
      })
    );
  };
  //get the input value by onchange
  const [eventErrorMessage, setEventErrorMessage] = useState("");
  const { eventPlace, eventDate, eventTime, eventMaxPal, eventDescription } =
    eventInput;
  const handleGetEventInput = (e) => {
    dispatch(storeEventInput({ [e.target.name]: e.target.value }));
  };
  const handleSubmitEventData = () => {
    if (!eventPlace || !eventDate || !eventTime || !eventMaxPal) {
      setEventErrorMessage("Fill the requested(*) blanks");
      return;
    } else if (!auth.currentUser) {
      setEventErrorMessage("Please log in first");
      return;
    } else if (eventDate < dayjs().format("YYYY-MM-DD")) {
      setEventErrorMessage("Wrong Date");
      return;
    } else if (eventPlace.length > 12) {
      setEventErrorMessage("bar Name Max 12 words");
    } else if (eventMaxPal > 16) {
      setEventErrorMessage("Max Pal is 16");
    }
    const uuid = uuidv4();
    const { displayName } = auth.currentUser;

    const checkLengthArr = allEventList.filter((item) => {
      return item["eventDate"] === eventDate;
    });
    if (checkLengthArr.length < 2) {
      dispatch(addCalendarEvent(eventInput));
    } else if (checkLengthArr.length === 2) {
      dispatch(addCalendarEvent({ eventPlace: "還有...", eventDate }));
    }
    dispatch(addAllEvent(eventInput));
    writeNewEvent(uuid, eventInput, displayName);
    dispatch(
      storeEventInput({
        eventPlace: "",
        eventDate: "",
        eventTime: "",
        eventMaxPal: "",
        eventDescription: "",
      })
    );

    writeMemberHoldEvent(displayName, uuid, eventInput);
    writeNewParticipant(eventDate, uuid, "eventParticipants", displayName);
    dispatch(notShowStartEventBox());
  };
  return (
    <>
      <section
        style={{ transform: "scale(" + startEventBox + ")" }}
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

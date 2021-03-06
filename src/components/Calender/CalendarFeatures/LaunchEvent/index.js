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
import "../../../../styles/Calendar/LaunchEvent/index.css";

const Index = () => {
  const { startEventBox } = useSelector((state) => state.boolean);
  const { eventInput } = useSelector((state) => state.eventInput);
  const dispatch = useDispatch();

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
  // store input value
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
    } else if (eventPlace.length > 18) {
      setEventErrorMessage("bar Name Max 12 words");
      return;
    } else if (eventMaxPal > 16) {
      setEventErrorMessage("Max Pal is 16");
      return;
    } else if (eventDescription.length > 80) {
      setEventErrorMessage("Description Max 80 words");
      return;
    }
    const uuid = uuidv4();
    const { displayName } = auth.currentUser;

    try {
      writeNewEvent(uuid, eventInput, displayName);
      writeMemberHoldEvent(displayName, uuid, eventInput);
      writeNewParticipant(eventDate, uuid, "eventParticipants", displayName);
      dispatch(notShowStartEventBox());
      dispatch(
        storeEventInput({
          eventPlace: "",
          eventDate: "",
          eventTime: "",
          eventMaxPal: "",
          eventDescription: "",
        })
      );
    } catch {
      setEventErrorMessage("Fail! Try again later");
    }
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
          <h3>????????????</h3>
          <div className="eventBarName">
            <h4 className="eventInputTitle">
              ????????????<span>*</span>
            </h4>
            <input
              onChange={handleGetEventInput}
              name="eventPlace"
              value={eventPlace}
              type="text"
              maxLength={18}
            />
          </div>
          <div className="eventBarDate">
            <h4 className="eventInputTitle">
              ??????<span>*</span>
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
              ?????? <span>*</span>
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
              ????????????<span>*</span>
            </h4>
            <input
              onChange={handleGetEventInput}
              name="eventMaxPal"
              value={eventMaxPal}
              type="number"
            />
          </div>
          <div className="eventBarDescription">
            <h4 className="eventInputTitle">????????????</h4>
            <textarea
              onChange={handleGetEventInput}
              value={eventDescription}
              name="eventDescription"
              maxLength={80}
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

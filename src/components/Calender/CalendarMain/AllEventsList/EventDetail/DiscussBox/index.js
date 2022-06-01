import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { addDiscussList } from "../../../../../../redux_toolkit/slice/eventList.js";
import {
  auth,
  writeDiscussItem,
  sendNotificationMessage,
  fetchData,
} from "../../../../../../firebase.js";
import "../../../../../../styles/Calendar/EventDetail/index.css";

const Index = ({ setEventDetailMessage }) => {
  const { discussAreaBox } = useSelector((state) => state.boolean);
  const { eventDetail, discussList } = useSelector((state) => state.eventList);
  const dispatch = useDispatch();
  const { eventDate, eventId, eventPlace } = eventDetail;
  const [discussData, setDiscussData] = useState({
    discussContent: "",
    discussName: "",
  });
  const { discussContent, discussName } = discussData;
  const handleDiscussInput = (e) => {
    if (auth.currentUser) {
      setDiscussData({
        ...discussData,
        discussContent: e.target.value,
        discussName: auth.currentUser.displayName,
      });
    } else {
      setEventDetailMessage("please log in first");
    }
  };
  const handleSendNewDiscuss = () => {
    if (auth.currentUser) {
      if (!discussContent) {
        setEventDetailMessage("It's Empty");
        return;
      } else if (discussContent.length > 50) {
        setEventDetailMessage("Max 50 words");
        return;
      }
      const { displayName } = auth.currentUser;
      dispatch(addDiscussList(discussData));
      try {
        writeDiscussItem(
          eventId,
          uuidv4(),
          displayName,
          discussContent,
          discussName,
          dayjs().format("YYYY.MM.DD.H.mm.ss")
        );
        const participantsRoute =
          "event/" + eventDate + "/" + eventId + "/eventParticipants/";
        fetchData(participantsRoute).then((data) => {
          const message = `${displayName}在您所參加的${eventDate},${eventPlace}活動中留言`;
          sendNotificationMessage(eventDetail, data, uuidv4(), message);
        });
        setDiscussData({ discussContent: "", discussName: "" });
      } catch {
        setEventDetailMessage("Fail! Try again");
      }
    } else {
      setEventDetailMessage("please log in first");
    }
  };

  return (
    <div
      style={discussAreaBox ? { display: "flex" } : { display: "none" }}
      className="discussDetailContainer"
    >
      <textarea value={discussContent} onChange={handleDiscussInput}></textarea>
      <button onClick={handleSendNewDiscuss}>Confirm</button>
      <div className="discussItemContainer">
        {discussList
          ? discussList.map((item) => {
              return (
                <div>
                  <div className="discussDetailList">
                    <h5>{item.discussName}</h5>
                    <p>{item.discussContent}</p>
                  </div>
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
};

export default Index;

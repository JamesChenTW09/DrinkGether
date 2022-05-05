import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { auth, writeDiscussItem } from "../../../../../../firebase.js";
import dayjs from "dayjs";
import "../../../../../styles/Calendar/EventDetail/index.css";

const Index = ({
  eventDetail,
  discussList,
  setDiscussList,
  showDiscussArea,
}) => {
  const testing = useRef();
  // const [replyList, setReplyList] = useState(["真的假的", "一定要來"]);
  const [discussData, setDiscussData] = useState({
    discussContent: "",
    discussName: "",
  });
  // const [discussList, setDiscussList] = useState([]);
  const handleDiscussInput = (e) => {
    if (auth.currentUser) {
      setDiscussData({
        ...discussData,
        discussContent: e.target.value,
        discussName: auth.currentUser.displayName,
      });
    } else {
      alert("please log in first");
    }
  };
  const handleSendNewDiscuss = () => {
    if (auth.currentUser) {
      setDiscussList([...discussList, discussData]);
      writeDiscussItem(
        eventDetail["eventId"],
        uuidv4(),
        auth.currentUser.displayName,
        discussData["discussContent"],
        discussData["discussName"],
        dayjs().format("YYYY.MM.DD.H.mm.ss")
      );
      setDiscussData({ discussContent: "", discussName: "" });
    } else {
      alert("please log in first");
    }
  };

  return (
    <div
      style={showDiscussArea ? { display: "flex" } : { display: "none" }}
      className="discussDetailContainer"
    >
      <textarea
        value={discussData["discussContent"]}
        onChange={handleDiscussInput}
      ></textarea>
      <button onClick={handleSendNewDiscuss}>Confirm</button>
      <div ref={testing} className="discussItemContainer">
        {discussList
          ? discussList.map((item) => {
              return (
                <div>
                  <div className="discussDetailList">
                    <h5>{item.discussName}</h5>
                    <p>{item.discussContent}</p>{" "}
                  </div>
                </div>
              );
            })
          : ""}
      </div>
    </div>
    // </div>
  );
};

export default Index;

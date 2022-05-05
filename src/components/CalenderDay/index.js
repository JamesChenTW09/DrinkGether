import React, { useState } from "react";
import CalenderDayDiscuss from "./CalenderDayDiscuss";
import { writeDiscussData, getTotalDiscuss } from "../../../firebase.js";
import "./styles/index.css";
import icon from "./beer.jpg";

const Index = () => {
  const [discussShowing, setDiscussShowing] = useState("none");
  const [discussArr, setDiscussArr] = useState([]);
  const [textData, setTextData] = useState("");

  const handleTextChange = (e) => {
    setTextData(e.target.value);
  };
  const sendNewDiscuss = () => {
    if (textData === "") {
      return;
    }

    writeDiscussData("James", textData, "picture1", "4月3日", 2);
    setDiscussArr([...discussArr, <CalenderDayDiscuss textData={textData} />]);
    setTextData("");
  };

  const showDiscussContent = () => {
    if (discussShowing === "block") {
      setDiscussArr([]);
      setDiscussShowing("none");
    } else {
      setDiscussShowing("block");
    }
    getTotalDiscuss("4月3日", lookforData);

    function lookforData(result) {
      if (discussArr.length === result.length - 1 && discussArr.length !== 0) {
        return;
      }
      for (let i = 1; i < result.length; i++) {
        setDiscussArr((discussArr) => [
          ...discussArr,
          <CalenderDayDiscuss textData={result[i].textContent} />,
        ]);
      }
    }
  };
  return (
    <div>
      <div className="calenderDayContainer">
        <div className="calenderDayItem">
          <h3>2022年4月3日</h3>
          <div className="dayDetail">
            <div className="detailContent">
              <h4>Bar weekend</h4>
              <p className="dayTime">19:00</p>
              <p className="dayPeople">2 / 4人</p>
              <button className="joinEventBtn">Join</button>
              <button onClick={showDiscussContent} className="messageBtn">
                留言<span></span>
              </button>
            </div>
            <div className="discussContent" style={{ display: discussShowing }}>
              <div className="addMessageBox">
                <img src={icon} alt="" />
                <textarea
                  onChange={handleTextChange}
                  className="messageInput"
                  placeholder="留言......"
                  value={textData}
                ></textarea>
                <button onClick={sendNewDiscuss} className="sendMessage">
                  Send
                </button>
              </div>
              {discussArr.map((item) => {
                return item;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

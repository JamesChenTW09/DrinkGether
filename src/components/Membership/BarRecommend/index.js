import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { remove, ref } from "firebase/database";
import { auth, writeRecommendBar, db } from "../../../firebase";
import "../../styles/Membership/BarRecommend/index.css";

const Index = ({ barRecommendArr, setBarRecommendArr, storeUserNameId }) => {
  const [barRecommendMessage, setBarRecommendMessage] = useState("");
  const [recommendBar, setRecommendBarName] = useState({
    barName: "",
    barRceommendText: "",
    uuid: "",
  });
  const { barName, barRceommendText, uuid } = recommendBar;
  const handleRecommendBar = (e) => {
    const uuid = uuidv4();
    setRecommendBarName({
      ...recommendBar,
      [e.target.name]: e.target.value,
      uuid,
    });
  };
  const handleSubmitRecommend = () => {
    const { displayName } = auth.currentUser;
    if (displayName !== storeUserNameId) {
      setBarRecommendMessage("This is not your member page");
      return;
    }
    if (barRecommendArr.length >= 3 || !barName || !barRceommendText) {
      setBarRecommendMessage("All inputs are required");
      return;
    } else if (barName.length > 12) {
      setBarRecommendMessage("Bar Name Max 12 words");
      return;
    } else if (barRceommendText.length > 70) {
      setBarRecommendMessage("Intro max 70 words");
      return;
    }

    try {
      writeRecommendBar(displayName, uuid, barName, barRceommendText);
      setBarRecommendArr([...barRecommendArr, recommendBar]);
      setRecommendBarName({ barName: "", barRceommendText: "", uuid: "" });
      setBarRecommendMessage("");
    } catch {
      setBarRecommendMessage("Fail! Try again");
    }
  };

  // handle delete bar recommend
  const recommendOutput = useRef();
  const handleDeleteRecommencBar = () => {
    const { displayName } = auth.currentUser;
    if (displayName !== storeUserNameId) {
      setBarRecommendMessage("This is not your member page");
      return;
    }
    const checkBoxIdArr = [];
    const checkArr = recommendOutput.current.children;
    const checkArrLen = checkArr.length;
    if (!checkArrLen) {
      return;
    }
    for (let i = 0; i < checkArrLen; i++) {
      if (checkArr[i].children[0].checked) {
        checkBoxIdArr.push(checkArr[i].children[0].name);
      }
    }
    const newBarRecommendArr = barRecommendArr.filter((item) => {
      return !checkBoxIdArr.includes(item.uuid);
    });
    setBarRecommendArr(newBarRecommendArr);
    for (let i = 0; i < checkArrLen; i++) {
      checkArr[i].children[0].checked = false;
    }
    const checkBoxIdArrLen = checkBoxIdArr.length;
    for (let i = 0; i < checkBoxIdArrLen; i++) {
      remove(
        ref(db, "user/" + displayName + "/BarRecommend/" + checkBoxIdArr[i])
      );
    }
  };

  return (
    <>
      <div className="memberRecommend">
        <h3>Top 3 Bar Recommend</h3>
        <div className="barRecommendInput">
          <input
            name="barName"
            onChange={handleRecommendBar}
            value={barName}
            type="text"
            placeholder="Bar"
          />
          <textarea
            value={barRceommendText}
            name="barRceommendText"
            onChange={handleRecommendBar}
            placeholder="Reasons of recommendation"
          ></textarea>
          <div>
            <button onClick={handleSubmitRecommend}>Submit</button>
            <button onClick={handleDeleteRecommencBar}>Delete</button>
          </div>
          <div className="barRecommendMessage">{barRecommendMessage}</div>
        </div>
        <div ref={recommendOutput} className="barRecommendOutput">
          {barRecommendArr
            ? barRecommendArr.map((item) => {
                const { uuid, barName, barRceommendText } = item;
                return (
                  <div key={uuid}>
                    <input name={uuid} type="checkbox" />
                    <h4>{barName}</h4>
                    <p>{barRceommendText}</p>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
    </>
  );
};

export default Index;

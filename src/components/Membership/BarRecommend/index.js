import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { remove, ref } from "firebase/database";
import { auth, writeRecommendBar, db } from "../../../firebase";

import "../../styles/Membership/index.css";

const Index = ({ barRecommendArr, setBarRecommendArr }) => {
  //store recommend bar data and send to database
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
    if (barRecommendArr.length >= 3 || !barName || !barRceommendText) {
      return;
    }
    setBarRecommendArr([...barRecommendArr, recommendBar]);
    const { displayName } = auth.currentUser;
    writeRecommendBar(displayName, uuid, barName, barRceommendText);
    setRecommendBarName({ barName: "", barRceommendText: "", uuid: "" });
  };
  // handle delete bar recommend
  const recommendOutput = useRef();
  const handleDeleteRecommencBar = () => {
    const checkBoxIdArr = [];
    const checkArr = recommendOutput.current.children;
    for (let i = 0; i < checkArr.length; i++) {
      if (checkArr[i].children[0].checked) {
        checkBoxIdArr.push(checkArr[i].children[0].name);
      }
    }
    const newBarRecommendArr = barRecommendArr.filter((item) => {
      return !checkBoxIdArr.includes(item.uuid);
    });

    setBarRecommendArr(newBarRecommendArr);
    for (let i = 0; i < checkArr.length; i++) {
      checkArr[i].children[0].checked = false;
    }

    const { displayName } = auth.currentUser;
    for (let i = 0; i < checkBoxIdArr.length; i++) {
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
            placeholder="Name of the Bar"
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
        </div>
        <div ref={recommendOutput} className="barRecommendOutput">
          {barRecommendArr
            ? barRecommendArr.map((item) => {
                const { uuid, barName, barRceommendText } = item;
                return (
                  <div>
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

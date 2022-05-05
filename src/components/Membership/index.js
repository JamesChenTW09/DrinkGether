import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import {
  writeRecommendBar,
  auth,
  writeNewNotification,
} from "../../firebase.js";
import {
  remove,
  ref,
  getDatabase,
  get,
  child,
  update,
} from "firebase/database";
import BarRecommend from "./BarRecommend";
import MemberInfo from "./MemberInfo";
import "../styles/Membership/index.css";

const Index = () => {
  const location = useLocation();

  const [recommendBar, setRecommendBarName] = useState({
    barName: "",
    barRceommendText: "",
  });
  const { barName, barRceommendText } = recommendBar;
  const [barRecommendArr, setBarRecommendArr] = useState([]);
  const handleRecommendBar = (e) => {
    setRecommendBarName({ ...recommendBar, [e.target.name]: e.target.value });
  };
  const handleSubmitRecommend = () => {
    if (barRecommendArr.length >= 3 || !barName || !barRceommendText) {
      return;
    }
    const uuid = uuidv4();
    setBarRecommendArr([
      ...barRecommendArr,
      <BarRecommend key={uuid} myKey={uuid} recommendBar={recommendBar} />,
    ]);
    writeRecommendBar(
      auth.currentUser.displayName,
      uuid,
      barName,
      barRceommendText
    );
    setRecommendBarName({ barName: "", barRceommendText: "" });
  };
  // handle delete
  const recommendOutput = useRef();
  const handleDeleteRecommencBar = () => {
    const outputArr = recommendOutput.current.children;
    console.log(outputArr);
    let checkArr = [];
    for (let i = 0; i < outputArr.length; i++) {
      if (outputArr[i].children[0].checked) {
        checkArr.push(outputArr[i].children[0].name);
      }
    }
    console.log(checkArr);
    console.log(barRecommendArr);
    const arrLength = checkArr.length;
    const tryArr = barRecommendArr.filter((item) => {
      if (arrLength === 0) {
        return item;
      }
      return !checkArr.includes(item.key);
    });

    console.log(tryArr);
    const db = getDatabase();
    for (let i = 0; i < checkArr.length; i++) {
      remove(
        ref(
          db,
          "user/" +
            auth.currentUser.displayName +
            "/BarRecommend/" +
            checkArr[i]
        )
      );
    }
    setBarRecommendArr(tryArr);
  };

  //參與的酒吧活動
  //調整點擊事件，主辦或參加交換
  const [holdOrJoin, setHoldOrJoin] = useState(true);
  const handleHoldOrJoin = () => {
    setHoldOrJoin(!holdOrJoin);
  };

  //first 自己舉辦的活動
  const [memberHoldEventList, setMemberHoldEventList] = useState([]);
  const sortHoldEvents = (memberEventList) => {
    const holdEventIdList = Object.keys(memberEventList);
    const timeArr = holdEventIdList.map((item) => {
      return (
        memberEventList[item]["memberEventDate"] +
        "," +
        memberEventList[item]["memberEventTime"]
      );
    });
    timeArr.sort();
    let newTimeArr = timeArr.map((item) => {
      return item.split(",");
    });
    let finalArr = [];

    for (let i = 0; i < newTimeArr.length; i++) {
      for (let j = 0; j < holdEventIdList.length; j++) {
        if (
          memberEventList[holdEventIdList[j]]["memberEventDate"] ===
            newTimeArr[i][0] &&
          memberEventList[holdEventIdList[j]]["memberEventTime"] ===
            newTimeArr[i][1]
        ) {
          finalArr.push(memberEventList[holdEventIdList[j]]);
          break;
        }
      }
    }

    return finalArr;
  };
  //delte the host event
  const handleDeleteMemberEvent = (item) => {
    const db = getDatabase();
    const dbRef = ref(getDatabase());
    get(
      child(
        dbRef,
        "event/" +
          item["memberEventDate"] +
          "/" +
          item["eventId"] +
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
                item["eventId"]
            )
          );
        }
        const message = `您在${item["memberEventDate"]}所參加的${item["memberEventName"]}活動，已被刪除`;
        participantWithoutJoin.map((participant) => {
          writeNewNotification(
            participant,
            uuidv4(),
            message,
            item["memberEventDate"] + "." + item["memberEventTime"],
            dayjs().format("YYYY-MM-DD.HH:mm:ss"),
            item["eventId"]
          );
        });
      }
    });

    remove(ref(db, "event/" + item["memberEventDate"] + "/" + item["eventId"]));
    remove(
      ref(
        db,
        "user/" +
          auth.currentUser.displayName +
          "/info/holdEvents/" +
          item["eventId"]
      )
    );

    setMemberHoldEventList(
      memberHoldEventList.filter((eventItem) => {
        return eventItem["eventId"] !== item["eventId"];
      })
    );
  };
  // 參加的活動
  const [memberJoinEventList, setMemberJoinEventList] = useState([]);

  //cancel join event
  const handleCancelMemberEvent = (item) => {
    const db = getDatabase();
    remove(
      ref(
        db,
        "event/" +
          item["memberEventDate"] +
          "/" +
          item["eventId"] +
          "/eventParticipants/" +
          auth.currentUser.displayName
      )
    );
    remove(
      ref(
        db,
        "user/" +
          auth.currentUser.displayName +
          "/info/joinEvents/" +
          item["eventId"]
      )
    );
    update(
      ref(db, "event/" + item["memberEventDate"] + "/" + item["eventId"]),
      {
        eventCurrentPal: item["memberEventCurrentPal"] - 1,
      }
    );
    update(
      ref(
        db,
        "user/" + item["holdUserId"] + "/info/holdEvents/" + item["eventId"]
      ),
      {
        memberEventCurrentPal: item["memberEventCurrentPal"] - 1,
      }
    );
    const dbRef = ref(getDatabase());
    get(
      child(
        dbRef,
        "event/" +
          item["memberEventDate"] +
          "/" +
          item["eventId"] +
          "/eventParticipants/"
      )
    ).then((snapshot) => {
      let participantsList = Object.keys(snapshot.val());
      let participantWithoutJoin = participantsList.filter((item) => {
        return item !== auth.currentUser.displayName;
      });
      participantsList = participantsList.filter((user) => {
        return (
          user !== item["holdUserId"] && user !== auth.currentUser.displayName
        );
      });
      participantsList.map((user) => {
        update(
          ref(db, "user/" + user + "/info/joinEvents/" + item["eventId"]),
          {
            memberEventCurrentPal: item["memberEventCurrentPal"] - 1,
          }
        );
      });
      const message = `您在${item["memberEventDate"]}所參加的${item["memberEventName"]}活動，${auth.currentUser.displayName}已取消`;
      participantWithoutJoin.map((participant) => {
        writeNewNotification(
          participant,
          uuidv4(),
          message,
          item["memberEventDate"] + "." + item["memberEventTime"],
          dayjs().format("YYYY-MM-DD.HH:mm:ss"),
          item["eventId"]
        );
      });
    });
    setMemberJoinEventList(
      memberJoinEventList.filter((eventItem) => {
        return eventItem["eventId"] !== item["eventId"];
      })
    );
  };

  //contact info
  const [participantContact, setParticipantContact] = useState([]);
  const [showContactBox, setShowContactBox] = useState(false);
  const handleHoldContact = (item) => {
    const dbRef = ref(getDatabase());
    get(
      child(
        dbRef,
        "event/" +
          item["memberEventDate"] +
          "/" +
          item["eventId"] +
          "/eventParticipants"
      )
    ).then((snapshot) => {
      const participantsList = Object.keys(snapshot.val());
      const participantsInfoList = participantsList.map(async (item) => {
        return get(child(dbRef, "user/" + item + "/info/")).then((snapshot) => {
          return snapshot.val();
        });
      });
      Promise.all(participantsInfoList).then((values) => {
        setParticipantContact(values);
      });
    });
    setShowContactBox(!showContactBox);
  };

  const [storeUserNameId, setStoreUserNameId] = useState("");

  const fetchData = useCallback(() => {
    if (auth.currentUser) {
      const dbRef = ref(getDatabase());
      const userNameId = location.pathname.split("/member/")[1];
      setStoreUserNameId(userNameId);
      get(child(dbRef, "user/" + userNameId)).then((snapshot) => {
        if (snapshot.exists()) {
          if (
            !snapshot.val()["BarRecommend"] &&
            !snapshot.val()["info"]["holdEvents"] &&
            !snapshot.val()["info"]["joinEvents"]
          ) {
            return;
          } else if (
            !snapshot.val()["BarRecommend"] &&
            !snapshot.val()["info"]["joinEvents"]
          ) {
            const holdEventsList = sortHoldEvents(
              snapshot.val()["info"]["holdEvents"]
            );
            setMemberHoldEventList(holdEventsList);
            return;
          } else if (
            !snapshot.val()["info"]["holdEvents"] &&
            !snapshot.val()["info"]["joinEvents"]
          ) {
            const userRecommend = snapshot.val()["BarRecommend"];
            const recommendList = Object.keys(userRecommend);
            const finalRecommendList = recommendList.map((item) => {
              return (
                <BarRecommend
                  key={item}
                  myKey={item}
                  recommendBar={userRecommend[item]}
                />
              );
            });
            setBarRecommendArr(finalRecommendList);
            return;
          } else if (
            !snapshot.val()["BarRecommend"] &&
            !snapshot.val()["info"]["holdEvents"]
          ) {
            const joinEventsList = sortHoldEvents(
              snapshot.val()["info"]["joinEvents"]
            );
            setMemberJoinEventList(joinEventsList);
            return;
          } else if (!snapshot.val()["info"]["holdEvents"]) {
            const joinEventsList = sortHoldEvents(
              snapshot.val()["info"]["joinEvents"]
            );
            setMemberJoinEventList(joinEventsList);
            const userRecommend = snapshot.val()["BarRecommend"];
            const recommendList = Object.keys(userRecommend);
            const finalRecommendList = recommendList.map((item) => {
              return (
                <BarRecommend
                  key={item}
                  myKey={item}
                  recommendBar={userRecommend[item]}
                />
              );
            });
            setBarRecommendArr(finalRecommendList);
          } else if (!snapshot.val()["info"]["joinEvents"]) {
            const holdEventsList = sortHoldEvents(
              snapshot.val()["info"]["holdEvents"]
            );
            setMemberHoldEventList(holdEventsList);
            const userRecommend = snapshot.val()["BarRecommend"];
            const recommendList = Object.keys(userRecommend);
            const finalRecommendList = recommendList.map((item) => {
              return (
                <BarRecommend
                  key={item}
                  myKey={item}
                  recommendBar={userRecommend[item]}
                />
              );
            });
            setBarRecommendArr(finalRecommendList);
          } else if (!snapshot.val()["BarRecommend"]) {
            const holdEventsList = sortHoldEvents(
              snapshot.val()["info"]["holdEvents"]
            );
            setMemberHoldEventList(holdEventsList);
            const joinEventsList = sortHoldEvents(
              snapshot.val()["info"]["joinEvents"]
            );
            setMemberJoinEventList(joinEventsList);
          } else {
            const holdEventsList = sortHoldEvents(
              snapshot.val()["info"]["holdEvents"]
            );
            setMemberHoldEventList(holdEventsList);
            const joinEventsList = sortHoldEvents(
              snapshot.val()["info"]["joinEvents"]
            );
            setMemberJoinEventList(joinEventsList);

            const userRecommend = snapshot.val()["BarRecommend"];
            const recommendList = Object.keys(userRecommend);
            const finalRecommendList = recommendList.map((item) => {
              return (
                <BarRecommend
                  key={item}
                  myKey={item}
                  recommendBar={userRecommend[item]}
                />
              );
            });
            setBarRecommendArr(finalRecommendList);
          }
        } else {
          console.log("no data");
        }
      });
    } else {
      setTimeout(() => {
        fetchData();
      }, 100);
    }
  }, [location.pathname]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <section className="memberContainer">
        <div
          className="participantContact"
          style={
            showContactBox
              ? { transform: "scale(1)" }
              : { transform: "scale(0)" }
          }
        >
          <div className="participantListItem">
            <div className="participantName">姓名</div>
            <div className="participantLineId">Line ID</div>
            <div className="participantWebsite">個人網址連結</div>
          </div>
          {participantContact
            ? participantContact.map((item) => {
                return (
                  <div className="participantListItem">
                    <div className="participantName">{item["name"]}</div>
                    <div className="participantLineId">
                      {item["lineId"] ? item["lineId"] : "無"}
                    </div>
                    <div
                      onClick={() => {
                        window.location =
                          "http://localhost:3000/member/" + item["name"];
                      }}
                      className="participantWebsiteLink"
                    >
                      localhost:3000/member/{item["name"]}
                    </div>
                  </div>
                );
              })
            : ""}
        </div>
        <MemberInfo storeUserNameId={storeUserNameId} />
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
            {barRecommendArr.map((item) => {
              return item;
            })}
          </div>
        </div>
        <div className="memberEvents">
          <div
            style={
              auth.currentUser
                ? storeUserNameId === auth.currentUser.displayName
                  ? { display: "block" }
                  : { display: "none" }
                : { display: "none" }
            }
            className="memberEventsContainer"
          >
            <div className="eventHeader">
              <div
                onClick={handleHoldOrJoin}
                style={
                  holdOrJoin
                    ? { backgroundColor: "lightgray" }
                    : { backgroundColor: "white" }
                }
                className="memberEventLaunch"
              >
                主辦的活動
              </div>
              <div
                onClick={handleHoldOrJoin}
                style={
                  holdOrJoin
                    ? { backgroundColor: "white" }
                    : { backgroundColor: "lightgray" }
                }
                className="memberEventJoin"
              >
                加入的活動
              </div>
            </div>
            <div className="memberEventContainer">
              <div className="memberEventList">
                <div className="memberEventName">酒吧名稱</div>
                <div className="memberEventDate">日期</div>
                <div className="memberEventTime">時間</div>
                <div className="memberEventPal">人數</div>
              </div>
              {memberHoldEventList
                ? memberHoldEventList.map((item) => {
                    return (
                      <div
                        style={
                          holdOrJoin ? { display: "flex" } : { display: "none" }
                        }
                        key={item["eventId"]}
                        className="memberEventList"
                      >
                        <div className="memberEventName">
                          {item["memberEventName"]}
                        </div>
                        <div className="memberEventDate">
                          {item["memberEventDate"]}
                        </div>
                        <div className="memberEventTime">
                          {item["memberEventTime"]}
                        </div>
                        <div className="memberEventPal">
                          {item["memberEventCurrentPal"] +
                            " / " +
                            item["memberEventPal"]}
                        </div>
                        <div className="memberEventBtn">
                          <button
                            onClick={() => handleHoldContact(item)}
                            className="memberEventContact"
                          >
                            聯絡
                          </button>
                          <button
                            onClick={() => handleDeleteMemberEvent(item)}
                            className="memberEventDelete"
                          >
                            刪除
                          </button>
                        </div>
                      </div>
                    );
                  })
                : ""}
              {memberJoinEventList
                ? memberJoinEventList.map((item) => {
                    return (
                      <div
                        style={
                          holdOrJoin ? { display: "none" } : { display: "flex" }
                        }
                        key={item["eventId"]}
                        className="memberEventList"
                      >
                        <div className="memberEventName">
                          {item["memberEventName"]}
                        </div>
                        <div className="memberEventDate">
                          {item["memberEventDate"]}
                        </div>
                        <div className="memberEventTime">
                          {item["memberEventTime"]}
                        </div>
                        <div className="memberEventPal">
                          {item["memberEventCurrentPal"] +
                            " / " +
                            item["memberEventMaxPal"]}
                        </div>
                        <div className="memberEventBtn">
                          <button
                            onClick={() => handleHoldContact(item)}
                            className="memberEventContact"
                          >
                            聯絡
                          </button>
                          <button
                            onClick={() => handleCancelMemberEvent(item)}
                            className="memberEventDelete"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;

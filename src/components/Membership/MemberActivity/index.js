import { useState } from "react";
// import { useLocation } from "react-router-dom";
import {
  auth,
  db,
  fetchData,
  deleteMemberEventData,
  updateCurrentPal,
  sendNotificationMessage,
} from "../../../firebase";
import { v4 as uuidv4 } from "uuid";
import { remove, ref, update } from "firebase/database";
import "../../styles/Membership/MemberActivity/index.css";
const Index = ({
  memberHoldEventList,
  memberJoinEventList,
  setMemberHoldEventList,
  setMemberJoinEventList,
  setShowContactBox,
  showContactBox,
  storeUserNameId,
}) => {
  // const location = useLocation();
  const [holdOrJoin, setHoldOrJoin] = useState(true);
  const [participantContact, setParticipantContact] = useState([]);
  const handleHoldOrJoin = () => {
    setHoldOrJoin(!holdOrJoin);
  };

  //delete the host event
  const handleDeleteMemberEvent = (item) => {
    const { memberEventDate, eventId, memberEventName } = item;
    const { displayName } = auth.currentUser;
    const eventRoute =
      "event/" + memberEventDate + "/" + eventId + "/eventParticipants/";
    fetchData(eventRoute).then((data) => {
      deleteMemberEventData(data, item);
      const message = `您在${memberEventDate}所參加的${memberEventName}活動，已被刪除`;
      sendNotificationMessage(item, data, uuidv4(), message);
    });
    remove(ref(db, "event/" + memberEventDate + "/" + eventId));
    remove(ref(db, "user/" + displayName + "/info/holdEvents/" + eventId));
    remove(ref(db, "discuss/" + eventId));

    setMemberHoldEventList(
      memberHoldEventList.filter((eventItem) => {
        return eventItem["eventId"] !== eventId;
      })
    );
  };
  // 參加的活動

  //cancel join event
  const handleCancelMemberEvent = (item) => {
    const { memberEventDate, eventId, memberEventName, memberEventCurrentPal } =
      item;
    const { displayName } = auth.currentUser;
    const currentPal = memberEventCurrentPal - 1;
    const eventParticipantsRoute =
      "event/" +
      memberEventDate +
      "/" +
      eventId +
      "/eventParticipants/" +
      displayName;
    remove(ref(db, eventParticipantsRoute));
    remove(ref(db, "user/" + displayName + "/info/joinEvents/" + eventId));
    update(ref(db, "event/" + memberEventDate + "/" + eventId), {
      eventCurrentPal: currentPal,
    });
    //update other participant data
    const participantsRoute =
      "event/" + memberEventDate + "/" + eventId + "/eventParticipants/";
    fetchData(participantsRoute).then((data) => {
      updateCurrentPal(data, item, currentPal);
      const message = `您在${memberEventDate}所參加的${memberEventName}活動，${displayName}已取消`;
      sendNotificationMessage(item, data, uuidv4(), message);
    });

    setMemberJoinEventList(
      memberJoinEventList.filter((eventItem) => {
        return eventItem["eventId"] !== eventId;
      })
    );
  };

  //contact info

  const handleHoldContact = (item) => {
    const { memberEventDate, eventId } = item;
    const participantRoute =
      "event/" + memberEventDate + "/" + eventId + "/eventParticipants";
    fetchData(participantRoute).then((data) => {
      const participantsList = Object.keys(data);
      const participantsInfoList = participantsList.map(async (item) => {
        return fetchData("user/" + item + "/info/").then((data) => data);
      });
      Promise.all(participantsInfoList).then((values) => {
        setParticipantContact(values);
      });
    });
    setShowContactBox(!showContactBox);
  };

  const handleParticipantCross = () => {
    setShowContactBox(!showContactBox);
  };

  return (
    <div className="memberEvents">
      <div
        className="participantContact"
        style={
          showContactBox ? { transform: "scale(1)" } : { transform: "scale(0)" }
        }
      >
        <div onClick={handleParticipantCross} className="participantCross">
          ｘ
        </div>
        <div className="participantListTitleItem">
          <div className="participantTitleName">姓名</div>
          <div className="participantTitleLineId">Line ID</div>
        </div>
        {participantContact
          ? participantContact.map((item) => {
              const { userId, lineId, name } = item;
              return (
                <div key={userId} className="participantListItem">
                  <div className="participantName">{name}</div>
                  <div className="participantLineId">
                    {lineId ? lineId : "無"}
                  </div>
                  <div
                    onClick={() => {
                      window.location =
                        "https://drinkgether.com/member/" + name;
                    }}
                    className="participantWebsiteLink"
                  >
                    {name}的個人頁面
                  </div>
                </div>
              );
            })
          : ""}
      </div>
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
                      holdOrJoin ? { display: "grid" } : { display: "none" }
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
                      holdOrJoin ? { display: "none" } : { display: "grid" }
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
  );
};

export default Index;

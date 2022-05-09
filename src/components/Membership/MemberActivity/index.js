import { useState } from "react";
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
const Index = ({
  storeUserNameId,
  memberHoldEventList,
  memberJoinEventList,
  setMemberHoldEventList,
  setMemberJoinEventList,
  setParticipantContact,
  setShowContactBox,
  showContactBox,
}) => {
  const [holdOrJoin, setHoldOrJoin] = useState(true);
  const handleHoldOrJoin = () => {
    setHoldOrJoin(!holdOrJoin);
  };
  //參與的酒吧活動

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
      eventCurrentPal: memberEventCurrentPal - 1,
    });
    //update other participant data
    const participantsRoute =
      "event/" + memberEventDate + "/" + eventId + "/eventParticipants/";
    fetchData(participantsRoute).then((data) => {
      updateCurrentPal(data, item);
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
  return (
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
  );
};

export default Index;

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { remove, ref, update } from "firebase/database";
import {
  auth,
  db,
  fetchData,
  deleteMemberEventData,
  updateCurrentPal,
  sendNotificationMessage,
} from "../../../firebase";
import useToggle from "../../../utils/customHook/useToggle";
import "../../../styles/Membership/MemberActivity/index.css";
const Index = ({
  memberHoldEventList,
  memberJoinEventList,
  setMemberHoldEventList,
  setMemberJoinEventList,
  setShowContactBox,
  showContactBox,
  storeUserNameId,
}) => {
  const [holdOrJoin, toggleHoldOrJoin] = useToggle(true);
  const [participantContact, setParticipantContact] = useState([]);
  //delete the host event
  const handleDeleteMemberEvent = (item) => {
    const { memberEventDate, eventId, memberEventName } = item;
    const { displayName } = auth.currentUser;
    const eventRoute =
      "event/" + memberEventDate + "/" + eventId + "/eventParticipants/";
    try {
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
    } catch (err) {
      console.error(err);
    }
  };

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
    try {
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
    } catch (err) {
      console.error(err);
    }
  };

  //contact info
  const handleHoldContact = (item) => {
    const { memberEventDate, eventId } = item;
    const participantRoute =
      "event/" + memberEventDate + "/" + eventId + "/eventParticipants";
    try {
      fetchData(participantRoute).then((data) => {
        const participantsList = Object.keys(data);
        const participantsInfoList = participantsList.map(async (item) => {
          return fetchData("user/" + item + "/info/");
        });
        Promise.all(participantsInfoList).then((values) => {
          setParticipantContact(values);
        });
      });
      setShowContactBox(!showContactBox);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="memberEvents">
      {auth.currentUser && auth.currentUser.displayName === storeUserNameId ? (
        <>
          <div
            className="participantContact"
            style={showContactBox ? { display: "flex" } : { display: "none" }}
          >
            <div
              onClick={() => setShowContactBox(!showContactBox)}
              className="participantCross"
            >
              ｘ
            </div>
            <div className="participantListTitleItem">
              <div className="participantTitleName">姓名</div>
              <div className="participantTitleLineId">Line ID</div>
            </div>
            {participantContact &&
              participantContact.map((item) => {
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
              })}
          </div>
          <div className="memberEventsContainer">
            <div className="eventHeader">
              <div
                onClick={toggleHoldOrJoin}
                style={
                  holdOrJoin
                    ? { backgroundColor: "#2f4858", color: "rgb(250,250,209)" }
                    : { backgroundColor: "rgb(250,250,209)", colo: "#2f4858" }
                }
                className="memberEventLaunch"
              >
                主辦的活動
              </div>
              <div
                onClick={toggleHoldOrJoin}
                style={
                  holdOrJoin
                    ? { backgroundColor: "rgb(250,250,209)", colo: "#2f4858" }
                    : { backgroundColor: "#2f4858", color: "rgb(250,250,209)" }
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
              {memberHoldEventList &&
                memberHoldEventList.map((item) => {
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
                })}
              {memberJoinEventList &&
                memberJoinEventList.map((item) => {
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
                })}
            </div>
          </div>
        </>
      ) : (
        <div className="memberActivityNoUser">Coming Soon</div>
      )}
    </div>
  );
};

export default Index;

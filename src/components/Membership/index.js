import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { sortEventList } from "../../utils/utilities";
import { auth, dbRef } from "../../firebase.js";
import { getStorage, getDownloadURL, ref as sRef } from "firebase/storage";
import { get, child } from "firebase/database";
import BarRecommend from "./BarRecommend";
import MemberInfo from "./MemberInfo";
import MemberActivity from "./MemberActivity";
import "../styles/Membership/index.css";

const Index = () => {
  const location = useLocation();
  const [memberHoldEventList, setMemberHoldEventList] = useState([]);
  const [memberJoinEventList, setMemberJoinEventList] = useState([]);
  const [participantContact, setParticipantContact] = useState([]);
  const [showContactBox, setShowContactBox] = useState(false);
  const [storeUserNameId, setStoreUserNameId] = useState("");
  const [barRecommendArr, setBarRecommendArr] = useState([]);
  const [lineIdAllOption, setLineIdAllOption] = useState(false);
  const [showLineId, setShowLineId] = useState(false);
  const [storeImg, setStoreImg] = useState(null);
  const [memberUpdateData, setMemberUpdateDate] = useState({
    job: "",
    passion: "",
    sex: "",
    about: "",
    password: "",
    phone: "",
    lineId: "",
  });

  useEffect(() => {
    const userNameId = location.pathname.split("/member/")[1];
    setStoreUserNameId(userNameId);
    //clean previous user data
    setMemberHoldEventList(null);
    setMemberJoinEventList(null);
    setBarRecommendArr(null);
    setStoreImg(null);
    get(child(dbRef, "user/" + userNameId)).then((snapshot) => {
      if (snapshot.exists()) {
        //send info data to MemberInfo
        const { info, BarRecommend } = snapshot.val();
        setMemberUpdateDate(info);
        // check line id is open or not
        const { lineIdForAll } = info;
        setLineIdAllOption(lineIdForAll);
        if (lineIdForAll) {
          setShowLineId((preState) => (preState = lineIdForAll));
        }
        //check the headshot is exist or not
        const storage = getStorage();
        const pathReference = sRef(storage, auth.currentUser.displayName);
        getDownloadURL(pathReference)
          .then((res) => {
            setStoreImg(res);
          })
          .catch((err) => {
            return;
          });
        const decodeNameId = decodeURIComponent(storeUserNameId);
        setStoreUserNameId(decodeNameId);
        //check have join/hold event, bar recommend list
        if (info["joinEvents"]) {
          const joinEventsList = sortEventList(info["joinEvents"]);
          setMemberJoinEventList(joinEventsList);
        }
        if (info["holdEvents"]) {
          const holdEventsList = sortEventList(info["holdEvents"]);
          setMemberHoldEventList(holdEventsList);
        }
        if (BarRecommend) {
          const barRecommendIdList = Object.keys(BarRecommend);
          const barRecommendList = barRecommendIdList.map((item) => {
            return BarRecommend[item];
          });
          setBarRecommendArr(barRecommendList);
        }
      } else {
        return;
      }
    });
  }, [location.pathname, storeUserNameId]);
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
        <MemberInfo
          storeUserNameId={storeUserNameId}
          memberUpdateData={memberUpdateData}
          setMemberUpdateDate={setMemberUpdateDate}
          showLineId={showLineId}
          setShowLineId={setShowLineId}
          lineIdAllOption={lineIdAllOption}
          setLineIdAllOption={setLineIdAllOption}
          storeImg={storeImg}
          setStoreImg={setStoreImg}
        />

        <BarRecommend
          barRecommendArr={barRecommendArr}
          setBarRecommendArr={setBarRecommendArr}
        />
        <MemberActivity
          storeUserNameId={storeUserNameId}
          memberHoldEventList={memberHoldEventList}
          memberJoinEventList={memberJoinEventList}
          setMemberHoldEventList={setMemberHoldEventList}
          setMemberJoinEventList={setMemberJoinEventList}
          setParticipantContact={setParticipantContact}
          setShowContactBox={setShowContactBox}
          showContactBox={showContactBox}
        />
      </section>
    </>
  );
};

export default Index;

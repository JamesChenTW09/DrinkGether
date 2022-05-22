import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { getStorage, getDownloadURL, ref as sRef } from "firebase/storage";
import { get, child } from "firebase/database";
import { sortMemberEventList } from "../../utils/utilities";
import { dbRef } from "../../firebase.js";
import BarRecommend from "./BarRecommend";
import MemberInfo from "./MemberInfo";
import MemberActivity from "./MemberActivity";
import "../styles/Membership/index.css";

const Index = () => {
  const location = useLocation();
  const [memberHoldEventList, setMemberHoldEventList] = useState([]);
  const [memberJoinEventList, setMemberJoinEventList] = useState([]);
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

  const fetchMemberInitialData = useCallback(() => {
    const userNameId = location.pathname.split("/member/")[1];
    const decodeNameId = decodeURIComponent(userNameId);
    setStoreUserNameId(decodeNameId);

    get(child(dbRef, "user/" + decodeNameId)).then((snapshot) => {
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
        const pathReference = sRef(storage, decodeNameId);
        getDownloadURL(pathReference)
          .then((res) => {
            setStoreImg(res);
          })
          .catch((err) => {});
        //check have join/hold event, bar recommend list

        if (info["joinEvents"]) {
          const joinEventsList = sortMemberEventList(info["joinEvents"]);
          setMemberJoinEventList(joinEventsList);
        }
        if (info["holdEvents"]) {
          const holdEventsList = sortMemberEventList(info["holdEvents"]);
          setMemberHoldEventList(holdEventsList);
        }
        if (BarRecommend) {
          const barRecommendIdList = Object.keys(BarRecommend);
          const barRecommendList = barRecommendIdList.map((item) => {
            return BarRecommend[item];
          });
          setBarRecommendArr(barRecommendList);
        }
      }
    });
  }, [location.pathname]);

  useEffect(() => {
    //clean previous user data
    setMemberHoldEventList([]);
    setMemberJoinEventList([]);
    setBarRecommendArr([]);
    setStoreImg([]);
    fetchMemberInitialData();
  }, [fetchMemberInitialData]);

  return (
    <>
      <section className="memberContainer">
        <MemberInfo
          storeUserNameId={storeUserNameId}
          setStoreUserNameId={setStoreUserNameId}
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
          setStoreUserNameId={setStoreUserNameId}
          memberHoldEventList={memberHoldEventList}
          memberJoinEventList={memberJoinEventList}
          setMemberHoldEventList={setMemberHoldEventList}
          setMemberJoinEventList={setMemberJoinEventList}
          setShowContactBox={setShowContactBox}
          showContactBox={showContactBox}
        />
      </section>
    </>
  );
};

export default Index;

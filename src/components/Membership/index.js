import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getStorage, getDownloadURL, ref as sRef } from "firebase/storage";
import { onValue, ref } from "firebase/database";
import { sortMemberEventList } from "../../utils/utilities";
import { db } from "../../firebase.js";
import BarRecommend from "./BarRecommend";
import MemberInfo from "./MemberInfo";
import MemberActivity from "./MemberActivity";
import "../../styles/Membership/index.css";

const Index = () => {
  const location = useLocation();
  const memberRef = useRef();
  const [memberHoldEventList, setMemberHoldEventList] = useState([]);
  const [memberJoinEventList, setMemberJoinEventList] = useState([]);
  const [showContactBox, setShowContactBox] = useState(false);
  const [storeUserNameId, setStoreUserNameId] = useState("");
  const [barRecommendArr, setBarRecommendArr] = useState([]);
  const [lineIdAllOption, setLineIdAllOption] = useState(false);

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

    const userRoute = ref(db, "user/" + decodeNameId);
    try {
      onValue(userRoute, (snapshot) => {
        //send info data to MemberInfo
        const { info, BarRecommend } = snapshot.val();
        setMemberUpdateDate(info);
        // check line id is open or not
        const { lineIdForAll } = info;
        setLineIdAllOption(lineIdForAll);

        //check the headshot is exist or not
        const storage = getStorage();
        const pathReference = sRef(storage, decodeNameId);
        getDownloadURL(pathReference)
          .then((res) => {
            console.log(res);
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
      });
    } catch (err) {
      console.error(err);
    }
  }, [location.pathname]);

  useEffect(() => {
    memberRef.current.scrollIntoView();
    //clean previous user data
    setMemberHoldEventList([]);
    setMemberJoinEventList([]);
    setBarRecommendArr([]);
    setStoreImg([]);
    fetchMemberInitialData();
  }, [fetchMemberInitialData]);

  return (
    <>
      <section className="memberContainer" ref={memberRef}>
        <MemberInfo
          storeUserNameId={storeUserNameId}
          setStoreUserNameId={setStoreUserNameId}
          memberUpdateData={memberUpdateData}
          setMemberUpdateDate={setMemberUpdateDate}
          lineIdAllOption={lineIdAllOption}
          setLineIdAllOption={setLineIdAllOption}
          storeImg={storeImg}
          setStoreImg={setStoreImg}
        />

        <BarRecommend
          storeUserNameId={storeUserNameId}
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

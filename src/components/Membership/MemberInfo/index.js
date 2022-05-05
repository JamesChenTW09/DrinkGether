import React, { useState, useEffect, useCallback } from "react";
import { getDatabase, ref, update, get, child } from "firebase/database";
import { auth } from "../../../firebase.js";
import "../../styles/Membership/index.css";
import photo from "../../styles/photos/beer.jpg";
const Index = ({ storeUserNameId }) => {
  //handle info is editable or not
  const [textEditable, setTextEditable] = useState(true);
  const handleTextEditable = () => {
    setTextEditable((preState) => !preState);
    setModifyInfo((preState) => !preState);
  };
  //handle show privateInfo or publicInfo
  const [infoPrivateOrPublic, setInfoPrivateOrPublic] = useState(true);
  const handleSecretInfo = () => {
    setInfoPrivateOrPublic((preState) => !preState);
  };

  //handle line id circel for everyone
  const [lineIdAllOption, setLineIdAllOption] = useState(false);
  const handleMoveAllLineIdCircle = () => {
    if (textEditable) {
      return;
    }
    setLineIdAllOption(!lineIdAllOption);
  };

  //get the data user type
  const [memberUpdateData, setMemberUpdateDate] = useState({
    job: "",
    passion: "",
    sex: "",
    about: "",
    password: "",
    phone: "",
    lineId: "",
  });
  const { name, email, job, passion, sex, about, password, phone, lineId } =
    memberUpdateData;
  const handleMemberUpdateData = (e) => {
    setMemberUpdateDate({
      ...memberUpdateData,
      [e.target.name]: e.target.value,
    });
  };
  //handle show pen or check
  const [modifyInfo, setModifyInfo] = useState(false);
  const handleCompleteEdit = () => {
    const db = getDatabase();
    update(ref(db, "user/" + auth.currentUser.displayName + "/info/"), {
      job,
      passion,
      sex,
      about,
      password,
      phone,
      lineId,
      lineIdForAll: lineIdAllOption,
    });
    setTextEditable((preState) => !preState);
    setModifyInfo((preState) => !preState);
    if (lineIdAllOption) {
      setShowLineId((preState) => (preState = lineIdAllOption));
    } else {
      setShowLineId((preState) => (preState = false));
    }
  };
  const fetchUserData = useCallback(() => {
    if (auth.currentUser && storeUserNameId) {
      const dbRef = ref(getDatabase());
      get(child(dbRef, "user/" + storeUserNameId)).then((snapshot) => {
        const { lineIdForAll } = snapshot.val()["info"];
        setLineIdAllOption(lineIdForAll);
        if (lineIdForAll) {
          setShowLineId((preState) => (preState = lineIdForAll));
        }

        setMemberUpdateDate(snapshot.val()["info"]);
      });
    } else {
      setTimeout(() => {
        fetchUserData();
      }, 200);
    }
  }, [storeUserNameId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  //handle show line id
  const [showLineId, setShowLineId] = useState(false);
  const handleShowLineId = () => {
    setShowLineId(!showLineId);
  };

  return (
    <>
      <div className="basicInfo">
        <div className="memberImg">
          <img src={photo} alt="" />
        </div>
        <div className="memberProfile">
          <div className="memberInfoTitle">
            <h3>
              My Profile
              <i
                onClick={handleTextEditable}
                class="fa-solid fa-pen"
                style={
                  (modifyInfo ? { display: "none" } : { display: "inline" },
                  auth.currentUser
                    ? storeUserNameId === auth.currentUser.displayName
                      ? { display: "inline" }
                      : { display: "none" }
                    : { display: "none" })
                }
              ></i>
              <i
                onClick={handleCompleteEdit}
                class="fa-solid fa-check"
                style={modifyInfo ? { display: "inline" } : { display: "none" }}
              ></i>
            </h3>

            <div
              style={
                auth.currentUser
                  ? storeUserNameId === auth.currentUser.displayName
                    ? { display: "inline" }
                    : { display: "none" }
                  : { display: "none" }
              }
              className="PrivatePublicBtn"
            >
              <button onClick={handleSecretInfo}>
                {infoPrivateOrPublic ? "Public" : "Private"}
                <i class="fa-solid fa-user-pen"></i>
              </button>
            </div>
          </div>

          <div
            className="privateInfo"
            style={
              infoPrivateOrPublic ? { display: "none" } : { display: "block" }
            }
          >
            <div className="memberEmail">
              <h4>Email</h4>
              <textarea value={email} maxLength={10} readOnly></textarea>
            </div>
            <div className="memberPassword">
              <h4>Password</h4>
              <textarea
                value={password}
                name="password"
                onChange={handleMemberUpdateData}
                maxLength={10}
                readOnly={textEditable}
              ></textarea>
            </div>
            <div className="memberOption">
              <h4>是否公開以下資訊給所有訪客</h4>
              <div className="memberOptionLindId">
                <p>Line ID</p>
                <span>不公開</span>
                <div className="memberOptionContainer">
                  <div
                    style={
                      lineIdAllOption
                        ? { transform: "translate(20px)" }
                        : { transform: "translate(0px)" }
                    }
                    onClick={handleMoveAllLineIdCircle}
                    className="memberOptionCircle"
                  ></div>
                </div>
                <span>公開</span>
              </div>
            </div>
          </div>
          <div
            className="publicInfo"
            style={
              infoPrivateOrPublic ? { display: "block" } : { display: "none" }
            }
          >
            <div className="memberName">
              <h4>Name</h4>
              <textarea value={name} maxLength={10} readOnly></textarea>
              <div className="memberSex">
                <h4>Sex</h4>
                <textarea
                  value={sex}
                  name="sex"
                  onChange={handleMemberUpdateData}
                  readOnly={textEditable}
                ></textarea>
              </div>
            </div>
            <div className="memberLineId">
              <h4>Line ID</h4>
              <input
                value={lineId}
                name="lineId"
                onChange={handleMemberUpdateData}
                maxLength={10}
                readOnly={textEditable}
                type={showLineId ? "text" : "password"}
              />

              <img
                style={
                  auth.currentUser
                    ? storeUserNameId === auth.currentUser.displayName
                      ? { display: "inline" }
                      : { display: "none" }
                    : { display: "none" }
                }
                onClick={handleShowLineId}
                className=" memberTogglePassword"
                src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/000000/external-transparency-marketing-agency-flaticons-lineal-color-flat-icons-2.png"
                alt=""
              />
              <div
                style={
                  auth.currentUser
                    ? storeUserNameId === auth.currentUser.displayName
                      ? { display: "inline" }
                      : { display: "none" }
                    : { display: "none" }
                }
                onClick={handleShowLineId}
                className="memberPasswordLine"
              ></div>
            </div>
            <div className="memberJob">
              <h4>Job</h4>
              <textarea
                value={job}
                name="job"
                onChange={handleMemberUpdateData}
                readOnly={textEditable}
              ></textarea>
            </div>
            <div className="memberPassion">
              <h4>Passion</h4>
              <textarea
                value={passion}
                name="passion"
                onChange={handleMemberUpdateData}
                readOnly={textEditable}
              ></textarea>
            </div>
            <div className="memberAboutMe">
              <h4>About</h4>
              <textarea
                value={about}
                name="about"
                onChange={handleMemberUpdateData}
                readOnly={textEditable}
                className="memberAboutMeContent"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;

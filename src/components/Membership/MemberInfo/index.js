import React, { useState, useRef } from "react";
import { update, ref } from "firebase/database";
import { getStorage, uploadBytes, ref as sRef } from "firebase/storage";
import { auth, db } from "../../../firebase.js";
import "../../../styles/Membership/MemberInfo/index.css";
const Index = ({
  storeUserNameId,
  memberUpdateData,
  setMemberUpdateDate,
  lineIdAllOption,
  setLineIdAllOption,
  storeImg,
  setStoreImg,
}) => {
  //photo
  const photo = useRef({});
  const handleChangePhoto = () => {
    photo.current["imgInput"].click();
  };

  const handleUploadImg = (e) => {
    const file = e.target.files[0];
    const blobURL = URL.createObjectURL(file);
    const img = new Image();
    img.src = blobURL;
    img.onload = function () {
      setStoreImg(null);
      const canvas = photo.current["canvasPhoto"];
      const ctx = canvas.getContext("2d");
      canvas.width = 250;
      canvas.height = 300;
      ctx.drawImage(img, 0, 0, 250, 300);
      canvas.toBlob(
        (blob) => {
          try {
            const storage = getStorage();
            const storageRef = sRef(storage, auth.currentUser.displayName);
            uploadBytes(storageRef, blob);
          } catch (err) {
            console.error(err);
          }
        },
        "image/jpeg",
        0.6
      );
    };
  };
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

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword((preState) => !preState);
  };

  //handle line id circle for everyone
  const handleMoveAllLineIdCircle = () => {
    if (textEditable) {
      return;
    }
    setLineIdAllOption(!lineIdAllOption);
  };

  //get the data user type
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
    try {
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="basicInfo">
        <div className="memberImg">
          <div
            className="headShot"
            ref={(el) => (photo.current = { ...photo.current, finalImg: el })}
          >
            {storeImg && <img alt="headShot" src={storeImg}></img>}

            <canvas
              style={storeImg ? { display: "none" } : { display: "block" }}
              ref={(el) =>
                (photo.current = { ...photo.current, canvasPhoto: el })
              }
            ></canvas>
          </div>
          {auth.currentUser &&
          storeUserNameId === auth.currentUser.displayName ? (
            <div className="cameraIconBox" onClick={handleChangePhoto}>
              <i class="fa-solid fa-camera">
                <input
                  onChange={(e) => handleUploadImg(e)}
                  ref={(el) =>
                    (photo.current = { ...photo.current, imgInput: el })
                  }
                  type="file"
                  hidden
                />
              </i>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="memberProfile">
          <div className="memberInfoTitle">
            <h3>
              My Profile
              {auth.currentUser &&
              auth.currentUser.displayName === storeUserNameId ? (
                <>
                  <i
                    onMouseDown={handleTextEditable}
                    class="fa-solid fa-pen"
                    style={
                      modifyInfo ? { display: "none" } : { display: "inline" }
                    }
                  ></i>
                  <i
                    onClick={handleCompleteEdit}
                    class="fa-solid fa-check"
                    style={
                      modifyInfo ? { display: "inline" } : { display: "none" }
                    }
                  ></i>
                </>
              ) : (
                <></>
              )}
            </h3>
            {auth.currentUser &&
            auth.currentUser.displayName === storeUserNameId ? (
              <div className="PrivatePublicBtn">
                <button onClick={handleSecretInfo}>
                  {infoPrivateOrPublic ? "Public" : "Private"}
                  <i class="fa-solid fa-user-pen"></i>
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
          {auth.currentUser &&
          storeUserNameId === auth.currentUser.displayName ? (
            <div
              className="privateInfo"
              style={
                infoPrivateOrPublic ? { display: "none" } : { display: "block" }
              }
            >
              <div className="memberEmail inputAndTitle">
                <h4 className="memberInputTitle">Email</h4>
                <textarea
                  className="memberInput"
                  value={email}
                  readOnly
                ></textarea>
              </div>
              <div className="memberLineId inputAndTitle">
                <h4 className="memberInputTitle">Line ID</h4>
                <input
                  className="memberInput"
                  value={lineId}
                  name="lineId"
                  onChange={handleMemberUpdateData}
                  maxLength={20}
                  readOnly={textEditable}
                  type="text"
                />
              </div>
              <div className="memberPassword inputAndTitle">
                <h4 className="memberInputTitle">Password</h4>
                {password && password === "google.com" ? (
                  <input
                    className="memberInput"
                    value=""
                    name="password"
                    type="text"
                    readOnly
                  ></input>
                ) : (
                  <>
                    <input
                      className="memberInput"
                      value={password}
                      name="password"
                      onChange={handleMemberUpdateData}
                      maxLength={20}
                      type={showPassword ? "text" : "password"}
                      readOnly={textEditable}
                    ></input>
                    <img
                      onClick={handleShowPassword}
                      className=" memberTogglePassword"
                      src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/000000/external-transparency-marketing-agency-flaticons-lineal-color-flat-icons-2.png"
                      alt=""
                    />
                    <div
                      onClick={handleShowPassword}
                      className="memberPasswordLine"
                      style={
                        showPassword
                          ? { display: "none" }
                          : { display: "block" }
                      }
                    ></div>
                  </>
                )}
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
          ) : (
            <></>
          )}

          <div
            className="publicInfo"
            style={
              infoPrivateOrPublic ? { display: "block" } : { display: "none" }
            }
          >
            <div className="memberName">
              <h4>Name</h4>
              <textarea value={name} readOnly></textarea>
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
            {lineIdAllOption && lineIdAllOption ? (
              <div className="memberLineId inputAndTitle">
                <h4 className="memberInputTitle">Line ID</h4>
                <input
                  className="memberInput"
                  value={lineId}
                  readOnly
                  type="text"
                />
              </div>
            ) : (
              <></>
            )}

            <div className="memberJob inputAndTitle">
              <h4 className="memberInputTitle">Job</h4>
              <textarea
                className="memberInput"
                value={job}
                name="job"
                onChange={handleMemberUpdateData}
                readOnly={textEditable}
              ></textarea>
            </div>
            <div className="memberPassion inputAndTitle">
              <h4 className="memberInputTitle">Passion</h4>
              <textarea
                className="memberInput"
                value={passion}
                name="passion"
                onChange={handleMemberUpdateData}
                readOnly={textEditable}
              ></textarea>
            </div>
            <div className="memberAboutMe">
              <h4 className="memberInputTitle">About</h4>
              <textarea
                value={about}
                name="about"
                onChange={handleMemberUpdateData}
                readOnly={textEditable}
                className="memberAboutMeContent memberInput"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;

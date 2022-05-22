import React, { useState, useRef } from "react";
import { update, ref } from "firebase/database";
import { getStorage, uploadBytes, ref as sRef } from "firebase/storage";
import { auth, db } from "../../../firebase.js";
import { checkUserOrVisitor } from "../../../utils/utilities";
import "../../styles/Membership/MemberInfo/index.css";
const Index = ({
  storeUserNameId,
  memberUpdateData,
  setMemberUpdateDate,
  showLineId,
  setShowLineId,
  lineIdAllOption,
  setLineIdAllOption,
  storeImg,
  setStoreImg,
}) => {
  //photo
  const imgInput = useRef();
  const finalImg = useRef();
  const canvasPhoto = useRef();
  const handleChangePhoto = () => {
    imgInput.current.click();
  };

  const handleUploadImg = (e) => {
    const file = e.target.files[0];
    const blobURL = URL.createObjectURL(file);
    const img = new Image();
    img.src = blobURL;
    img.onload = function () {
      setStoreImg(null);
      const canvas = canvasPhoto.current;
      const ctx = canvas.getContext("2d");
      canvas.width = 300;
      canvas.height = 300;
      ctx.drawImage(img, 0, 0, 300, 300);
      canvas.toBlob(
        (blob) => {
          const storage = getStorage();
          const storageRef = sRef(storage, auth.currentUser.displayName);
          uploadBytes(storageRef, blob);
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
  //handle show line id
  const handleShowLineId = () => {
    setShowLineId(!showLineId);
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

  return (
    <>
      <div className="basicInfo">
        <div className="memberImg">
          <div className="headShot" ref={finalImg}>
            {storeImg && <img alt="headShot" src={storeImg}></img>}
            <canvas
              style={storeImg ? { display: "none" } : { display: "block" }}
              ref={canvasPhoto}
            ></canvas>
          </div>
          <div
            className="cameraIconBox"
            onClick={handleChangePhoto}
            style={checkUserOrVisitor("flex", "none", storeUserNameId)}
          >
            <i class="fa-solid fa-camera">
              <input
                onChange={(e) => handleUploadImg(e)}
                ref={imgInput}
                type="file"
                hidden
              />
            </i>
          </div>
        </div>
        <div className="memberProfile">
          <div className="memberInfoTitle">
            <h3>
              My Profile
              <i
                onMouseDown={handleTextEditable}
                class="fa-solid fa-pen"
                style={
                  (modifyInfo ? { display: "none" } : { display: "inline" },
                  checkUserOrVisitor("inline", "none", storeUserNameId))
                }
              ></i>
              <i
                onClick={handleCompleteEdit}
                class="fa-solid fa-check"
                style={modifyInfo ? { display: "inline" } : { display: "none" }}
              ></i>
            </h3>

            <div
              style={checkUserOrVisitor("inline", "none", storeUserNameId)}
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
            <div className="memberEmail inputAndTitle">
              <h4 className="memberInputTitle">Email</h4>
              <textarea
                className="memberInput"
                value={email}
                maxLength={10}
                readOnly
              ></textarea>
            </div>
            <div className="memberPassword inputAndTitle">
              <h4 className="memberInputTitle">Password</h4>
              <input
                className="memberInput"
                value={password}
                name="password"
                onChange={handleMemberUpdateData}
                maxLength={10}
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
                  showPassword ? { display: "none" } : { display: "block" }
                }
              ></div>
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
            <div className="memberLineId inputAndTitle">
              <h4 className="memberInputTitle">Line ID</h4>
              <input
                className="memberInput"
                value={lineId}
                name="lineId"
                onChange={handleMemberUpdateData}
                maxLength={10}
                readOnly={textEditable}
                type={showLineId ? "text" : "password"}
              />

              <img
                style={checkUserOrVisitor("inline", "none", storeUserNameId)}
                onClick={handleShowLineId}
                className=" memberTogglePassword"
                src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/000000/external-transparency-marketing-agency-flaticons-lineal-color-flat-icons-2.png"
                alt=""
              />
              <div
                style={
                  (checkUserOrVisitor("inline", "none", storeUserNameId),
                  showLineId ? { display: "none" } : { display: "inline" })
                }
                onClick={handleShowLineId}
                className="memberPasswordLine"
              ></div>
            </div>
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

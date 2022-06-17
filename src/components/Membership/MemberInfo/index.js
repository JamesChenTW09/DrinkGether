import { update, ref } from "firebase/database";
import { auth, db } from "../../../firebase.js";
import InfoImage from "./InfoImage";
import useToggle from "../../../utils/customHook/useToggle.js";
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
  //handle info is editable or not
  const [textEditable, toggleTextEditable] = useToggle(true);
  const handleTextEditable = () => {
    toggleTextEditable();
    toggleModifyInfo();
  };
  //handle show privateInfo or publicInfo

  const [infoPrivateOrPublic, toggleInfoPrivateOrPublic] = useToggle(true);
  const [showPassword, toggleShowPassword] = useToggle(false);

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
  const [modifyInfo, toggleModifyInfo] = useToggle(false);
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
      toggleTextEditable();
      toggleModifyInfo();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="basicInfo">
        <InfoImage
          storeImg={storeImg}
          setStoreImg={setStoreImg}
          storeUserNameId={storeUserNameId}
        />
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
                <button onClick={toggleInfoPrivateOrPublic}>
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
                      onClick={toggleShowPassword}
                      className=" memberTogglePassword"
                      src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/000000/external-transparency-marketing-agency-flaticons-lineal-color-flat-icons-2.png"
                      alt=""
                    />
                    <div
                      onClick={toggleShowPassword}
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
            <div className="memberName inputAndTitle">
              <h4 className="memberInputTitle">Name</h4>
              <textarea
                className="memberInput"
                value={name}
                readOnly
              ></textarea>
            </div>
            <div className="inputAndTitle">
              <h4 className="memberInputTitle">Sex</h4>
              <textarea
                value={sex}
                className="memberInput"
                name="sex"
                onChange={handleMemberUpdateData}
                maxLength={1}
                readOnly={textEditable}
              ></textarea>
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
                maxLength={20}
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
                maxLength={30}
                readOnly={textEditable}
              ></textarea>
            </div>
            <div className="memberAboutMe">
              <h4 className="memberInputTitle">About</h4>
              <textarea
                value={about}
                name="about"
                maxLength={100}
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

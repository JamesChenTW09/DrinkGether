import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { ref, remove, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import GlobalContext from "../../../../../../context/GlobalContext";
import { auth, db } from "../../../../../../firebase";
import "../../../../../../styles/Navbar/LogInSignUp/index.css";

const Index = ({ handleAccountBoxCross }) => {
  const {
    storeNotificationMessage,
    setStoreNotificationMessage,
    greetingName,
    accountProcessing,
    setAccountProcessing,
  } = useContext(GlobalContext);
  const navigate = useNavigate();
  const { logInGreeting } = accountProcessing;

  //logout button
  const handleLogOutBtn = () => {
    setAccountProcessing({
      ...accountProcessing,
      logIn: true,
      logInGreeting: false,
      signUpGreeting: false,
    });
    const { displayName } = auth.currentUser;
    try {
      update(ref(db, "user/" + displayName + "/info/"), {
        isOnline: false,
      });
      signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  //drag
  const drag = (e, item) => {
    e.dataTransfer.setData("text", item["uuid"]);
  };
  const allowDrop = (e) => {
    e.preventDefault();
  };

  const drop = (e) => {
    e.preventDefault();
    const deleteId = e.dataTransfer.getData("text");
    const { displayName } = auth.currentUser;
    setStoreNotificationMessage((preState) =>
      preState.filter((item) => {
        return item["uuid"] !== deleteId;
      })
    );
    try {
      remove(ref(db, "user/" + displayName + "/info/notification/" + deleteId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={logInGreeting ? { display: "flex" } : { display: "none" }}
      className="logInGreeting"
    >
      Have a Good Day<div>{greetingName}</div>
      <div className="greetingBtnBox">
        <button onClick={handleAccountBoxCross}>繼續瀏覽</button>
        <button
          onClick={() => navigate("/member/" + auth.currentUser.displayName)}
        >
          會員頁面
        </button>
        <button onClick={handleLogOutBtn}>登出</button>
      </div>
      <div className="notificationBox">
        <div className="notificationHeader">New Message</div>
        <div className="notificationListBox">
          {storeNotificationMessage
            ? storeNotificationMessage.map((item) => {
                const { uuid, message, nowTime } = item;
                return (
                  <div
                    key={uuid}
                    className="notificationItem"
                    draggable={true}
                    onDragStart={(e) => drag(e, item)}
                  >
                    <p>{message}</p>
                    <div className="notificationTime">{nowTime}</div>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
      <div
        onDrop={(e) => drop(e)}
        onDragOver={(e) => allowDrop(e)}
        className="notificationDelete"
      >
        <div>Drop Here to Delete</div>
      </div>
    </div>
  );
};

export default Index;

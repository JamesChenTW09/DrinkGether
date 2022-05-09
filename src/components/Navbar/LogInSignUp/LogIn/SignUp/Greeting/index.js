import React, { useContext } from "react";
import GlobalContext from "../../../../../../context/GlobalContext";
import { signOut } from "firebase/auth";
import { ref, getDatabase, remove, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../../../../firebase";
import "../../../../../styles/Navbar/LogInSignUp/index.css";

const Index = ({ handleAccountBoxCross }) => {
  const {
    storeNotificationMessage,
    setStoreNotificationMessage,
    greetingName,
    accountProcessing,
    setAccountProcessing,
  } = useContext(GlobalContext);
  const { logInGreeting } = accountProcessing;
  //navigate to member Page
  const navigate = useNavigate();
  //logout button
  const handleLogOutBtn = () => {
    setAccountProcessing({
      ...accountProcessing,
      logIn: true,
      logInGreeting: false,
      signUpGreeting: false,
    });
    const { displayName } = auth.currentUser;
    update(ref(db, "user/" + displayName + "/info/"), {
      isOnline: false,
    });
    signOut(auth)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
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
    setStoreNotificationMessage((preState) =>
      preState.filter((item) => {
        return item["uuid"] !== deleteId;
      })
    );
    const db = getDatabase();
    remove(
      ref(
        db,
        "user/" +
          auth.currentUser.displayName +
          "/info/notification/" +
          deleteId
      )
    );
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
                return (
                  <div
                    className="notificationItem"
                    draggable={true}
                    onDragStart={(e) => drag(e, item)}
                  >
                    <p>{item["message"]}</p>
                    <div className="notificationTime">{item["nowTime"]}</div>
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

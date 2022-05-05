import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get, child } from "firebase/database";
import { auth } from "../../firebase.js";
import LogInSignUp from "./LogInSignUp/LogIn";
import GlobalContext from "../../context/GlobalContext";
import "../styles/Navbar/index.css";

const Index = () => {
  const {
    showLogIn1,
    setShowLogIn1,
    setGreetingName,
    accountProcessing,
    setAccountProcessing,
  } = useContext(GlobalContext);

  // login button click and the login box show

  const handleClick = () => {
    if (showLogIn1 === "0px") {
      setShowLogIn1("360px");
    }
    setShowLogIn1("0px");

    // show greeting box if its logged in
    if (auth.currentUser) {
      setAccountProcessing({
        ...accountProcessing,
        logIn: false,
        logInGreeting: true,
        signUpGreeting: false,
      });
      setGreetingName(auth.currentUser.displayName);
    }
  };

  // canvas painting
  // const canvasRef = useRef(null);
  // function canvasPainting() {
  //   const canvasDrawing = canvasRef.current;
  //   const ctx = canvasDrawing.getContext("2d");

  //   canvasDrawing.width = window.screen.width;
  //   canvasDrawing.height = 200;

  //   ctx.fillStyle = "rgb(130, 130, 130)";

  //   ctx.beginPath();
  //   ctx.moveTo(450, 0);
  //   ctx.bezierCurveTo(700, 250, 900, 50, 1250, 0);
  //   ctx.fill();
  // }
  //handle account button shows login or account
  const [logInBtnText, setLogInBtnText] = useState("Login");
  const [notificationMessage, setNotificationMessage] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLogInBtnText("Account");
        const db = getDatabase();
        const dbref = ref(db);
        get(
          child(
            dbref,
            "user/" + auth.currentUser.displayName + "/info/notification"
          )
        ).then((snapshot) => {
          if (snapshot.exists()) {
            const notificationIdList = Object.keys(snapshot.val());
            const notificationTime = notificationIdList.map((item) => {
              return snapshot.val()[item]["nowTime"];
            });
            notificationTime.sort().reverse();
            let notificationFianlArr = [];
            for (let i = 0; i < notificationTime.length; i++) {
              for (let j = 0; j < notificationIdList.length; j++) {
                if (
                  notificationTime[i] ===
                  snapshot.val()[notificationIdList[j]]["nowTime"]
                ) {
                  notificationFianlArr.push(
                    snapshot.val()[notificationIdList[j]]
                  );
                  notificationIdList.splice(j, 1);
                  break;
                }
              }
            }
            console.log(11);
            setNotificationMessage(notificationFianlArr);
          }
        });
      } else {
        setLogInBtnText("Login");
      }
    });
    // canvasPainting();
  }, []);

  // nav click and scroll
  const navigate = useNavigate();

  return (
    <>
      {/* <canvas ref={canvasRef}></canvas> */}
      <section className="bannerImg">
        <div className="backgroundShadow"></div>
      </section>
      <nav>
        <h1 onClick={() => navigate("/")}>DrinkGether</h1>
        <ul>
          <li onClick={() => navigate("/")}>Main</li>
          <li onClick={() => navigate("/activity")}>Quick Start</li>
          <li>FAQ</li>
        </ul>
        <button onClick={handleClick}>
          {logInBtnText}
          <div className="newMessageMark">!</div>
        </button>
      </nav>
      <LogInSignUp
        notificationMessage={notificationMessage}
        setNotificationMessage={setNotificationMessage}
      />
      <section className="bannerContent">
        <h2>Meet People</h2>
        <h2>Dicsover Places</h2>
        <h2>Enjoy Time</h2>
        <button onClick={() => navigate("/activity")}>Let's Start</button>
      </section>
    </>
  );
};

export default Index;

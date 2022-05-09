import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { orderByTime } from "../../utils/utilities";
import { auth, fetchData } from "../../firebase.js";
import LogInSignUp from "./LogInSignUp/LogIn/";
import GlobalContext from "../../context/GlobalContext";
import "../styles/Navbar/index.css";

const Index = () => {
  const {
    setShowLogInBox,
    setGreetingName,
    accountProcessing,
    setAccountProcessing,
    setStoreNotificationMessage,
  } = useContext(GlobalContext);

  const navigate = useNavigate();
  const [userOrNotBtnText, setUserOrNotBtnText] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setStoreNotificationMessage(null);
        setUserOrNotBtnText((preState) => (preState = true));
        const { displayName } = auth.currentUser;
        const fetchRoute = "user/" + displayName + "/info/notification";
        fetchData(fetchRoute)
          .then((data) => {
            if (data) {
              const notificationArr = orderByTime(data, "nowTime", true);
              setStoreNotificationMessage(notificationArr);
            } else {
              return;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setUserOrNotBtnText((preState) => (preState = false));
      }
    });
  }, [setStoreNotificationMessage]);

  // login button click and the login box show
  const handleAccountClick = () => {
    setShowLogInBox((preState) => !preState);
    // show greeting box if its logged in
    if (auth.currentUser) {
      setGreetingName(auth.currentUser.displayName);
      setAccountProcessing({
        ...accountProcessing,
        logIn: false,
        logInGreeting: true,
        signUpGreeting: false,
      });
    }
  };

  return (
    <>
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
        <button onClick={handleAccountClick}>
          {userOrNotBtnText ? "Account" : "Log in"}
          <div className="newMessageMark">!</div>
        </button>
      </nav>
      <LogInSignUp />
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

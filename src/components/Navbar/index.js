import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { orderByTime } from "../../utils/utilities";
import { auth, fetchData } from "../../firebase.js";
import LogInSignUp from "./LogInSignUp/LogIn/";
import GlobalContext from "../../context/GlobalContext";
import "../../styles/Navbar/index.css";

const Index = ({ scrollRef }) => {
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
          .catch(() => {
            return;
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
  const handleNavigateToActivity = () => {
    navigate("/activity");
    scrollToActivity();
    function scrollToActivity() {
      if (scrollRef.current["calendar"]) {
        scrollRef.current["calendar"].scrollIntoView({ behavior: "smooth" });
      } else {
        setTimeout(() => {
          scrollToActivity();
        }, 100);
      }
    }
  };
  const handleNavigateToFaq = () => {
    navigate("/");
    setTimeout(() => {
      scrollRef.current["FAQ"].scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <>
      <section
        className="bannerImg"
        ref={(el) => (scrollRef.current = { ...scrollRef.current, main: el })}
      >
        <div className="backgroundShadow"></div>
      </section>
      <nav>
        <h1 onClick={() => navigate("/")}>
          DrinkGether <i class="fa-solid fa-champagne-glasses"></i>
        </h1>
        <ul>
          <li onClick={() => navigate("/")}>Main</li>
          <li onClick={handleNavigateToActivity}>Quick Start</li>
          <li onClick={handleNavigateToFaq}>FAQ</li>
        </ul>
        <button onClick={handleAccountClick}>
          {userOrNotBtnText ? "Account" : "Log in"}
        </button>
      </nav>
      <LogInSignUp />
      <section className="bannerContent">
        <h2>Meet People</h2>
        <h2>Dicsover Places</h2>
        <h2>Enjoy Time</h2>
        <button onClick={handleNavigateToActivity}>Let's Start</button>
      </section>
    </>
  );
};

export default Index;

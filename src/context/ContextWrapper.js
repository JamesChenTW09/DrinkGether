import React, { useState } from "react";
import GlobalContext from "./GlobalContext";

const ContextWrapper = (props) => {
  //below is login and signup part
  //set click login button to show or hide the login box **transform tranlate360px or 0px**
  const [showLogIn1, setShowLogIn1] = useState("360px");
  //set greeting name when login
  const [greetingName, setGreetingName] = useState("");
  // decide which page should show up , true means showing
  const [accountProcessing, setAccountProcessing] = useState({
    logInGreeting: false,
    signUpGreeting: false,
    logIn: true,
    signUp: false,
    loadingCircle: false,
    forgotPasswordBox: false,
  });
  //store the input email and pass to forgot password email input
  const [inputEmail, setInputEmail] = useState("");
  //
  const [logInOrSignUp, setlogInOrSignUp] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState("");
  return (
    <GlobalContext.Provider
      value={{
        showLogIn1,
        setShowLogIn1,
        greetingName,
        setGreetingName,
        accountProcessing,
        setAccountProcessing,
        inputEmail,
        setInputEmail,
        logInOrSignUp,
        setlogInOrSignUp,
        notificationMessage,
        setNotificationMessage,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default ContextWrapper;

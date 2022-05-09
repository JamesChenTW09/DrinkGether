import React, { useState } from "react";
import GlobalContext from "./GlobalContext";

const ContextWrapper = (props) => {
  //below is login and signup part
  //set click login button to show or hide the login box **transform tranlate360px or 0px**
  const [showLogInBox, setShowLogInBox] = useState(false);
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

  const [storeNotificationMessage, setStoreNotificationMessage] = useState("");
  return (
    <GlobalContext.Provider
      value={{
        showLogInBox,
        setShowLogInBox,
        greetingName,
        setGreetingName,
        accountProcessing,
        setAccountProcessing,
        inputEmail,
        setInputEmail,
        storeNotificationMessage,
        setStoreNotificationMessage,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default ContextWrapper;

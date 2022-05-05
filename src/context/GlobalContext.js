import React from "react";

const GlobalContext = React.createContext({
  showLogIn1: 0,
  setShowLogIn1: () => {},
  greetingName: "",
  setGreetingName: () => {},
  accountProcessing: {},
  setAccountProcessing: () => {},
  inputEmail: "",
  setInputEmail: () => {},
  logInOrSignUp: true,
  setlogInOrSignUp: () => {},
  notificationMessage: "",
  setNotificationMessage: () => {},
});

export default GlobalContext;

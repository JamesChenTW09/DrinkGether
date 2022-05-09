import React from "react";

const GlobalContext = React.createContext({
  showLogInBox: false,
  setShowLogInBox: () => {},
  greetingName: "",
  setGreetingName: () => {},
  accountProcessing: {},
  setAccountProcessing: () => {},
  inputEmail: "",
  setInputEmail: () => {},
  storeNotificationMessage: "",
  setStoreNotificationMessage: () => {},
});

export default GlobalContext;

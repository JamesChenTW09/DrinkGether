import React, { useState, useContext } from "react";
import GlobalContext from "../../../context/GlobalContext.js";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase.js";
import "../../styles/Navbar/LogInSignUp/index.css";

const ForgotPassword = () => {
  const { accountProcessing, setAccountProcessing, setInputEmail, inputEmail } =
    useContext(GlobalContext);
  const { forgotPasswordBox } = accountProcessing;
  const [forgorPasswordMessage, setForgorPasswordMessage] = useState("");

  const handleInputEmail = (e) => {
    setInputEmail(e.target.value);
  };
  const handleReturnLogIn = () => {
    setAccountProcessing({
      ...accountProcessing,
      forgotPasswordBox: false,
      logIn: true,
    });
    setInputEmail("");
    setForgorPasswordMessage("");
  };
  const handleSendEmail = () => {
    if (!inputEmail) {
      setForgorPasswordMessage("Input is empty");
      return;
    }
    sendPasswordResetEmail(auth, inputEmail)
      .then(() => {
        setForgorPasswordMessage("Success, Go check your Email");
      })
      .catch((err) => {
        setForgorPasswordMessage("Not a valid Email");
      });
    setInputEmail("");
  };

  return (
    <div
      className="forgotPassword"
      style={forgotPasswordBox ? { display: "flex" } : { display: "none" }}
    >
      <h4>Forgot Your Password ?</h4>
      <p>
        Enter the email address associated with your account and we'll send you
        a link to reset your password
      </p>
      <input
        type="email"
        value={inputEmail}
        onChange={handleInputEmail}
        placeholder="請輸入信箱"
      />
      <button onClick={handleSendEmail}>Continue</button>
      <div className="forgotPasswordMessage">{forgorPasswordMessage}</div>
      <p className="forgotPasswordReturnLogIn" onClick={handleReturnLogIn}>
        return
      </p>
    </div>
  );
};

export default ForgotPassword;

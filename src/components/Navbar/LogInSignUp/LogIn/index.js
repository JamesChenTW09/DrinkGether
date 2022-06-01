import React, { useState, useContext } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { ref, update } from "firebase/database";
import {
  auth,
  provider,
  db,
  fetchData,
  writeUserData,
} from "../../../../firebase.js";
import GlobalContext from "../../../../context/GlobalContext.js";
import SignUp from "./SignUp/index.js";
import ForgotPassword from "./ForgotPassword/";
import "../../../../styles/Navbar/LogInSignUp/index.css";
import googleIcon from "../../../../styles/icon/googleIcon.png";

const Index = () => {
  const {
    showLogInBox,
    setShowLogInBox,
    setGreetingName,
    accountProcessing,
    setAccountProcessing,
    setInputEmail,
  } = useContext(GlobalContext);

  const { logIn, loadingCircle } = accountProcessing;

  const handleAccountBoxCross = () => {
    setShowLogInBox((preState) => !preState);
  };

  //log in with google
  const handleLogInGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      const user = result.user;
      if (result) {
        const { displayName, email, uid } = result["user"];
        writeUserData(uid, email, displayName, result["providerId"]);
        setAccountProcessing({
          ...accountProcessing,
          logIn: false,
          signUp: false,
          logInGreeting: true,
        });
        setGreetingName(user.displayName);
      }
    });
  };

  //store user login data and start login
  const [logInErrorMessage, setLogInErrorMessage] = useState("");
  const [logInData, setLogInData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = logInData;
  const handleLogIn = (e) => {
    setLogInData({ ...logInData, [e.target.name]: e.target.value });
  };

  const handleStartLogin = () => {
    if (!email || !password) {
      setLogInErrorMessage("All inputs are required");
      return;
    }
    setAccountProcessing({
      ...accountProcessing,
      logIn: false,
      loadingCircle: true,
    });
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        const { displayName } = auth.currentUser;
        const updateRoute = "user/" + displayName + "/info/";
        const fetchRoute = "user/" + displayName;
        update(ref(db, updateRoute), { isOnline: true });
        fetchData(fetchRoute).then((data) => {
          if (data) {
            setGreetingName(displayName);
            setLogInErrorMessage("");
            setAccountProcessing({
              ...accountProcessing,
              logIn: false,
              loadingCircle: false,
              logInGreeting: true,
            });
          }
        });
      })
      .catch((err) => {
        setAccountProcessing({
          ...accountProcessing,
          logIn: true,
          loadingCircle: false,
        });
        switch (err.message) {
          case "Firebase: Error (auth/invalid-email).":
            setLogInErrorMessage("Not a Valid Email");
            break;
          case "Firebase: Error (auth/wrong-password).":
            setLogInErrorMessage("Wrong Password");
            break;
          case "Firebase: Error (auth/user-not-found).":
            setLogInErrorMessage("User not found");
            break;
          default:
            setLogInErrorMessage("fail");
        }
      });
  };
  const [passwordShowingIcon, setPasswordShowingIcon] = useState(false);
  const handleShowPassword = () => {
    setPasswordShowingIcon((preState) => !preState);
  };

  const handleForgotPassword = () => {
    setInputEmail(email);
    setAccountProcessing({
      ...accountProcessing,
      logIn: false,
      forgotPasswordBox: true,
    });
  };

  // handle event list
  const handleLogInSignUpChange = () => {
    setAccountProcessing({ ...accountProcessing, logIn: false, signUp: true });
  };

  return (
    <>
      <div
        className="hiddenAccountBox"
        style={
          showLogInBox
            ? { transform: "translateX(0)" }
            : { transform: "translateX(330px)" }
        }
      >
        {loadingCircle && <div className="logInLoading"></div>}

        <div onClick={handleAccountBoxCross} className="cancelAccountBox">
          ｘ
        </div>

        <section
          className="logInSignUp"
          style={logIn ? { display: "flex" } : { display: "none" }}
        >
          <h1>DrinkGether</h1>
          <h4>Welcome Back</h4>
          <button onClick={handleLogInGoogle}>
            <img className="googleIcon" src={googleIcon} alt="Google Icon" />
            Log in with Google
          </button>

          <p>-----------OR LOGIN WITH EMAIL-----------</p>

          <div className="logInForm">
            <input
              onChange={handleLogIn}
              className="loginEmail"
              type="email"
              placeholder="Enter Email"
              name="email"
              value={email}
            />
            <div>
              <input
                onChange={handleLogIn}
                className="loginPassword"
                type={passwordShowingIcon ? "text" : "password"}
                name="password"
                value={password}
                placeholder="Enter Password"
              />

              <img
                onClick={handleShowPassword}
                className=" logInTogglePassword"
                src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/000000/external-transparency-marketing-agency-flaticons-lineal-color-flat-icons-2.png"
                alt="glasses"
              />
              <div
                onClick={handleShowPassword}
                style={{ display: passwordShowingIcon ? "none" : "block" }}
                className="logInPasswordLine"
              ></div>
            </div>

            <p onClick={handleForgotPassword} className="forgetPassword">
              Forgot password
            </p>
            <button onClick={handleStartLogin}>Log in</button>
            <p className="accountErrorMessage">{logInErrorMessage}</p>
          </div>
          <p>
            Don't have an account ?
            <span onClick={handleLogInSignUpChange}> Sign up</span>
          </p>
        </section>

        <SignUp handleAccountBoxCross={handleAccountBoxCross} />
        <ForgotPassword />
      </div>
    </>
  );
};

export default Index;

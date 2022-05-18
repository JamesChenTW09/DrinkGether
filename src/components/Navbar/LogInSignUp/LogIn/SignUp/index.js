import React, { useState, useRef, useContext } from "react";
import GlobalContext from "../../../../../context/GlobalContext.js";
import Greeting from "./Greeting";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { writeUserData, auth, db, fetchData } from "../../../../../firebase.js";
import { update, ref } from "firebase/database";
import "../../../../styles/Navbar/LogInSignUp/index.css";
import googleIcon from "../../../../styles/icon/googleIcon.png";

const SignUp = ({ handleAccountBoxCross, handleLogOutBtn }) => {
  const { accountProcessing, setAccountProcessing, setGreetingName } =
    useContext(GlobalContext);
  const { signUp, loadingCircle } = accountProcessing;
  const [signUpErrorMessage, setSignUpErrorMessage] = useState("");
  const [passwordShowing, setPasswordShowing] = useState(false);

  //handle event list
  const handleSignUpLogInChange = () => {
    setAccountProcessing({ ...accountProcessing, logIn: true, signUp: false });
  };

  const handleShowPassword = () => {
    setPasswordShowing(!passwordShowing);
  };

  //store user signUp data
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = signUpData;
  const handleSignUpData = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };
  const checkBox = useRef();
  const sendSignUp = () => {
    if (!name || !email || !password || !checkBox.current.checked) {
      setSignUpErrorMessage("All inputs are required");
      return;
    } else if (name.length > 20) {
      setSignUpErrorMessage("Name Max 20 characters");
      return;
    } else if (password.length > 20) {
      setSignUpErrorMessage("Password Max 20 characters");
      return;
    }
    setAccountProcessing({
      ...accountProcessing,
      signUp: false,
      loadingCircle: true,
    });
    fetchData("/user").then((data) => {
      const userArr = Object.keys(data);
      if (userArr.includes(name)) {
        setSignUpErrorMessage("名字重複了");
        setAccountProcessing({
          ...accountProcessing,
          signUp: true,
          loadingCircle: false,
        });
        return;
      } else {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            updateProfile(auth.currentUser, { displayName: name });
            const user = userCredential.user;
            setGreetingName(name);
            writeUserData(user.uid, email, name, password);
            update(ref(db, "user/" + name + "/info/"), {
              isOnline: true,
            });
            setSignUpData({
              name: "",
              email: "",
              password: "",
            });
            setSignUpErrorMessage("");
            setAccountProcessing({
              ...accountProcessing,
              logInGreeting: true,
              signUp: false,
              loadingCircle: false,
            });
          })
          .catch((err) => {
            setAccountProcessing({
              ...accountProcessing,
              signUp: true,
              loadingCircle: false,
            });
            if (err.message === "Firebase: Error (auth/invalid-email).") {
              setSignUpErrorMessage("Not a Valid Email");
            } else if (
              err.message ===
              "Firebase: Password should be at least 6 characters (auth/weak-password)."
            ) {
              setSignUpErrorMessage("Password should be at least 6 characters");
            } else if (
              err.message === "Firebase: Error (auth/email-already-in-use)."
            ) {
              setSignUpErrorMessage("Email-already-in-use");
            } else {
              console.log(err.message);
            }
          });
      }
    });
  };

  return (
    <>
      {loadingCircle ? <div className="logInLoading"></div> : ""}
      <Greeting handleAccountBoxCross={handleAccountBoxCross} />
      <section
        className="logInSignUp"
        style={signUp ? { display: "flex" } : { display: "none" }}
      >
        <h1>DrinkGether</h1>
        <h3>Hello !!</h3>
        <button>
          <img className="googleIcon" src={googleIcon} alt="Google Icon" />
          Log in with Google
        </button>
        <p>----------CREATE NEW ACCOUNT----------</p>
        <div className="logInForm">
          <input
            onChange={handleSignUpData}
            name="name"
            className="loginName"
            type="text"
            placeholder="Enter Account Name"
            value={name}
          />
          <input
            onChange={handleSignUpData}
            name="email"
            className="loginEmail"
            type="email"
            placeholder="Enter Email"
            value={email}
          />
          <div>
            <input
              onChange={handleSignUpData}
              name="password"
              className="loginPassword"
              type={passwordShowing ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
            />

            <img
              onClick={handleShowPassword}
              className=" togglePassword"
              src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/000000/external-transparency-marketing-agency-flaticons-lineal-color-flat-icons-2.png"
              alt=""
            />
            <div
              onClick={handleShowPassword}
              style={{ display: passwordShowing ? "none" : "block" }}
              className="passwordLine"
            ></div>
          </div>
          <div className="checkOver18">
            <input ref={checkBox} type="checkbox" />
            <label htmlFor="">Over 18</label>
          </div>

          <br />
          <button onClick={sendSignUp}>Sign up</button>
          <p style={{ margin: "10px", color: "red" }}>{signUpErrorMessage}</p>
        </div>
        <p>
          Have an account ?
          <span onClick={handleSignUpLogInChange}> Log in</span>
        </p>
      </section>
    </>
  );
};

export default SignUp;

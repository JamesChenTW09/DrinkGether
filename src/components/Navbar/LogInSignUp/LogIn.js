import React, { useState, useContext } from "react";
import GlobalContext from "../../../context/GlobalContext.js";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  get,
  child,
  update,
  remove,
} from "firebase/database";
import { auth, provider } from "../../../firebase.js";
import SignUp from "./SignUp.js";
import ForgotPassword from "./ForgotPassword.js";
import "../../styles/Navbar/LogInSignUp/index.css";
import googleIcon from "../../styles/icon/googleIcon.png";

const LogIn = ({ notificationMessage, setNotificationMessage }) => {
  const {
    showLogIn1,
    setShowLogIn1,
    greetingName,
    setGreetingName,
    accountProcessing,
    setAccountProcessing,
    setInputEmail,
    logInOrSignUp,
    setlogInOrSignUp,
  } = useContext(GlobalContext);

  const { logInGreeting, logIn, loadingCircle } = accountProcessing;

  // change singUp page or logIn page by click
  const logInSignUpPageChange = () => {
    setlogInOrSignUp(!logInOrSignUp);
    setAccountProcessing({ ...accountProcessing, logIn: false, signUp: true });
  };

  // message for err during logging in
  const [logInMessage, setLogInMessage] = useState("");

  const handleAccountCross = () => {
    setShowLogIn1("360px");
  };

  //store user login data in object
  const [logInData, setLogInData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = logInData;
  const handleLogIn = (e) => {
    setLogInData({ ...logInData, [e.target.name]: e.target.value });
  };
  // click event to start login process
  const sendLogIn = () => {
    if (!email || !password) {
      setLogInMessage("All inputs are required");
      return;
    }
    setAccountProcessing({
      ...accountProcessing,
      logIn: false,
      loadingCircle: true,
    });
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        let userData;
        const db = getDatabase();
        const dbref = ref(db);
        update(ref(db, "user/" + auth.currentUser.displayName + "/info/"), {
          isOnline: true,
        });
        get(child(dbref, "user/" + auth.currentUser.displayName)).then(
          (snapshot) => {
            if (snapshot.exists()) {
              userData = snapshot.val();
              setGreetingName(userData.name);
              setAccountProcessing({
                ...accountProcessing,
                logIn: false,
                loadingCircle: false,
                logInGreeting: true,
              });
              setLogInMessage("");
            }
          }
        );
      })
      .catch((err) => {
        setAccountProcessing({
          ...accountProcessing,
          logIn: true,
          loadingCircle: false,
        });
        if (err.message === "Firebase: Error (auth/invalid-email).") {
          setLogInMessage("Not a Valid Email");
        } else if (err.message === "Firebase: Error (auth/wrong-password).") {
          setLogInMessage("Wrong Password");
        } else if (err.message === "Firebase: Error (auth/user-not-found).") {
          setLogInMessage("User not found");
        } else {
          console.log(err.message);
        }
      });
  };

  //log in with google
  const handleLogInGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      const user = result.user;
      if (result) {
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
  // forgot password
  // keep the email input and pass to forgotPassword component
  // const [inputEmail, setInputEmail] = useState("");
  const handleForgotPassword = () => {
    setInputEmail(email);
    setAccountProcessing({
      ...accountProcessing,
      logIn: false,
      forgotPasswordBox: true,
    });
  };
  //logout button
  const handleLogOutBtn = () => {
    setAccountProcessing({
      ...accountProcessing,
      logIn: true,
      logInGreeting: false,
      signUpGreeting: false,
    });
    const db = getDatabase();
    update(ref(db, "user/" + auth.currentUser.displayName + "/info/"), {
      isOnline: false,
    });
    signOut(auth)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  };

  // handle show password eye
  const [passwordShowing, setPasswordShowing] = useState(false);
  const handleShowPassword = () => {
    setPasswordShowing(!passwordShowing);
  };
  //navigate to memver Page
  const navigate = useNavigate();

  //drag
  const drag = (e, item) => {
    e.dataTransfer.setData("text", item["uuid"]);
  };
  const allowDrop = (e) => {
    e.preventDefault();
  };

  const drop = (e) => {
    e.preventDefault();
    const deleteId = e.dataTransfer.getData("text");
    setNotificationMessage((preState) =>
      preState.filter((item) => {
        return item["uuid"] !== deleteId;
      })
    );
    const db = getDatabase();
    remove(
      ref(
        db,
        "user/" +
          auth.currentUser.displayName +
          "/info/notification/" +
          deleteId
      )
    );
  };
  return (
    <>
      <div
        className="hiddenAccountBox"
        style={{ transform: `translateX(${showLogIn1})` }}
      >
        {loadingCircle ? <div className="logInLoading"></div> : ""}
        {logInGreeting ? (
          <div className="logInGreeting">
            Have a Good Day<div>{greetingName}</div>
            <div className="greetingBtnBox">
              <button onClick={handleAccountCross}>繼續瀏覽</button>
              <button
                onClick={() =>
                  navigate("/member/" + auth.currentUser.displayName)
                }
              >
                會員頁面
              </button>
              <button onClick={handleLogOutBtn}>登出</button>
            </div>
            <div className="notificationBox">
              <div className="notificationHeader">New Message</div>
              <div className="notificationListBox">
                {notificationMessage
                  ? notificationMessage.map((item) => {
                      return (
                        <div
                          className="notificationItem"
                          draggable={true}
                          onDragStart={(e) => drag(e, item)}
                        >
                          <p>{item["message"]}</p>
                          <div className="notificationTime">
                            {item["nowTime"]}
                          </div>
                        </div>
                      );
                    })
                  : ""}
              </div>
            </div>
            <div
              onDrop={(e) => drop(e)}
              onDragOver={(e) => allowDrop(e)}
              className="notificationDelete"
            >
              <div>Drop Here to Delete</div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div onClick={handleAccountCross} className="cancelAccountBox">
          ｘ
        </div>

        <section
          className="logInSignUp"
          style={
            (logInOrSignUp ? { display: "flex" } : { display: "none" },
            logIn ? { display: "flex" } : { display: "none" })
          }
        >
          <h1>DrinkGether</h1>
          <h3>Welcome Back</h3>
          <button onClick={handleLogInGoogle}>
            <img className="googleIcon" src={googleIcon} alt="" />
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
                type={passwordShowing ? "text" : "password"}
                name="password"
                value={password}
                placeholder="Enter Password"
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

            <p onClick={handleForgotPassword} className="forgetPassword">
              Forgot password
            </p>
            <button onClick={sendLogIn}>Log in</button>
            <p style={{ margin: "10px", color: "red" }}>{logInMessage}</p>
          </div>
          <p>
            Don't have an account ?
            <span onClick={logInSignUpPageChange}> Sign up</span>
          </p>
        </section>

        {/* below is signUp part */}
        <SignUp
          handleAccountCross={handleAccountCross}
          handleLogOutBtn={handleLogOutBtn}
          notificationMessage={notificationMessage}
          setNotificationMessage={setNotificationMessage}
        />
        <ForgotPassword />
      </div>
    </>
  );
};

export default LogIn;

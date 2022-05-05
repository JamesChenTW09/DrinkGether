import React, { useState, useRef, useContext } from "react";
import GlobalContext from "../../../context/GlobalContext.js";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { writeUserData, auth } from "../../../firebase.js";
import { update, ref, getDatabase, remove } from "firebase/database";
import "../../styles/Navbar/LogInSignUp/index.css";
import googleIcon from "../../styles/icon/googleIcon.png";

const SignUp = ({
  handleAccountCross,
  handleLogOutBtn,
  notificationMessage,
  setNotificationMessage,
}) => {
  const {
    accountProcessing,
    setAccountProcessing,
    logInOrSignUp,
    setlogInOrSignUp,
  } = useContext(GlobalContext);
  const { signUpGreeting, signUp, loadingCircle } = accountProcessing;
  const [signUpMessage, setSignUpMessage] = useState("");

  //show signup name
  const [greetingName, setGreetingName] = useState("");

  const logInSignUpPageChange = () => {
    setlogInOrSignUp(!logInOrSignUp);
    setAccountProcessing({ ...accountProcessing, logIn: true, signUp: false });
  };

  //handle signUp
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    error: false,
  });
  const { name, email, password } = signUpData;
  const handleSignUpData = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };
  const checkBox = useRef();
  const sendSignUp = () => {
    if (!name || !email || !password || !checkBox.current.checked) {
      setSignUpMessage("All inputs are required");
      return;
    }
    setAccountProcessing({
      ...accountProcessing,
      signUp: false,
      loadingCircle: true,
    });
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateProfile(auth.currentUser, { displayName: name });
        const user = userCredential.user;
        const db = getDatabase();
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
        setSignUpMessage("");
        setAccountProcessing({
          ...accountProcessing,
          signUpGreeting: true,
          loginGreeting: false,
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
          setSignUpMessage("Not a Valid Email");
        } else if (
          err.message ===
          "Firebase: Password should be at least 6 characters (auth/weak-password)."
        ) {
          setSignUpMessage("Password should be at least 6 characters");
        } else if (
          err.message === "Firebase: Error (auth/email-already-in-use)."
        ) {
          setSignUpMessage("Email-already-in-use");
        } else {
          console.log(err.message);
        }
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
      {loadingCircle ? <div className="logInLoading"></div> : ""}
      {signUpGreeting ? (
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

      <section
        className="logInSignUp"
        style={
          (logInOrSignUp ? { display: "none" } : { display: "flex" },
          signUp ? { display: "flex" } : { display: "none" })
        }
      >
        <h1>DrinkGether</h1>
        <h3>Hello !!</h3>
        <button>
          <img className="googleIcon" src={googleIcon} alt="" />
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
          <p style={{ margin: "10px", color: "red" }}>{signUpMessage}</p>
        </div>
        <p>
          Have an account ? <span onClick={logInSignUpPageChange}> Log in</span>
        </p>
      </section>
    </>
  );
};

export default SignUp;

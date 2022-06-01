import React, { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import "../../styles/FAQ/index.css";

const Index = ({ scrollRef }) => {
  const { setShowLogInBox } = useContext(GlobalContext);
  const handleShowLogInBox = () => {
    setShowLogInBox((preState) => !preState);
  };
  const handleShowFaqDetail = (e) => {
    const target = e.target;
    const targetP = target.parentNode.nextSibling;
    if (target.textContent === "+") {
      target.textContent = "- ";
      targetP.style.display = "block";
    } else {
      target.textContent = "+";
      targetP.style.display = "none";
    }
  };
  return (
    <>
      <section
        className="faqTitle"
        ref={(el) => (scrollRef.current = { ...scrollRef.current, FAQ: el })}
      >
        <h3>FAQ</h3>
        <p>Find your question or send yours through Contact below</p>
      </section>
      <section className="faqContainer">
        <div className="faqContent">
          <div className="faqItemTitle">
            <h4>1. How to create a new account?</h4>
            <span onClick={handleShowFaqDetail}>+</span>
          </div>
          <p>
            You can click the <span onClick={handleShowLogInBox}>log in</span>
            button to create a new account
          </p>
        </div>
        <div className="faqContent">
          <div className="faqItemTitle">
            <h4>1. Is my personal member page open for everyone?</h4>
            <span onClick={handleShowFaqDetail}>+</span>
          </div>
          <p>
            Yes, it is. Everyone can visit your member page and check the basic
            info, however, your private info like, email, password, and activity
            detail are only for yourself
          </p>
        </div>
      </section>
    </>
  );
};

export default Index;

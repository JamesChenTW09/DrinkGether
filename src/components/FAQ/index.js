import React from "react";
import "./styles/index.css";

const Index = ({ scrollRef }) => {
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
        <p>Find your question or send yours to us through Contact below</p>
      </section>
      <section className="faqContainer">
        <div className="faqContent">
          <div className="faqItemTitle">
            <h4>1. How to create a new account?</h4>
            <span onClick={handleShowFaqDetail}>+</span>
          </div>
          <p>
            You can click the <span>account</span> button to create a new
            account
          </p>
        </div>
        <div className="faqContent">
          <div className="faqItemTitle">
            <h4>1. How to create a new account?</h4>
            <span onClick={handleShowFaqDetail}>+</span>
          </div>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorum
            nisi quod aspernatur ipsum praesentium doloremque blanditiis iure
            qui itaque enim velit officiis laboriosam sint a nulla eius
            cupiditate at quasi, amet ullam tempore. Consequuntur, hic! Eaque
            vero molestiae animi numquam?
          </p>
        </div>
        <div className="faqContent">
          <div className="faqItemTitle">
            <h4>1. How to create a new account?</h4>
            <span onClick={handleShowFaqDetail}>+</span>
          </div>
          <p>
            You can click the <span>account</span> button to create a new
            account
          </p>
        </div>
      </section>
    </>
  );
};

export default Index;

import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Features/index.css";
import icon from "../../styles/photos/beer.jpg";
const Index = ({ scrollRef }) => {
  const navigate = useNavigate();
  const handleMoveToActivity = () => {
    navigate("/activity");
    setTimeout(() => {
      scrollRef.current["calendar"].scrollIntoView();
    });
  };
  return (
    <>
      <section
        className="mainFeature"
        ref={(el) =>
          (scrollRef.current = { ...scrollRef.current, Introduction: el })
        }
      >
        <h3>Why us ??</h3>
        <p>Find your Drink partner easily. Never drink alone again</p>
        <section className="featuresContainer">
          <div className="featureItem">
            <div className="featureItemIconContainer">
              <i class="fa-solid fa-martini-glass"></i>
            </div>
            <ul>
              <li>No Friend drink with?</li>
              <li>Make New Friend?</li>
              <li>DrinkGether Helps You!</li>
            </ul>
          </div>
          <div className="featureItem">
            <div className="featureItemIconContainer">
              <i class="fa-solid fa-calendar-days"></i>
            </div>
            <ul>
              <li>Calendar Style </li>
              <li>Friendly Operational Interface</li>
            </ul>
          </div>
          <div className="featureItem">
            <div className="featureItemIconContainer">
              <i class="fa-brands fa-rocketchat"></i>
            </div>
            <ul>
              <li>Discuss before meet</li>
              <li>Easily Join and Cancel</li>
              <li>Free Viewing Member Info</li>
            </ul>
          </div>
          <div className="featureItem">
            <div className="featureItemIconContainer">
              <i class="fa-solid fa-address-card"></i>
            </div>
            <ul>
              <li>Friendly Member Page</li>
              <li>Bar Recommend</li>
              <li>Notification system</li>
            </ul>
          </div>
        </section>
      </section>
      <div
        className="guideTitle"
        ref={(el) => (scrollRef.current = { ...scrollRef.current, Steps: el })}
      >
        <h3>How to Start ?</h3>
        <p>Follow 3 Steps for Quick Start</p>
      </div>
      <section className="guideSteps">
        <div className="stepContainer">
          <div className="guideImgContainer">
            <img src={icon} alt="" />
          </div>
          <h3>Create a Account</h3>
          <p>1.Click upper right Log in button</p>
          <p>2.Fill in requested datas</p>
          <p>
            3.After signing up, visit&nbsp;
            <span onClick={handleMoveToActivity}>Calendar</span> to start
          </p>
        </div>
        <div className="stepContainer">
          <div className="guideImgContainer">
            <img src={icon} alt="" />
          </div>
          <h3>Start / Join Activity</h3>
          <p>1.Start or Join activity</p>
          <p>2.Click to see detail</p>
          <p>3.Discuss before joining</p>
        </div>
        <div className="stepContainer">
          <div className="guideImgContainer">
            <img src={icon} alt="" />
          </div>
          <h3>Check Member Page</h3>
          <p>1.Fill in your Basic Info</p>
          <p>2.Manage your activities</p>
          <p>3.Look forward to the activity coming</p>
        </div>
      </section>
    </>
  );
};

export default Index;

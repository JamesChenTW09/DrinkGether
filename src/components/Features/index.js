import React from "react";
import "./styles/index.css";
import icon from "./beer.jpg";
const Index = () => {
  return (
    <>
      <section className="mainFeature">
        <h3>Why us ??</h3>
        <p>A new paradise for Alcholic, never drink alone again</p>
        <section className="featuresContainer">
          <div className="featureItem">
            <img src={icon} alt="" />
            <ul>
              <li>想喝酒找不到人?</li>
              <li>想認識新朋友?</li>
              <li>DrinkGether幫你!</li>
            </ul>
          </div>
          <div className="featureItem">
            <img src={icon} alt="" />
            <ul>
              <li>操作簡單，一鍵發起活動</li>
              <li>日曆介面，方便瀏覽</li>
            </ul>
          </div>
          <div className="featureItem">
            <img src={icon} alt="" />
            <ul>
              <li>會員評論功能，見面更安心</li>
              <li>專屬討論區，你我有保障</li>
              <li>精美個人頁面</li>
            </ul>
          </div>
          <div className="featureItem">
            <img src={icon} alt="" />
            <ul>
              <li>會員評論功能，見面更安心</li>
              <li>專屬討論區，你我有保障</li>
              <li>精美個人頁面</li>
            </ul>
          </div>
        </section>
      </section>
      <div className="guideTitle">
        <h3>How to Start ?</h3>
        <p>詳細介紹讓您五分鐘內開始找活動</p>
      </div>
      <section className="guideSteps">
        <div className="stepContainer">
          <div className="guideImgContainer">
            <img src={icon} alt="" />
          </div>
          <h3>註冊會員</h3>
          <p>1.點擊右上角會員登入，完成註冊 / 登入手續</p>
          <p>2.進入會員頁面，編輯個人資料</p>
          <p>3.完成後即可開始參加活動</p>
        </div>
        <div className="stepContainer">
          <div className="guideImgContainer">
            <img src={icon} alt="" />
          </div>
          <h3>註冊會員</h3>
          <p>123456789123456789</p>
          <p>123456789123456789</p>
          <p>123456789123456789</p>
        </div>
        <div className="stepContainer">
          <div className="guideImgContainer">
            <img src={icon} alt="" />
          </div>
          <h3>註冊會員</h3>
          <p>123456789123456789</p>
          <p>123456789123456789</p>
          <p>123456789123456789</p>
        </div>
      </section>
    </>
  );
};

export default Index;

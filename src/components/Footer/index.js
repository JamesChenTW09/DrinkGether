import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Footer/index.css";

const Index = ({ scrollRef }) => {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);
  const [showKeyboard, setShowKeyBoard] = useState(false);
  const footerContent = useRef();
  const handleShowContact = () => {
    setShowContact((preState) => !preState);
  };
  const handleKeyboardCover = () => {
    setShowKeyBoard((preState) => !preState);
  };

  const handleScroll = (element) => {
    navigate("/");
    setTimeout(() => {
      scrollRef.current[element].scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <footer style={showContact ? { height: "90vh" } : { height: "70vh" }}>
      <div class="custom-shape-divider-top-1652431112">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            class="shape-fill"
          ></path>
        </svg>
      </div>
      <div className="footerContainer">
        <div
          style={showKeyboard ? { height: "400px" } : { height: "250px" }}
          ref={footerContent}
          className="footerContent"
        >
          <h3>DrinkGether</h3>
          <ul>
            <li onClick={() => handleScroll("Introduction")}>Introduction</li>
            <li onClick={() => handleScroll("Steps")}>Steps</li>
            <li onClick={() => handleScroll("FAQ")}>FAQ</li>
            <li onClick={handleShowContact}>Contact</li>
          </ul>
          <div
            style={showContact ? { display: "flex" } : { display: "none" }}
            className="contactContent"
          >
            <input type="text" placeholder="Email" />
            <textarea
              onFocus={handleKeyboardCover}
              onBlur={handleKeyboardCover}
              placeholder="Feel free to leave any advice"
            ></textarea>

            <button>Coming soon</button>
          </div>
          <p>COPYRIGHT 2022 DrinkGether</p>
        </div>
      </div>
    </footer>
  );
};

export default Index;

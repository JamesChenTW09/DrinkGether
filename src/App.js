import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Features from "./components/Features";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Calender from "./components/Calender";
import Membership from "./components/Membership";
import { Provider } from "react-redux";
import store from "./redux_toolkit/store";

import "./firebase.js";
function App() {
  return (
    <Provider store={store}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Features />
              <FAQ />
            </>
          }
        ></Route>
        <Route path="/member/:name" element={<Membership />}></Route>
        <Route path="/activity" element={<Calender />}></Route>
      </Routes>
      <Footer />
    </Provider>
  );
}

export default App;

import { useRef, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Provider } from "react-redux";
import store from "./redux_toolkit/store";

const Calender = lazy(() => import("./components/Calender"));
const Membership = lazy(() => import("./components/Membership"));
const Features = lazy(() => import("./components/Features"));
const FAQ = lazy(() => import("./components/FAQ"));
const Footer = lazy(() => import("./components/Footer"));

function App() {
  const scrollRef = useRef({});
  return (
    <Provider store={store}>
      <Navbar scrollRef={scrollRef} />
      <Suspense
        fallback={
          <div className="lazyLoading">
            <div className="lazyLoadingItem"></div>
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Features scrollRef={scrollRef} />
                <FAQ scrollRef={scrollRef} />
              </>
            }
          ></Route>
          <Route path="/member/:name" element={<Membership />}></Route>
          <Route
            path="/activity"
            element={<Calender scrollRef={scrollRef} />}
          ></Route>
        </Routes>
        <Footer scrollRef={scrollRef} />
      </Suspense>
    </Provider>
  );
}

export default App;

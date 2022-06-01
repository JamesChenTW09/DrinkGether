import React, { useState } from "react";
import dayjs from "dayjs";
import { getMonth } from "../../utils/utilities";
import CalendarFeatures from "./CalendarFeatures";
import CalendarHeader from "./CalendarHeader";
import CalendarMain from "./CalendarMain";
import "../../styles/Calendar/index.css";

const Index = ({ scrollRef }) => {
  const [bigDateBox, setBigDateBox] = useState(getMonth());
  const [smallDateBox, setSmallDateBox] = useState(getMonth());
  const [bigNowMonth, setBigNowMonth] = useState(dayjs().month());
  const [smallNowMonth, setSmallNowMonth] = useState(dayjs().month());

  //

  return (
    <>
      <CalendarHeader
        setSmallDateBox={setSmallDateBox}
        getMonth={getMonth}
        setSmallNowMonth={setSmallNowMonth}
        setBigDateBox={setBigDateBox}
        bigNowMonth={bigNowMonth}
        setBigNowMonth={setBigNowMonth}
        scrollRef={scrollRef}
      />

      <section className="calendarMainArea">
        <CalendarFeatures
          setSmallDateBox={setSmallDateBox}
          smallDateBox={smallDateBox}
          getMonth={getMonth}
          smallNowMonth={smallNowMonth}
          setSmallNowMonth={setSmallNowMonth}
          setBigDateBox={setBigDateBox}
          setBigNowMonth={setBigNowMonth}
          scrollRef={scrollRef}
        />

        <CalendarMain smallNowMonth={smallNowMonth} bigDateBox={bigDateBox} />
      </section>
    </>
  );
};

export default Index;

import React, { useEffect, useState } from "react";
import './Clock.css'

export default function Clock() {
  const [clockState, setClockState] = useState();

  useEffect(() => {
    setInterval(() => {
      const date = new Date();
      setClockState(date.toLocaleTimeString());
    }, 1000);
  }, []);

  return <div className="clock">{clockState}</div>;
}
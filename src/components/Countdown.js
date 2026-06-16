"use client";

import { useEffect, useState } from "react";

export default function Countdown({ date, time }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [color, setColor] = useState("var(--muted)");

  useEffect(() => {
    if (date === "TBD" || time === "TBD" || !date || !time) {
      setTimeLeft("");
      return;
    }

    const matchDate = new Date(`${date}T${time}:00Z`);
    const lockDate = new Date(matchDate.getTime() - 15 * 60 * 1000); // 15 mins before kickoff

    const updateCountdown = () => {
      const now = new Date();
      const diffMs = lockDate - now;

      if (diffMs <= 0) {
        setTimeLeft("🔒 Cerrado");
        setColor("#FF5252"); // Red
        return;
      }

      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) {
        setTimeLeft(`Cierra en ${diffDays}d ${diffHours % 24}h`);
        setColor("#5B8DEF"); // Blue
      } else {
        const h = String(diffHours).padStart(2, "0");
        const m = String(diffMins % 60).padStart(2, "0");
        const s = String(diffSecs % 60).padStart(2, "0");
        setTimeLeft(`Cierra en ${h}:${m}:${s}`);
        
        if (diffHours < 1) {
          setColor("#FF5252"); // Red
        } else if (diffHours < 6) {
          setColor("#FFB300"); // Amber
        } else {
          setColor("#00E676"); // Green
        }
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [date, time]);

  if (!timeLeft) return null;

  return (
    <div style={{ fontSize: "0.75rem", fontWeight: "bold", color: color, marginTop: "2px", fontVariantNumeric: "tabular-nums" }}>
      {timeLeft}
    </div>
  );
}

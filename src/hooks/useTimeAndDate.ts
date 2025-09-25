import { useEffect, useState } from "react";

export function useTimeAndDate(locale?: string) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const resolvedLocale =
    locale ||
    (typeof navigator !== "undefined"
      ? navigator.language
      : Intl.DateTimeFormat().resolvedOptions().locale);

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
      setDate(
        now.toLocaleDateString(resolvedLocale, {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      );
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [resolvedLocale]);

  return { time, date };
}

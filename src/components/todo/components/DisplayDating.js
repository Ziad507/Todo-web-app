import { useEffect, useState } from "react";

export default function DisplayDating() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateToday = new Date();
  const dayToday = dateToday.getDate();
  const Month = dateToday.getMonth();
  const Year = dateToday.getFullYear();
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center">
        <Weekday />
        <h1 className="font-abhaya font-semibold text-5xl mt-4">
          {dayToday < 10 ? "0" + dayToday : dayToday}, {months[Month]} {Year}
        </h1>
        <Calender />
      </div>
    </div>
  );
}

function Weekday() {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dateToday = new Date();
  const dayToday = dateToday.getDay();
  return (
    <h2 className="text-secondary font-islandMoments font-bold text-5xl">
      {weekdays[dayToday]}
    </h2>
  );
}

function Calender() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [startDay, setStartDay] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // Corrected from getDay() to getMonth()
    const date = new Date(year, month, 1);
    const days = [];

    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    setDaysInMonth(days);
    setStartDay(new Date(year, month, 1).getDay());

    // Set today's date as the selected day if it's within the current month
    const today = new Date();
    if (today.getMonth() === month && today.getFullYear() === year) {
      setSelectedDay(today);
    }
  }, [currentDate]);

  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div className=" md:w-[320px] my-[20px] mx-auto border-[1.5px] rounded-[10px] border-[#ccc] overflow-hidden shadow-sm font-robotoFlex">
      <div className="text-center text-xl p-4 w-full bg-secondary text-white">
        <span>{currentDate.toLocaleString("default", { month: "long" })}</span>
      </div>
      <div className="px-2 flex flex-wrap">
        {weekdays.map((day) => (
          <div
            key={day}
            className="day-name bg-slate-50 font-bold opacity-50 mb-[8px]"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="px-2 flex flex-wrap">
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={index} className="empty-day"></div>
        ))}
        {daysInMonth.map((day) => (
          <div
            key={day}
            className={`day ${
              day.getDate() === new Date().getDate() &&
              day.getMonth() === new Date().getMonth()
                ? "today"
                : ""
            } ${
              selectedDay && day.toDateString() === selectedDay.toDateString()
                ? "selected"
                : ""
            }`}
          >
            {day.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}

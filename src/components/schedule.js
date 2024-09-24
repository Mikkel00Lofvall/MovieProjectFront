import React, { useState, useEffect } from 'react';
import { ScheduleTest } from "../global/testdata";
import "./css/schedule.css";
import Breakline from './breakline';

let ScheduleTable = ({scheduleData}) => {
    let [error, setError] = useState(null);
    let [loading, setLoading] = useState(true);

    let [currentDate, setCurrentDate] = useState(new Date());
    let [weekDates, setWeekDates] = useState([]);

    // Fetch schedule data when movieID changes


    const getStartOfWeek = (date) => {
        let currentDay = date.getDay();
        let mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
        let monday = new Date(date);
        monday.setDate(date.getDate() + mondayOffset);
        return monday;
    };

    useEffect(() => {
        const startOfWeek = getStartOfWeek(currentDate);
        const weekDays = Array.from({ length: 7 }).map((_, i) => {
            let newDate = new Date(startOfWeek);
            newDate.setDate(startOfWeek.getDate() + i);
            return newDate;
        });
        setWeekDates(weekDays);
    }, [currentDate]);

    const changeWeek = (direction) => {
        let newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + direction * 7);
        setCurrentDate(newDate);
    };

    const createEventsForDay = (day) => {
        return scheduleData
            .filter((item) => {
                let eventDate = new Date(item.date.year, item.date.month - 1, item.date.day, item.date.hour, item.date.minute);
                return (
                    eventDate.getFullYear() === day.getFullYear() &&
                    eventDate.getMonth() === day.getMonth() &&
                    eventDate.getDate() === day.getDate()
                );
            })
            .map((item, index) => {
                let eventDate = new Date(item.date.year, item.date.month - 1, item.date.day, item.date.hour, item.date.minute);
                let hour = eventDate.getHours();
                let minute = eventDate.getMinutes();
                let topPosition = (hour * 60 + minute) * 0.5;

                return (
                    <div
                        key={index}
                        className="event"
                        style={{
                            position: "absolute",
                            top: `${topPosition}px`,
                            width: "100%",
                            height: "50px",
                            backgroundColor: "rgba(0, 123, 255, 0.7)",
                            borderRadius: "4px",
                            padding: "5px",
                            boxSizing: "border-box"
                        }}
                    >
                        Time: {eventDate.getHours()}:{eventDate.getMinutes().toString().padStart(2, '0')}
                    </div>
                );
            });
    };

    return (
        <div className="schedule-container">
            <h2 className="schedule-name">Weekly Schedule</h2>
            <div className="week-navigation">
                <button onClick={() => changeWeek(-1)}>Previous Week</button>
                <span>
                    {weekDates[0]?.toDateString()} - {weekDates[6]?.toDateString()}
                </span>
                <button onClick={() => changeWeek(1)}>Next Week</button>
            </div>
            <div className="scrollable">
                <div className="schedule-grid">
                    {weekDates.map((date, index) => (
                        <div key={index} className="day-column">
                            <div className="day-header">{date.toDateString()}</div>
                            <div className="day-body">
                                {createEventsForDay(date)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
        </div>
    );
};

export default ScheduleTable;

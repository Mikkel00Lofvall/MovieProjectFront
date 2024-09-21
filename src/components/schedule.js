
import React, { useState, useEffect } from 'react';
import "./css/schedule.css"
import Breakline from './breakline';

const ScheduleTable = ({movieID}) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scheduleData, setScheduleData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await fetch(`https://localhost:7296/api/Schedule/GetSchedulesWithMovieID/${movieID}`);
                if (!response.ok) {
                    throw new Error("Network was not okay!");
                }
                let result = await response.json();
                setScheduleData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [movieID]);

    const getStartOfWeek = (date) => {
        let currentDay = date.getDay();
        let mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
        let monday = new Date(date);
        monday.setDate(date.getDate() + mondayOffset);
        return monday;
    };

    let startOfWeek = getStartOfWeek(currentDate);
    let weekDates = Array.from({ length: 7 }).map((_, i) => {
        let newDate = new Date(startOfWeek);
        newDate.setDate(startOfWeek.getDate() + i);
        return newDate;
    });

    const changeWeek = (direction) => {
        let newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + direction * 7);
        setCurrentDate(newDate);
    };

    const createTable = () => {
        const hoursToday = Array.from({ length: 17 }, (_, hourIndex) => hourIndex + 7); // 07:00 to 23:00
        const hoursTomorrow = Array.from({ length: 7 }, (_, hourIndex) => hourIndex); // 00:00 to 06:00

        const allHours = [...hoursToday, ...hoursTomorrow];

        return allHours.map((hour, hourIndex) => (
            <tr key={hourIndex} className="schedule-row">
                <td className="time-cell">{hour.toString().padStart(2, "0")}:00</td>
                {weekDates.map((date, dayIndex) => (
                    <td 
                        key={dayIndex} 
                        id={`${date.toDateString()}-${hour}`} 
                        className="schedule-cell" // Class for styling
                    ></td>
                ))}
            </tr>
        ));
    };

    const clearTable = () => {
        let cells = document.querySelectorAll("td.schedule-cell");
        cells.forEach((cell) => {
            if (cell.id) {
                cell.style.backgroundColor = "";
            }
        });
    };

    const populateTable = () => {
        clearTable();

        scheduleData.forEach((item) => {
            let eventDate = new Date(item.date.year, item.date.month - 1, item.date.day, item.date.hour);

            if (eventDate >= weekDates[0] && eventDate <= weekDates[6]) {
                let eventHour = eventDate.getHours();
                let targetCell = document.getElementById(`${eventDate.toDateString()}-${eventHour}`);
                if (targetCell) {
                    targetCell.classList.add("scheduled-event"); // Use a class for background color
                }
            }
        });
    };

    useEffect(() => {
        if (scheduleData.length > 0) {
            populateTable();
        }
    }, [scheduleData, currentDate]);

    return (
        <div className="schedule-container">
            <h2 className="schedule-name">Weekly Schedule</h2>
            <div className="week-navigation">
                <button onClick={() => changeWeek(-1)}>Previous Week</button>
                <span>
                    {weekDates[0].toDateString()} - {weekDates[6].toDateString()}
                </span>
                <button onClick={() => changeWeek(1)}>Next Week</button>
            </div>
            <Breakline></Breakline>
            <div className="scrollable">
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th className="header-cell">Time/Day</th>
                            {weekDates.map((date, index) => (
                                <th key={index} className="header-cell">
                                    {date.toDateString()}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {createTable()}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScheduleTable
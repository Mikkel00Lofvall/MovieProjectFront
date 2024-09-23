import React, { useState, useEffect, useLayoutEffect } from 'react';
import "./css/schedule.css"
import Breakline from './breakline';

const ScheduleTable = ({ movieID }) => {
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
                console.log("Schedule Data:", result);  // Log the fetched schedule data
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
                {weekDates.map((date, dayIndex) => {
                    const cellId = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${hour}`;
                    return (
                        <td 
                            key={dayIndex} 
                            id={cellId}  // Format: YYYY-MM-DD-hour
                            className="schedule-cell"
                        ></td>
                    );
                })}
            </tr>
        ));
    };

    const clearTable = () => {
        let cells = document.querySelectorAll("td.schedule-cell");
        cells.forEach((cell) => {
            if (cell.id) {
                cell.style.backgroundColor = "transparent";
            }
        });
    };

    const populateTable = () => {
        clearTable();

        console.log("Populating table...");

        scheduleData.forEach((item) => {
            // Construct event date from the fetched data
            let eventDate = new Date(item.date.year, item.date.month - 1, item.date.day, item.date.hour);

            // Compare only the year, month, day, and hour to match the cell ID
            const eventId = `${eventDate.getFullYear()}-${(eventDate.getMonth() + 1).toString().padStart(2, '0')}-${eventDate.getDate().toString().padStart(2, '0')}-${eventDate.getHours()}`;

            console.log(`Event ID: ${eventId}`);

            // Try to get the target cell by matching the generated event ID
            let targetCell = document.getElementById(eventId);

            if (targetCell) {
                console.log(`Target cell found: ${eventId}`);
                targetCell.classList.add("scheduled-event"); // Use a class for background color
            } else {
                console.log(`No cell found for: ${eventId}`);
            }
        });
    };

    // Use useLayoutEffect to ensure the DOM is fully updated before modifying it
    useLayoutEffect(() => {
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

export default ScheduleTable;
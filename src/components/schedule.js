import React, { useState, useEffect } from 'react';
import "./css/schedule.css";
import { useNavigate } from 'react-router-dom';


let ScheduleTable = ({scheduleData, schedulelink}) => {
    let navigate = useNavigate();

    let handleNavigation = (schedule) => {
        if (schedule && schedule.id) {
          navigate(`${schedulelink}${schedule.id}`);
        } else {
          console.warn("Schedule ID is undefined");
        }
      };


    let daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    let getStartOfWeek = (date) => {
      let currentDay = date.getDay();
      let distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
      let monday = new Date(date);
      monday.setDate(date.getDate() - distanceToMonday);
      return monday;
    };
    
    let getDayOfWeek = (date) => {
      return daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1];
    };
    
    let [currentWeek, setCurrentWeek] = useState(getStartOfWeek(new Date()));
    
    let formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };
    
    let getWeekDays = (startOfWeek) => {
    let weekDays = [];
    for (let i = 0; i < 7; i++) {
        let day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        weekDays.push(day);
    }
    return weekDays;
    };
    
    let handlePreviousWeek = () => {
    let prevWeek = new Date(currentWeek);
    prevWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
    };
    
    let handleNextWeek = () => {
    let nextWeek = new Date(currentWeek);
    nextWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
    };
    
    let weekDays = getWeekDays(currentWeek); 

    let filteredScheduleData = scheduleData.filter(entry => {
    let { date } = entry.schedule;
    let scheduleDate = new Date(date.year, date.month - 1, date.day);
    return scheduleDate >= currentWeek && scheduleDate < new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
    });

    return (
        <div className='schedule-container'>
            <h1>Schedule For Movie</h1>

            <div className="week-navigation">
                <button onClick={handlePreviousWeek}>Previous Week</button>
                <button onClick={handleNextWeek}>Next Week</button>
            </div>

            <table className="schedule-table">
                <thead>
                    <tr>
                        {weekDays.map((day, index) => (
                            <th key={index}>{getDayOfWeek(day)} <br /> {formatDate(day)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {weekDays.map((day, index) => {
                        const daySchedules = filteredScheduleData.filter(entry => {
                            const { date } = entry.schedule;
                            const scheduleDate = new Date(date.year, date.month - 1, date.day);
                            return scheduleDate.getDate() === day.getDate();
                        });

                        return (
                            <td key={index}>
                                {daySchedules.length > 0 ? (
                                    daySchedules.map((entry, i) => {
                                        const schedule = entry.schedule;

                                        return (
                                            <div
                                                key={i}
                                                className="schedule-box"
                                                onClick={() => handleNavigation(schedule)}
                                            >
                                                <div className='event-box'>
                                                    {`Time: ${schedule.date.hour}:00`} <br />
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div>No Schedules for this day</div>
                                )}
                            </td>
                        );
                    })}
                </tbody>
            </table>
            </div>
        );
    };

  

export default ScheduleTable;

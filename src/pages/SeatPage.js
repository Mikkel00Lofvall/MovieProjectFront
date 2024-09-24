import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import "../css/seat.css";

const SeatPage = () => {
    let [FetchedData, setData] = useState([]);    
    let [loading, setLoading] = useState(true); 
    let { scheduleID } = useParams();
    useEffect(() => {
        const FetchScheduleAndMovieByID = async (id) => {
            try {
                let response = await fetch(`https://localhost:7296/api/Schedule/GetMovieAndScheduleByID/${id}`);
                if (!response.ok) {
                    console.log("Network was not okay!");
                }
                let result = await response.json();
                setData(result);
                console.log("Data:", result);
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        FetchScheduleAndMovieByID(scheduleID);
     }, [scheduleID])

     if (loading) return (
        <div className="page-seat-frame">
            <label>Loading</label>
        </div>
    );

    return (
      
      <div className='page-seat-frame'>
        <h2></h2>
      </div>
    );
  };
  
  export default SeatPage;
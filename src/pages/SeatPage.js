import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import "../css/seat.css";
import { Base64ToURL } from '../global/functions';

import TestData from "../global/testdata.js"

const SeatPage = () => {
    let calculatedPrice = 100;
    let [FetchedData, setData] = useState([]);    
    let [loading, setLoading] = useState(true); 
    let [DecryptedImageData, SetDecryptedImageData] = useState(null);
    let { scheduleID } = useParams();
    let [selectedSeatIds, setSelectedSeatIds] = useState([]);
    let [selectedAmountOfTickets, setAmountOfTickets] = useState(0);
    let [ticketMissMatchError, setMissMatchError] = useState("");

    // FOR TESTING PURPOSE ONLY! ////////////////////////////////////
    
    
        useEffect(() => {
            const FetchScheduleAndMovieByID = async () => {
                try {
                    setData(TestData.GetMovieAndScheduleByIDTest)
                    console.log(TestData.GetMovieAndScheduleByIDTest)

                } catch (err) {
                    console.log(err)
                } finally {
                    setLoading(false);
                }
            };

            FetchScheduleAndMovieByID(scheduleID);
            }, [scheduleID])
    

    /////////////////////////////////////////////////////////////////

    /*
    useEffect(() => {
        const FetchScheduleAndMovieByID = async (id) => {
            try {
                let response = await fetch(`https://localhost:7296/api/Schedule/GetMovieAndScheduleByID/${id}`);
                if (!response.ok) {
                    console.log("Network was not okay!");
                }
                let result = await response.json();
                console.log("Data:", result);
                SetDecryptedImageData(Base64ToURL(result.movie.frontPageImage.data)) 
                setData(result);

            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        FetchScheduleAndMovieByID(scheduleID);
     }, [scheduleID])

    */

    if (loading) return (
        <div className="page-seat-frame">
            <label>Loading</label>
        </div>
    );

    let ChunkSeats = (seats, size) => {
        let rows = [];
        for (let i = 0; i < seats.length; i += size) {
            rows.push(seats.slice(i, i + size));
        }
        return rows;
    }

    const handleSeatClick = (seatId) => {

        selectedSeatIds.forEach(function(id) {
            let seatTag = document.getElementById(id)
            seatTag.style.backgroundColor = "green"
        })
        selectedSeatIds = []
        setMissMatchError("")
        
        if (selectedAmountOfTickets > 0) {
            let seatTag = document.getElementById(seatId)
            seatTag.style.backgroundColor = "yellow"
            console.log("Selected Seat ID: ", seatId)
            selectedSeatIds.push(seatId);
    
            let currentSeatID = seatId;
            let seatsPerRow = FetchedData.hall.seatsOnRow;
            let currentColumn = 1;

            for (let i = 1; i < selectedAmountOfTickets; i++) {
                let nextSeatID = currentSeatID + seatsPerRow; 
                

                if (nextSeatID > FetchedData.hall.seats.length) {

                    currentColumn += (nextSeatID - FetchedData.hall.seats.length)
                    currentSeatID = currentColumn;
                    FetchedData.hall.seats.forEach(function(seat) {
                        if (currentSeatID == seat.id) {
                            if (!seat.isTaken) {
                                selectedSeatIds.push(seat.id)
                                seatTag = document.getElementById(seat.id);
                                seatTag.style.backgroundColor = "yellow";
                            } 

                            else i -= 1
                        }
                        else if (currentColumn == seat.id) {
                            if (!seat.isTaken) {
                                selectedSeatIds.push(seat.id)
                                seatTag = document.getElementById(seat.id);
                                seatTag.style.backgroundColor = "yellow";
                            }

                            else i -= 1
                        }

                    })

    
                    currentSeatID = currentColumn;

                    continue
                }

                FetchedData.hall.seats.forEach(function(seat) {
                    if (seat.id == nextSeatID) {
                        if (!seat.isTaken) {
                            selectedSeatIds.push(nextSeatID);
                            seatTag = document.getElementById(nextSeatID);
                            seatTag.style.backgroundColor = "yellow";
                        }

                        else {
                            if ((nextSeatID + seatsPerRow) > FetchedData.hall.seats.length) {
                                nextSeatID = nextSeatID - FetchedData.hall.seats.length
                                i -= 1
                            }
                            else nextSeatID = nextSeatID + seatsPerRow;
                        }
                    }

                    currentSeatID = nextSeatID;
                })

                console.log("Next Seat ID: ", nextSeatID)
                console.log("Calculated Next Seat ID: ", currentSeatID)
            }
    
            setSelectedSeatIds(selectedSeatIds);
            let uniqueArray = [];
            selectedSeatIds.forEach(value => {
                if (!uniqueArray.includes(value)) {
                    uniqueArray.push(value);
                }
            });

            if (uniqueArray.length != selectedAmountOfTickets) {
                setMissMatchError("The amount of seats selected does not match the amount of tickets selected, we advise to select a different seat location!")
            }
            console.log("Seats Selected IDs: ", selectedSeatIds);
        }

        console.log("Selected Seat ID: ", seatId)
    };

    const handleTicketInputAmountChange = (e) => {
        let value = e.target.value;
        setAmountOfTickets(value ? parseInt(value) : 0);
        console.log("Inputted Ticket Numbers: ", value);
        console.log("Amount of Tickets: ", value ? parseInt(value) : 0);
    };

    const SeatMap = ChunkSeats(FetchedData.hall.seats, FetchedData.hall.seatsOnRow).map((seatRow, rowIndex) => (
        <div className="seat-row">
        {seatRow.map((seat) => (
            <div
                id = {seat.id}
                key={seat.id}
                title={`Seat ID: ${seat.id} Seat Row: ${seat.rowName}`}
                className='page-seat-div'
                onClick={() => handleSeatClick(seat.id)}
                style={{
                    backgroundColor: seat.isTaken 
                        ? 'red'
                        : 'green',
                    cursor: 'pointer',
                }}
            >
            </div>
        ))}
    </div>
    ));

    return (
      
      <div className='page-seat-frame'>
        <div className='page-seat-flex-box'>
            <div className='page-seat-details-container'>
                <section className='page-seat-movie-detail-container'>
                    <img className="page-seat-moive-image" src={DecryptedImageData} alt={FetchedData.movie.name}/>
                    <h3 className="">{FetchedData.movie.name}</h3>
                </section>
                <section className='page-seat-selector-container'>
                    <h3>Select Seat Amount</h3>
                    <input type="number" value={selectedAmountOfTickets} onChange={(e) => handleTicketInputAmountChange(e)}></input>
                    <br></br>
                    <label className='page-seat-ticket-amount-error' style={{color: 'red'}}>{ticketMissMatchError}</label>
                    <h3>Price: {calculatedPrice}</h3>
                </section>
            </div>

            <section className='page-seat-container'>
                <div className='page-seat-chunks'>
                    {SeatMap}
                </div>
                <br></br>
                <div className='page-seat-screen'>
                    <label>Screen</label>
                </div>
            </section>
        </div>
      </div>
    );
  };
  
  export default SeatPage;
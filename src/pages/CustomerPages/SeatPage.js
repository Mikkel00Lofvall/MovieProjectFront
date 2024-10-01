import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import "../../css/CustomerCSS/seat.css";
import { Base64ToURL } from '../../global/functions';
import ToastManager from '../../components/toast/toastManager.js';

import TestData from "../../global/testdata.js"

const SeatPage = () => {
    let calculatedPrice = 100;
      

    let [DecryptedImageData, SetDecryptedImageData] = useState(null);
    let { scheduleID } = useParams();
    let [selectedSeatIds, setSelectedSeatIds] = useState([]);
    let [selectedAmountOfTickets, setAmountOfTickets] = useState(0);
    let [ticketMissMatchError, setMissMatchError] = useState("");

    // Fetched Data
    let [FetchedData, setData] = useState([]);  
    const [FetchedTickets, setTickets] = useState([]);

    // Load Dock
    let [loadingData, setLoadingData] = useState(true); 
    let [loadingTickets, setLoadingTickets] = useState(true); 

    // FOR TESTING PURPOSE ONLY! ////////////////////////////////////
    
    /*
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
    
    */
    /////////////////////////////////////////////////////////////////

    
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
                setLoadingData(false);
            }
        };

        const FetchTickets= async (id) => {
            try {
                let response = await fetch(`https://localhost:7296/api/Ticket/GetTicketWithScheduleID/${id}`);
                if (!response.ok) {
                    console.log("Network was not okay!");
                }
                let result = await response.json();
                console.log("Tickets:", result);
                setTickets(result);

            } catch (err) {
                console.log(err)
            } finally {
                setLoadingTickets(false);
            }
        };

        FetchTickets(scheduleID);
        FetchScheduleAndMovieByID(scheduleID);
     }, [scheduleID])



    if (loadingData || loadingTickets) return (
        <div className="page-seat-frame">
            <label>Loading</label>
        </div>
    );

    const CreateTicket = () => {
        if (selectedSeatIds.length > 0) 
        {
            selectedSeatIds.forEach(function(seatid) {
                let newTicketData = {
                    scheduleID: FetchedData.schedule.id,
                    seatID: seatid,
                    dateID: FetchedData.schedule.date.id
                }
    
                let userAction = async () => {
                    let response = await fetch("https://localhost:7296/api/Ticket/Create", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newTicketData)
                    });
                    
                    if (response.ok) {
                        console.log("");
                        window.addToast(`Ticket Booked successfully`, "success", 4000)
    
                        
                        
                    } else {
                        let errorMessage = await response.text();
                        window.addToast(`Failed due to server error \n Error message: ${errorMessage}`, "error", 4000)
                        
                    }
    
                    
                }
    
                userAction()
            })
        }
    }

    let ChunkSeats = (seats, size) => {
        let rows = [];
        for (let i = 0; i < seats.length; i += size) {
            rows.push(seats.slice(i, i + size));
        }
        return rows;
    }

    const handleMultipleSeatSelection = (seatIndex, rowIndex) => {
        let numTickets = selectedAmountOfTickets;
        let IDArray = [];
        const totalRows = Math.ceil(FetchedData.schedule.seats.length / FetchedData.hall.seatsOnRow);
        const totalColumns = FetchedData.hall.seatsOnRow;
    
        selectedSeatIds.forEach(function(seatID) {
            let seatTag = document.getElementById(seatID);
            if (seatTag) {
                seatTag.style.backgroundColor = "green";
            }
        });
    
        setSelectedSeatIds([]);
    
        let currentSeatIndex = seatIndex;
        let currentRowIndex = rowIndex;
        let selectedCount = 0;
    
        for (let i = 0; i < numTickets; i++) {
            if (currentSeatIndex >= totalColumns) {
                setMissMatchError("The amount of seats selected does not match the amount of tickets selected, we advise to select a different seat location!");
                break;
            }
    
            if (currentRowIndex >= totalRows) {
                currentRowIndex = 0;
                currentSeatIndex++;
            }
    
            let targetSeatRow = FetchedData.schedule.seats.slice(
                currentRowIndex * totalColumns,
                (currentRowIndex + 1) * totalColumns
            );
    
            if (targetSeatRow[currentSeatIndex] && 
                !targetSeatRow[currentSeatIndex].isTaken && 
                !FetchedTickets.some(ticket => ticket.seatID === targetSeatRow[currentSeatIndex].id)) {
                
                IDArray.push(targetSeatRow[currentSeatIndex].id);
                let seatTag = document.getElementById(targetSeatRow[currentSeatIndex].id);
                if (seatTag) {
                    seatTag.style.backgroundColor = "yellow";
                }
                selectedCount++;
            } else {
                setMissMatchError(`Seat ID ${targetSeatRow[currentSeatIndex].id} is already taken or selected.`);
            }
    
            currentRowIndex++;
        }
    
        if (selectedCount < numTickets) {
            setMissMatchError("The amount of seats selected does not match the amount of tickets selected, we advise to select a different seat location!");
        } else {
            setMissMatchError("");
        }
    
        console.log('Selected Seats: ', IDArray);
        setSelectedSeatIds(IDArray);
    };

    const handleTicketInputAmountChange = (e) => {
        let value = e.target.value;
        setAmountOfTickets(value ? parseInt(value) : 0);
        console.log("Inputted Ticket Numbers: ", value);
        console.log("Amount of Tickets: ", value ? parseInt(value) : 0);
    }; 

    const getSeatBackgroundColor = (seatId) => {
        return FetchedTickets.some(ticket => ticket.seatID === seatId) ? 'red' : 'green';
    };

    const getAllowedSeatClick = (seatId) => {
        return FetchedTickets.some(ticket => ticket.seatID === seatId) ? true : false
    }

    const SeatMap = ChunkSeats(FetchedData.schedule.seats, FetchedData.hall.seatsOnRow).map((seatRow, rowIndex) => (
        <div className="seat-row" key={rowIndex}>
            {seatRow.map((seat, index) => (
                <div
                    id={seat.id}
                    key={seat.id}
                    title={`Seat ID: ${seat.id} Seat Row: ${seat.rowName}`}
                    className='page-seat-div'
                    onClick={() => {
                        if (!getAllowedSeatClick(seat.id)) {
                            handleMultipleSeatSelection(index, rowIndex);
                        }
                    }}
                    style={{
                        backgroundColor: getSeatBackgroundColor(seat.id),
                        cursor: 'pointer',
                    }}
                >
                </div>
            ))}
        </div>
    ));


    return (
      
      <div className='page-seat-frame'>
        <ToastManager></ToastManager>
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
                <button onClick={CreateTicket}>Get Ticket</button>
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
  
  export default SeatPage
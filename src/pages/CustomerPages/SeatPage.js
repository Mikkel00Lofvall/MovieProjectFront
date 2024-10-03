import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import "../../css/CustomerCSS/seat.css";
import { Base64ToURL } from '../../global/functions';
import ToastManager from '../../components/toast/toastManager.js';
import PopupPage from '../../components/popup.js';
import Breakline from '../../components/breakline.js';
import TestData from "../../global/testdata.js"
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

const SeatPage = () => {
    let calculatedPrice = 15;
    const navigate = useNavigate();

    let [error, setError] = useState({});

    let [DecryptedImageData, SetDecryptedImageData] = useState(null);
    let { scheduleID } = useParams();
    let [selectedSeatIds, setSelectedSeatIds] = useState([]);
    let [selectedAmountOfTickets, setAmountOfTickets] = useState(0);
    let [ticketMissMatchError, setMissMatchError] = useState("");

    // Pay Site
    let [emailInput, setEmailInput] = useState("");
    let [phoneInput, setPhoneInput] = useState(0);
    let [cardInput, setCardInput] = useState(0);
    let [cvvInput, setCVVInput] = useState(0);
    let [nameOnCardInput, setNameOnCardInput] = useState("");
    let [expireDateInput, setExpireDateInput] = useState("");

    // Fetched Data
    let [FetchedData, setData] = useState([]);  
    let [FetchedTickets, setTickets] = useState([]);

    // Load Dock
    let [loadingData, setLoadingData] = useState(true); 
    let [loadingTickets, setLoadingTickets] = useState(true); 

    // Popup
    let [isPaySiteOpen, setIsPaySiteOpen] = useState(false);

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

    const FetchScheduleAndMovieByID = async (id) => {
        try {
            let response = await fetch(`https://localhost:7296/api/Schedule/GetMovieAndScheduleByID/${id}`);
            if (!response.ok) {
                setError({ result: false, code: response.status });
            }
            let result = await response.json();
            console.log("Data:", result);
            SetDecryptedImageData(Base64ToURL(result.movie.frontPageImage.data)) 
            setData(result);

        } catch (err) {
            setError({ result: false, code: "Network Error" });
        } finally {
            setLoadingData(false);
        }
    };

    const FetchTickets = async (id) => {
        try {
            let response = await fetch(`https://localhost:7296/api/Ticket/GetTicketWithScheduleID/${id}`);
            if (!response.ok) {
                setError({ result: false, code: response.status });
            }
            let result = await response.json();
            console.log("Tickets:", result);
            setTickets(result);

        } catch (err) {
            setError({ result: false, code: "Network Error" });
        } finally {
            setLoadingTickets(false);
        }
    };
    
    useEffect(() => {


        FetchTickets(scheduleID);
        FetchScheduleAndMovieByID(scheduleID);
     }, [scheduleID])

    if (error.result == false) {
        navigate(`/error/${error.code}`)
    }

    if (loadingData || loadingTickets) return (
        <div className="page-seat-frame">
            <label>Loading</label>
        </div>
    );

    const CreateTicket = () => {
        if (selectedSeatIds.length > 0 &&
            nameOnCardInput != "" &&
            cvvInput > 0 &&
            expireDateInput != "" &&
            cardInput > 0 &&
            emailInput != "" &&
            phoneInput > 0

        ) 
        {
            selectedSeatIds.forEach(function(seatid) {
                try {
                    let newTicketData = {
                        scheduleID: FetchedData.schedule.id,
                        seatID: seatid,
                        dateID: FetchedData.schedule.date.id,
                        email: emailInput,
                        phoneNumber: phoneInput
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
                        }
        
                        
                    }
        
                    userAction()        
                }

                catch(err) {
                    window.addToast(`Failed due to server error \n Error message: ${err}`, "error", 4000)
                }

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

    const toastStyle = {
        flexDirection: (FetchedData.schedule.seats.length) > 64 ? 'column' : 'row', 
    };

    return (
      
      <div className='page-seat-frame'>
        {isPaySiteOpen && (
            <PopupPage isCloseButtonIcon={true} onClose={() => {
                    setIsPaySiteOpen(false);
                }}>
                <main className="page-pay-container">
                    <div className='page-pay-flex-box'>
                        <section className='shoppingbag-section'>
                            <img className="page-pay-moive-image" src={DecryptedImageData} alt={FetchedData.movie.name}/>
                            <div className="page-pay-movie-header-container">
                                <div className='page-admin-schedule-details-grid-item'>
                                    <h2>{FetchedData.movie.name}</h2>
                                </div>

                                <div className="page-admin-schedule-details-grid-item">
                                    <label>Scheduled Date:</label>
                                    <label>{FetchedData.schedule.date.day} / {FetchedData.schedule.date.month} / {FetchedData.schedule.date.year}</label>
                                </div>
                                <div className="page-admin-schedule-details-grid-item">
                                    <label>Scheduled Time:</label>
                                    
                                    <label>
                                        {FetchedData.schedule.date.hour < 10 ? '0' + FetchedData.schedule.date.hour : FetchedData.schedule.date.hour}:
                                        {FetchedData.schedule.date.minute < 10 ? '0' + FetchedData.schedule.date.minute : FetchedData.schedule.date.minute}
                                    </label>
                                </div>
                                <div className='page-admin-schedule-details-grid-item'>
                                    <label>Tickets Amount: {selectedAmountOfTickets}</label>
                                </div>
                            </div>
                        </section>
                        <section className='page-pay-information-container'>
                            <div className='page-pay-information-child-container'>
                                <label>Email:</label>
                                <input type='text' onChange={(e) => {setEmailInput(e.target.value)}}></input>
                            </div>
                            <div className='page-pay-information-child-container'>
                                <label>Phone:</label>
                                <input type='number' onChange={(e) => {setPhoneInput(e.target.value)}}></input>
                            </div>
                            <Breakline></Breakline>
                            <h3>Price: {selectedAmountOfTickets*calculatedPrice} $</h3>
                            <div className='page-pay-information-child-container'>
                                <label>Card Number:</label>
                                <input type='number' onChange={(e) => {setCardInput(e.target.value)}}></input>
                            </div>
                            <div className='page-pay-information-child-container'>
                                <label>CVV / CVC / CSV:</label>
                                <input type='number' onChange={(e) => {setCVVInput(e.target.value)}}></input>
                            </div>
                            <div className='page-pay-information-child-container'>
                                <label>Name On Card:</label>
                                <input type='text' onChange={(e) => {setNameOnCardInput(e.target.value)}}></input>
                            </div>
                            <div className='page-pay-information-child-container'>
                                <label>Expire Date:</label>
                                <input type='date' onChange={(e) => {setExpireDateInput(e.target.value)}}></input>
                            </div>

                            <button onClick={() => {
                                CreateTicket()
                            }}>Buy</button>
                        </section>
                    </div>
                </main>
            </PopupPage>
        )}
        <ToastManager></ToastManager>
        <div className='page-seat-flex-box' style={toastStyle}>
            <div className='page-seat-details-container'>
                <section className='page-seat-movie-detail-container'>
                    <img className="page-seat-moive-image" src={DecryptedImageData} alt={FetchedData.movie.name}/>
                    <div className='page-seat-movie-detail-sub-container'>
                        <h2 className="">{FetchedData.movie.name}</h2>
                        <Breakline></Breakline>
                        <section className='page-seat-sub-detail-flex'>
                            <div className='page-seat-sub-detail-flex-item'>
                                <div className="page-seat-schedule-details-grid-item">
                                    <label>Scheduled Time:</label>
                                    <label>
                                        {FetchedData.schedule.date.hour < 10 ? '0' + FetchedData.schedule.date.hour : FetchedData.schedule.date.hour}:
                                        {FetchedData.schedule.date.minute < 10 ? '0' + FetchedData.schedule.date.minute : FetchedData.schedule.date.minute}
                                    </label>
                                </div>
                                
                                <div className="page-seat-schedule-details-grid-item">
                                    <label>Scheduled Date:</label>
                                    <label>{FetchedData.schedule.date.day} / {FetchedData.schedule.date.month} / {FetchedData.schedule.date.year}</label>
                                </div>
                                <section className='page-seat-selector-container'>
                                    <h3>Select Seat Amount</h3>
                                    <input type="number" value={selectedAmountOfTickets} onChange={(e) => handleTicketInputAmountChange(e)}></input>
                                    <br></br>
                                    <label className='page-seat-ticket-amount-error' style={{color: 'red'}}>{ticketMissMatchError}</label>
                                    <h3>Price: {calculatedPrice*selectedAmountOfTickets} $</h3>
                                    <button onClick={() => {setIsPaySiteOpen(!isPaySiteOpen)}} className='page-seat-open-pay-button'>Get Ticket</button>
                                </section>
                                
                            </div>
                        </section>
                    </div>
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
  
  export default SeatPage
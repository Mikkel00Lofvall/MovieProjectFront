import AdminMenu from "../../components/adminMenu";
import Breakline from "../../components/breakline";
import "../../css/AdminCSS/AdminSchedule.css"
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Base64ToURL } from "../../global/functions";
import ToastManager from "../../components/toast/toastManager";
import PopupPage from "../../components/popup";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';


const AdminSchedulePage = () => {
    const { id } = useParams();

    //Ticket Deletion

    //
    let [FetchedScheduleData, setFetchedScheduleData] = useState(null)
    let [FetchedTickets, setTickets] = useState([]);
    const navigate = useNavigate();

    //Loading dock
    let [LoadingFetchedScheduleData, setLoadingFetchedScheduleData] = useState(true);
    let [loadingTickets, setLoadingTickets] = useState(true); 

    const handleRedirect = (pageURL) => {
        navigate(pageURL);
    };

    const FetchScheduleByID = async () => {
        try {
            let response = await fetch(`https://localhost:7296/api/Schedule/GetMovieAndScheduleByID/${id}`);
            if (!response.ok) {
                window.addToast(`Failed due to server error \n Error message: ${response.status}`, "error", 4000)
            }

            let result = await response.json();

            setFetchedScheduleData(result);
            console.log("Schedule Data:", result);
        } catch (err) {
            window.addToast(`Failed due to server error \n Error message: ${err}`, "error", 4000)
        } finally {
            setLoadingFetchedScheduleData(false);
        }
    };

    const FetchTickets = async () => {
        try {
            let response = await fetch(`https://localhost:7296/api/Ticket/GetTicketWithScheduleID/${id}`);
            if (!response.ok) {
                window.addToast(`Failed due to server error \n Error message: ${response.status}`, "error", 4000)
            }
            let result = await response.json();
            console.log("Tickets:", result);
            setTickets(result);

        } catch (err) {
            window.addToast(`Failed due to server error \n Error message: ${err}`, "error", 4000)
        } finally {
            setLoadingTickets(false);
        }
    };


    const DeleteSchedule = async (scheduleID) => {
        try {
            let response = await fetch(`https://localhost:7296/api/Schedule/DeleteSchedule/${scheduleID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        
        
            if (response.headers.get('Content-Type')?.includes('application/json')) {
                window.addToast(`Deleted Schedule Successfully`, "success", 4000)
                handleRedirect("/admin");
            } else {
                window.addToast(`Deleted Schedule Successfully`, "success", 4000)
                handleRedirect("/admin");
            }
        }
        catch(err) {
            window.addToast(`Failed due to server error \n Error message: ${err}`, "error", 4000)
        }


    };

    const DeleteTicket = async (ticketID) => {
        try {
            let response = await fetch(`https://localhost:7296/api/Ticket/Delete/${ticketID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        
            if (!response.ok) {
                console.log("Network request failed with status:", response.status);
                window.addToast(`Failed due to server error \n Error message: ${response.status}`, "error", 4000)
                return;
            }
        
            let result;
            if (response.headers.get('Content-Type')?.includes('application/json')) {
                result = await response.json();
                console.log("Theme Data:", result);
                window.addToast("Ticket Was Deleted", "success", 4000)
                FetchTickets()
            } else {
                console.log("No JSON response, theme deleted successfully.");
                window.addToast("Ticket Was Deleted", "success", 4000)
                FetchTickets()
            }
        }
        catch(err) {
            window.addToast(`Failed due to server error \n Error message: ${err}`, "error", 4000)
        }

    };

    
    const NavigateToHome = () => {
        navigate("/")
    }

    useEffect(() => {
        const checkAuth = async () => {
            try {
                let response = await fetch('https://localhost:7296/api/Account/CheckAuth', {
                    method: 'POST',
                    credentials: 'include',
                });
        
                if (!response.ok) {
                    NavigateToHome()
                } 
            } catch (error) {
                return false;
            }

            FetchScheduleByID();
            FetchTickets()
        }
        checkAuth();
    }, [id]);




    if (LoadingFetchedScheduleData || loadingTickets) {
        return (
            <div className="page-admin--loading-frame">
                <h2>Loading Data</h2>
            </div>
        );
    }

    const getSeatBackgroundColor = (seatId) => {
        return FetchedTickets.some(ticket => ticket.seatID === seatId) ? 'red' : 'green';
    };

    let ChunkSeats = (seats, size) => {
        let rows = [];
        for (let i = 0; i < seats.length; i += size) {
            rows.push(seats.slice(i, i + size));
        }
        return rows;
    }

    const SeatMap = ChunkSeats(FetchedScheduleData.schedule.seats, FetchedScheduleData.hall.seatsOnRow).map((seatRow, rowIndex) => (
        <div className="seat-row" key={rowIndex}>
            {seatRow.map((seat, index) => (
                <div
                    id={seat.id}
                    key={seat.id}
                    title={`Seat ID: ${seat.id} Seat Row: ${seat.rowName}`}
                    className='page-seat-div'
                    onClick={(e) => {
                        FetchedTickets.map((ticket) => {
                            if (ticket.seatID == seat.id) {
                                e.stopPropagation();
                                const buttons = [
                                    {
                                        label: "Yes",
                                        action: () => DeleteTicket(ticket.id)
                                    },
                                    {
                                        label: "No",
                                        action: () => {}
                                    }
                                ];
            
                                window.addToast(`This cannot be undone \n are you sure?`, "warning", 100000, buttons);
                            }
                        })
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
        <div className="page-admin-frame">
            <ToastManager></ToastManager>
            <AdminMenu></AdminMenu>


            <section className="page-admin-header">
                <h2>Schedule</h2>
            </section>


            <Breakline></Breakline>
            <section className="page-admin-tool-button-bundle">
            </section>
            <div className="page-admin-schedule-content">
                <main className="page-admin-schedule-container">
                    <section className="page-admin-schedule-image-container">
                        <img src={Base64ToURL(FetchedScheduleData.movie.frontPageImage.data)}></img>
                    </section>
                    <section className="page-admin-schedule-details-container">
                        <h2 className="page-admin-schedule-movie-name-header">{FetchedScheduleData.movie.name}</h2>
                        <Breakline></Breakline>
                        <article className="page-admin-schedule-details-flex-container">
                            <section className="page-admin-schedule-details-grid">
                                <div className="page-admin-schedule-details-grid-item">
                                    <label>Duration:</label>
                                    <label>{FetchedScheduleData.movie.details.durationInMinutes}</label>
                                </div>
                                <div className="page-admin-schedule-details-grid-item">
                                    <label>Scheduled Date:</label>
                                    <label>{FetchedScheduleData.schedule.date.day} / {FetchedScheduleData.schedule.date.month} / {FetchedScheduleData.schedule.date.year}</label>
                                </div>
                                <div className="page-admin-schedule-details-grid-item">
                                    <label>Scheduled Time:</label>
                                    
                                    <label>
                                        {FetchedScheduleData.schedule.date.hour < 10 ? '0' + FetchedScheduleData.schedule.date.hour : FetchedScheduleData.schedule.date.hour}:
                                        {FetchedScheduleData.schedule.date.minute < 10 ? '0' + FetchedScheduleData.schedule.date.minute : FetchedScheduleData.schedule.date.minute}
                                    </label>
                                </div>
                                <div className="page-admin-schedule-details-grid-item">
                                    <label>Room:</label>
                                    <label>
                                        {FetchedScheduleData.hall.name}
                                    </label>
                                </div>

                            </section>
                            <div className="page-admin-schedule-details-button-bundle">
                                <button onClick={() => {
                                    const buttons = [
                                        {
                                            label: "Yes",
                                            action: () => DeleteSchedule(FetchedScheduleData.schedule.id)
                                        },
                                        {
                                            label: "No",
                                            action: () => {}
                                        }
                                    ];
                                    
                                    window.addToast(`This cannot be undone \n are you sure?`, "warning", 100000, buttons);
                                    }}>Delete</button>
                            </div>
                        </article>
                    </section>
                </main>
                <section className="page-admin-schedule-seat-container">
                    <h3>Ticket Bookings</h3>
                    <div className='page-seat-chunks'>
                        {SeatMap}
                    </div>
                </section>
            </div>
            
        </div>
    )
};

export default AdminSchedulePage;
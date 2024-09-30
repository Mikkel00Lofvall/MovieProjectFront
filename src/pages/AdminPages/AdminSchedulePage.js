import AdminMenu from "../../components/adminMenu";
import Breakline from "../../components/breakline";
import "../../css/AdminCSS/AdminSchedule.css"
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Base64ToURL } from "../../global/functions";
import ToastManager from "../../components/toast/toastManager";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';


const AdminSchedulePage = () => {
    const { id } = useParams();

    let [FetchedScheduleData, setFetchedScheduleData] = useState(null)
    const navigate = useNavigate();

    //Loading dock

    let [LoadingFetchedScheduleData, setLoadingFetchedScheduleData] = useState(true);

    const handleRedirect = (pageURL) => {
        navigate(pageURL);
    };

    const FetchScheduleByID = async () => {
        try {
            let response = await fetch(`https://localhost:7296/api/Schedule/GetMovieAndScheduleByID/${id}`);
            if (!response.ok) {
                console.log("Network was not okay!")
                return
            }

            let result = await response.json();

            setFetchedScheduleData(result);
            console.log("Schedule Data:", result);
        } catch (err) {
            let errorMessage = await err.text();
            window.addToast(`Failed due to server error \n Error message: ${errorMessage}`, "error", 4000)
        } finally {
            setLoadingFetchedScheduleData(false);
        }
    };


    const DeleteSchedule = async (scheduleID) => {
        let response = await fetch(`https://localhost:7296/api/Schedule/DeleteSchedule/${scheduleID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            let errorMessage = await response.text();
            window.addToast(`Failed due to server error \n Error message: ${errorMessage}`, "error", 4000)
        }
    
        if (response.headers.get('Content-Type')?.includes('application/json')) {
            window.addToast(`Deleted Schedule Successfully`, "success", 4000)
            handleRedirect("/admin");
        } else {
            window.addToast(`Deleted Schedule Successfully`, "success", 4000)
            handleRedirect("/admin");
        }

    };

    

    useEffect(() => {
        FetchScheduleByID();
    }, [id])

    if (LoadingFetchedScheduleData) {
        return (
            <div className="page-admin-frame">
                <label>Loading</label>
            </div>
        );
    }

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
        </div>
    )
};

export default AdminSchedulePage;
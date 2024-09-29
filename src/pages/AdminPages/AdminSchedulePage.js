import AdminMenu from "../../components/adminMenu";
import Breakline from "../../components/breakline";
import "../../css/AdminCSS/AdminSchedule.css"
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Base64ToURL } from "../../global/functions";


const AdminSchedulePage = () => {
    const { id } = useParams();

    let [FetchedScheduleData, setFetchedScheduleData] = useState(null)


    //Loading dock

    let [LoadingFetchedScheduleData, setLoadingFetchedScheduleData] = useState(true);


    const DeleteSchedule = async (scheduleID) => {
        let response = await fetch(`https://localhost:7296/api/Schedule/DeleteSchedule/${scheduleID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            console.log("Network request failed with status:", response.status);
            return;
        }
    
        let result;
        if (response.headers.get('Content-Type')?.includes('application/json')) {
            result = await response.json();
            console.log("Theme Data:", result);
        } else {
            console.log("No JSON response, theme deleted successfully.");
        }

    };

    const FetchScheduleByID = async () => {
        try {
            let response = await fetch(`https://localhost:7296/api/Schedule/GetMovieAndScheduleByID/${id}`);
            if (!response.ok) {
                console.log("Network was not okay!")
                return
            }

            if (response == "No Schedules for this movie!") {
                console.log("No Schedules for this movie!")
            }
            let result = await response.json();

            setFetchedScheduleData(result);
            console.log("Schedule Data:", result);
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingFetchedScheduleData(false);
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
                            <button onClick={() => {DeleteSchedule(FetchedScheduleData.schedule.id)}}>Delete</button>
                        </div>
                    </article>
                </section>
            </main>
        </div>
    )
};

export default AdminSchedulePage;
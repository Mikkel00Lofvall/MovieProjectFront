import "../../css/CustomerCSS/home.css"
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Base64ToURL } from "../../global/functions.js"
import PopupPage from "../../components/popup";
import TicketPage from "../CustomerPages/TicketPage";
import Cookies from 'js-cookie';

const HomePage = () => {
    let [loading, setLoading] = useState(true); 
    let [movies, setData] = useState([]);

    let [selectedMovieID, setSelectedMovieID] = useState(0);
    let [scheduleData, setScheduleData] = useState([]);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    
    const checkAuthStatus = () => {
        const token = Cookies.get('MovieProjectCookie');
        console.log("Cookie Value: ", !!token)
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await fetch(`https://localhost:7296/api/Movie/GetMovies`);
                if (!response) {
                    console.log("Network was not ok!")
                }
                let result = await response.json()
                for (let i = 0; i < result.length; i++) {
                    result[i].frontPageImage = Base64ToURL(result[i].frontPageImage.data)  
                }

                setData(result)
                console.log(result)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, []);

    const MovieContainerRef = React.useRef(null);

    const FetchSchedulesByMovieID = async (movieID) => {
        try {
            let response = await fetch(`https://localhost:7296/api/Schedule/GetSchedulesWithMovieID/${movieID}`);
            if (!response.ok) {
                console.log("Network was not okay!")
                return
            }

            if (response == "No Schedules for this movie!") {
                console.log("No Schedules for this movie!")
            }
            let result = await response.json();

            setScheduleData(result);
            console.log("Schedule Data:", result);
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    const scrollUp = () => {
        if (MovieContainerRef.current) {
            MovieContainerRef.current.scroll({
                top: MovieContainerRef.current.scrollTop - 300,
                behavior: 'smooth'
            });
        }
    };

    const scrollDown = () => {
        if (MovieContainerRef.current) {
            MovieContainerRef.current.scroll({
                top: MovieContainerRef.current.scrollTop + 300,
                behavior: 'smooth'
            });
        }
    };



    let moviesShownList = movies.map(function(movie) {

        return ( 
            <section className="movie-box" key={movie.key}>

                <img className="movie-image" src={movie.frontPageImage} alt={movie.name} />
                <div className="movie-desc-box">
                    <h3 className="movie-box-name">{movie.name}</h3>
                    <h3 className="movie-box-date">{movie.details.releaseDate}</h3>
                    <div className="movie-button-bundle">
                        <div className="movie-box-button">
                            <nav>
                                <Link to={`/read-more/${movie.key}`} className="movie-button-bundle-link">Read More</Link>
                            </nav>
                        </div>
                        <div className="movie-box-button" onClick={() => {
                            setIsScheduleOpen(!isScheduleOpen);
                            setScheduleData([]);
                            FetchSchedulesByMovieID(movie.key);
                            setSelectedMovieID(movie.key);
                        }}>
                            Buy Tickets
                        </div>
                    </div>
                </div>
            </section>
        );
    });

    if (loading) return (
        <div className="page-home-frame">
            <label>Loading</label>
        </div>
    );

    return (
        <div className="page-home-frame">
            {isScheduleOpen && (
                <PopupPage onClose={() => {
                    setIsScheduleOpen(false);
                }}>
                    <TicketPage fetchedData={scheduleData} movieID={selectedMovieID} />
                </PopupPage>
            )}
            <section className="flex-box-home-page">
                <div className="left-curtain"></div>
                <div className="content-container">
                    <main className="show-scrollbar">
                        <div className="movies-container" id="movies-container" ref={MovieContainerRef}>
                                {moviesShownList}
                        </div>
                    </main>
                    <section className="scroll-button-bundle">
                        <button onClick={() => scrollUp()} className="scroll-button-up" >
                            <i class="bi bi-arrow-up-circle"></i>
                        </button>
                        <button onClick={() => scrollDown()} className="scroll-button-down" >
                            <i class="bi bi-arrow-down-circle"></i>
                        </button>
                    </section>
                </div>
                <div className="right-curtain"></div>
            </section>

        </div>

    );
  };
  
export default HomePage;
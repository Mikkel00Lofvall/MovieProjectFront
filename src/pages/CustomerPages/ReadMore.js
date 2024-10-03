import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import "../../css/CustomerCSS/readmore.css"
import "../../components/breakline" 
import 'bootstrap-icons/font/bootstrap-icons.css';
import Breakline from "../../components/breakline"
import PopupPage from '../../components/popup';
import { Base64ToURL } from '../../global/functions';
import TicketPage from '../CustomerPages/TicketPage';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

const ReadMorePage = () => {
    let { id } = useParams();
    let [scheduleData, setScheduleData] = useState([]);
    let [movie, setData] = useState(null);
    let [error, setError] = useState({});

    let [isPopupOpen, setIsPopupOpen] = useState(false); 
    let FetchedSchedule = useRef(false);
    let [FetchedThemesForMovie, setFetchedThemesForMovie] = useState([]);

    const [ImagesForMovie, setImagesAmount] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);


    // Loading Dock
    let [LoadingSchedules, setLoadingSchedules] = useState(true);
    let [LoadingThemes, setLoadingThemes] = useState(true);
    let [LoadingMovie, setLoadingMovie] = useState(true);

    const navigate = useNavigate();

    const ScrollLeft = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? ImagesForMovie.length - 1  : prevIndex - 1));
    };

    const ScrollRight = () => {
        setCurrentIndex((prevIndex) => (prevIndex === ImagesForMovie.length - 1 ? 0 : prevIndex + 1));
    };

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);

      };
    
      const closePopup = () => {
        setIsPopupOpen(false);
      };

      const FetchThemesFromMovie = async () => {
        try {
            let response = await fetch(`https://localhost:7296/api/Theme/GetThemesWithMovieID/${id}`);
            if (!response.ok) {
                setError({ result: false, code: response.status });
            }

            let result = await response.json();

            setFetchedThemesForMovie(result);
            console.log("Movie Theme Data:", result);
        } catch (err) {
            setError({ result: false, code: "Network Error" });
        } finally {
            setLoadingThemes(false);
        }

    };

    useEffect(() => {


        FetchThemesFromMovie();
    }, [id])

    const fetchData = async () => {
        try {
            let response = await fetch(`https://localhost:7296/api/Movie/GetMovieWithId/${id}`);
            if (!response.ok) {
                setError({ result: false, code: response.status });
            }
            let result = await response.json()
            for (let i = 0; i < result.imagesBlobs.length; i++) {
                result.imagesBlobs[i] = Base64ToURL(result.imagesBlobs[i].data)  
            }
            setData(result)
            setImagesAmount(result.imagesBlobs)
            console.log("Movie Data: ", result)
        } catch (err) {
            setError({ result: false, code: "Network Error" });
        } finally {
            setLoadingMovie(false)
        }
    };


    useEffect(() => {




        fetchData();
    }, [id]);

    useEffect(() => {
        FetchedSchedule.current = false
    }, [id])




    const FetchSchedulesByMovieID = async () => {
        try {
            let response = await fetch(`https://localhost:7296/api/Schedule/GetSchedulesWithMovieID/${id}`);
            if (!response.ok) {
                setError({ result: false, code: response.status });
            }
            let result = await response.json();
            setScheduleData(result);
            console.log("Schedule Data:", result);
        } catch (err) {
            setError({ result: false, code: "Network Error" });
        } finally {
            setLoadingSchedules(false);
        }
    };

    if (error.result == false) {
        navigate(`/error/${error.code}`)
    }

    if (LoadingMovie || LoadingThemes) {
        console.log("------------- Load Dock -------------");
        console.log(" Schedules: ", LoadingSchedules);
        console.log(" Movie: ", LoadingMovie);
        console.log(" Themes: ", LoadingThemes);
        console.log("------------- Load Dock -------------");
        return (
            <div className="page-read-more-frame">
                <h2>Loading</h2>
            </div>
        );
    }

    
    const ThemesList = FetchedThemesForMovie.map(theme => {
        return (
            <label>{theme.name}, </label>
        );
    });

    const formatDetailName = (detailName) => {
        return detailName
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    let detailsContainers = Object.entries(movie.details).map(([detailName, detailValue]) => {
        return (
            <div key={detailName}>
            <Breakline></Breakline>
                <div className='details-container'>
                    <h3 className='detail-name'>{formatDetailName(detailName)}</h3>
                    <h3 className='detail-value'>{detailValue ? detailValue : 'Not Givin'}</h3>
                </div>
            </div>

        );
    })


    return (
        <div className="page-read-more-frame" onLoad={() => {
            if (id && !FetchedSchedule.current) {
                setScheduleData([]);
                FetchSchedulesByMovieID(id);
                FetchedSchedule.current = true;
            }
        }}>
            {isPopupOpen && (
                <PopupPage onClose={closePopup}>
                    <TicketPage fetchedData={scheduleData} link={"/seat-selector/"}></TicketPage>
                </PopupPage>
            )}
            <h2 className="movie-name">{movie.name}</h2>
            <div className="page-read-more-scroll-container">
                <iframe
                    src="https://www.youtube.com/embed/9u5Y-HZ7Vf4" // Pass the iframe source here
                    title="Movie Trailer"
                    frameBorder="0"
                    allowFullScreen
                    className="iframe-style"
                ></iframe>
                {ImagesForMovie.length > 0 && (
                    <img 
                        src={ImagesForMovie[currentIndex]} 
                        alt={`Movie Image ${currentIndex}`} 
                        className='page-read-more-movie-image' 
                    />
                )}
                <div className="image-navigation-buttons">
                    <button className="scroll-button-left" onClick={ScrollLeft}>
                        <i className="bi bi-arrow-left-circle"></i>
                    </button>
                    <button className="scroll-button-right" onClick={ScrollRight}>
                        <i className="bi bi-arrow-right-circle"></i>
                    </button>
                </div>
            </div>

            <section>
                <div className='info-container'>
                    <section className='details-flex-box'>
                        <h3 className='details-header'>Details</h3>
                        {detailsContainers}
                    </section>
                    <div className='movie-information-container'>
                        <section className='movie-description-container'>
                            <h3 className='description-header'>Description</h3>
                            <Breakline></Breakline>
                            <label>{movie.description}</label>
                            <br></br>
                        </section>
                        <section className='movie-themes-container'>
                            <h3 className='themes-header'>Themes</h3>
                            <Breakline></Breakline>
                            <div>{ThemesList}</div>
                            <br></br>
                        </section>
                    </div>

                </div>
                <div className="ticket-button-container">
                    <div className="ticket-button" onClick={togglePopup}>
                        <i className="bi bi-ticket-perforated"></i>
                        <div>Buy Tickets</div>
                    </div>
                </div>
            </section>
        </div>

    );
} 

export default ReadMorePage
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import "../css/readmore.css"
import "../components/breakline" 
import 'bootstrap-icons/font/bootstrap-icons.css';
import Breakline from '../components/breakline';
import { Link } from "react-router-dom";
import PopupPage from '../components/popup';
import { Base64ToURL } from '../global/functions';
import TicketPage from './TicketPage';

const ReadMorePage = () => {
    const { id } = useParams();
    let [scheduleData, setScheduleData] = useState([]);
    const [movie, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false); 

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);

      };
    
      const closePopup = () => {
        setIsPopupOpen(false);
      };


    const ImageContainerRef = React.useRef(null);
    const viewportWidth = window.innerWidth;
  
    const ScrollLeft = () => {
        if (ImageContainerRef.current) {
            ImageContainerRef.current.scroll({
                left: ImageContainerRef.current.scrollLeft - viewportWidth,
                behavior: 'smooth'
            });
        }
    };

    const ScrollRight = () => {
        if (ImageContainerRef.current) {
            const container = ImageContainerRef.current;
            const children = Array.from(container.children);
            
            const excludeSelectors = '.scroll-button-left, .scroll-button-right';
            
            const excludedWidth = children
                .filter(child => child.matches(excludeSelectors))
                .reduce((total, child) => total + child.offsetWidth, 0);
            
            container.scroll({
                left: container.scrollLeft + viewportWidth - excludedWidth,
                behavior: 'smooth'
            });
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await fetch(`https://localhost:7296/api/Movie/GetMovieWithId/${id}`);
                if (!response) {
                    throw new Error("Network was not okay!")
                }
                let result = await response.json()
                for (let i = 0; i < result.imagesBlobs.length; i++) {
                    result.imagesBlobs[i] = Base64ToURL(result.imagesBlobs[i].data)  
                }
                setData(result)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, [id]);


    const FetchSchedulesByMovieID = async (movieID) => {
        try {
            let response = await fetch(`https://localhost:7296/api/Schedule/GetSchedulesWithMovieID/${movieID}`);
            if (!response.ok) {
                throw new Error("Network was not okay!");
            }
            let result = await response.json();
            setScheduleData(result);
            console.log("Schedule Data:", result);
        } catch (err) {
            throw new Error(err)
        } finally {
            setLoading(false);
        }
    };



    if (loading) return (
        <div className="page-read-more-frame">
            <h2>Loading</h2>
        </div>
    );
    if (error) return (        
        <div className="page-read-more-frame">
            <h2>Error</h2>
        </div>
    );

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
                    <h3 className='detail-value'>{detailValue ? detailValue : 'N/A'}</h3>
                </div>
            </div>

        );
    })

    let movieImages = movie.imagesBlobs.map(function(blob) {
        return (
            <img src={blob} alt="Random Image 1" />
        );
    });

    return (
        <div className="page-read-more-frame" onLoad={() => {
            setScheduleData([]);
            FetchSchedulesByMovieID(movie.key);
        }}>
            {isPopupOpen && (
                <PopupPage onClose={closePopup}>
                    <TicketPage scheduleData={scheduleData}></TicketPage>
                </PopupPage>
            )}
            <h2 className="movie-name">{movie.name}</h2>
            <div className="outer-container">
                <button className="scroll-button-left" onClick={() => ScrollLeft()}>
                    <i className="bi bi-arrow-left-circle"></i>
                </button>

                <div className="scroll-container" ref={ImageContainerRef}>
                    <iframe 
                        width="560" 
                        height="315" 
                        src={movie.TrailerLink} 
                        title="The Matrix Trailer" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                    </iframe>
                    {movieImages}
                </div>

                <button className="scroll-button-right" onClick={() => ScrollRight()}>
                    <i className="bi bi-arrow-right-circle"></i>
                </button>
            </div>

            <section>
                <div className='info-container'>
                    <section className='details-flex-box'>
                        <h3 className='details-header'>Details</h3>
                        {detailsContainers}
                    </section>
                    <section className='movie-description-container'>
                        <h3 className='description-header'>Description</h3>
                        <Breakline></Breakline>
                        <label>{movie.description}</label>
                    </section>
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
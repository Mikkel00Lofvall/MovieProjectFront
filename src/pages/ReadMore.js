import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import "../css/readmore.css"
import "../components/breakline" 
import 'bootstrap-icons/font/bootstrap-icons.css';
import Breakline from '../components/breakline';

const ReadMorePage = () => {
    const details = ["Release Date", "Rating", "Duration", "Directed By", "Studio"]
    const { id } = useParams();
    //const [movie, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); 
    const movie = {
        name:"Hello World",
        frontPageImage:"https://picsum.photos/200/300",
        blobs: [
            "https://picsum.photos/600/600?random=1",
            "https://picsum.photos/600/600?random=2",
            "https://picsum.photos/600/600?random=3",
            "https://picsum.photos/600/600?random=4",
            "https://picsum.photos/600/600?random=5",
        ],
        key:1,
        date:"2.10.2003",
        TrailerLink: "https://www.youtube.com/embed/vKQi3bBA1y8",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }

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
            // Get the container and its children
            const container = ImageContainerRef.current;
            const children = Array.from(container.children);
            
            // Define selectors for elements to exclude
            const excludeSelectors = '.scroll-button-left, .scroll-button-right'; // Adjust based on your button classes
            
            // Calculate the total width of excluded elements
            const excludedWidth = children
                .filter(child => child.matches(excludeSelectors))
                .reduce((total, child) => total + child.offsetWidth, 0);
            
            // Scroll the container, excluding the width of the buttons
            container.scroll({
                left: container.scrollLeft + viewportWidth - excludedWidth,
                behavior: 'smooth'
            });
        }
    };


    useEffect(() => {
        /*const fetchData = async () => {
            try {
                let response = await fetch(`https://localhost:7296/api/Movie/GetMovieWithId/${id}`);
                if (!response) {
                    throw new Error("Network was not okay!")
                }
                let result = await response.json()
                setData(result)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    */}, [id]);

    let detailsContainers = details.map(function(detail) {
        return (
            <div>
            <Breakline></Breakline>
                <div className='details-container'>
                    <h3 className='detail-name'>{detail}</h3>
                    <h3 className='detail-value'>Some Date</h3>
                </div>
            </div>

        );
    })

    let movieImages = movie.blobs.map(function(blob) {
        return (
            <img src={blob} alt="Random Image 1" />
        );
    });

    //if (loading) return (<h2>Loading</h2>);
    //if (error) return (<h2>Error</h2>);

    return (
        <div className="page-read-more-frame">
            <h2 className="movie-name">{movie.name}</h2>
            <div className="scroll-container" ref={ImageContainerRef}>
                <button className="scroll-button-left" onClick={() => ScrollLeft()}>
                    <i class="bi bi-arrow-left-circle"></i>
                </button>
                <iframe 
                    width="560" 
                    height="315" 
                    src={movie.TrailerLink} 
                    title="The Matrix Trailer" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
                {movieImages}   
                <button className="scroll-button-right" onClick={() => ScrollRight()}>
                    <i class="bi bi-arrow-right-circle"></i>
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
            </section>
        </div>

    );
} 

export default ReadMorePage
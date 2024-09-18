import "../css/home.css"
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const HomePage = () => {
    let [loading, setLoading] = useState(true); 
    let [movies, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await fetch(`https://localhost:7296/api/Movie/GetMovies`);
                if (!response) {
                    throw new Error("Network was not okay!")
                }
                let result = await response.json()
                for (let i = 0; i < result.length; i++) {
                    result[i].frontPageImage = Base64ToURL(result[i].frontPageImage.data)  
                }

                setData(result)
                console.log(result)
            } catch (err) {
                throw new Error(err)
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, []);

    const MovieContainerRef = React.useRef(null);

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

    function Base64ToURL(base64) {
        let byteString = atob(base64)
        let byteArray  = new Uint8Array(byteString.length)

        for (let i = 0; i < byteString.length; i++) {
            byteArray[i] = byteString.charCodeAt(i);
        }
        let blob = new Blob([byteArray], { type: "application/octect-stream" })
        let url = URL.createObjectURL(blob);
        return url;
    }

    let moviesShownList = movies.map(function(movie) {
        return ( 
            <section className="movie-box" key={movie.key}>
                <img className="movie-image" src={movie.frontPageImage} alt={movie.name} />
                <div className="movie-desc-box">
                    <h3 className="movie-box-name">{movie.name}</h3>
                    <h3 className="movie-box-date">{movie.date}</h3>
                    <div className="movie-button-bundle">
                        <div className="movie-box-button">
                            <nav>
                                <Link to={`/read-more/${movie.key}`} className="movie-button-bundle-link">Read More</Link>
                            </nav>
                        </div>
                        <div className="movie-box-button">
                            <nav>
                                <Link to="/" className="movie-button-bundle-link">Buy Tickets</Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
        );
    });

    if (loading) return (
        <div>
            <label>Loading</label>
        </div>
    );

    return (
        <div className="home-page-body">
            <section className="flex-box-home-page">
                <div className="left-curtain"></div>
                <div className="content-container">
                    <div className="movies-container" id="movies-container" ref={MovieContainerRef}>
                            {moviesShownList}
                    </div>
                    <section className="scroll-button-bundle">
                        <button onClick={() => scrollUp()} className="scroll-button-up" ></button>
                        <button onClick={() => scrollDown()} className="scroll-button-down" ></button>
                    </section>
                </div>
                <div className="right-curtain"></div>
            </section>

        </div>

    );
  };
  
export default HomePage;
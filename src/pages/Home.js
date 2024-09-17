import "../css/home.css"
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const HomePage = () => {
    var movies = [
        {
            "id":1,
            "name":"Hello",
            "date":"2.3.2004",
            "imageUrl": "https://picsum.photos/150/250"
        }, 
        {
            "id":2,
            "name":"World",
            "date":"12.20.2003",
            "imageUrl": "https://picsum.photos/150/250"
        },
        {
            "id":1,
            "name":"Hello",
            "date":"2.3.2004",
            "imageUrl": "https://picsum.photos/150/250"
        }, 
        {
            "id":2,
            "name":"World",
            "date":"12.20.2003",
            "imageUrl": "https://picsum.photos/150/250"
        },
        {
            "id":1,
            "name":"Hello",
            "date":"2.3.2004",
            "imageUrl": "https://picsum.photos/150/250"
        }, 
        {
            "id":2,
            "name":"World",
            "date":"12.20.2003",
            "imageUrl": "https://picsum.photos/150/250"
        },
        {
            "id":1,
            "name":"Hello",
            "date":"2.3.2004",
            "imageUrl": "https://picsum.photos/150/250"
        }, 
        {
            "id":2,
            "name":"World",
            "date":"12.20.2003",
            "imageUrl": "https://picsum.photos/150/250"
        },
        {
            "id":1,
            "name":"Hello",
            "date":"2.3.2004",
            "imageUrl": "https://picsum.photos/150/250"
        }, 
        {
            "id":2,
            "name":"World",
            "date":"12.20.2003",
            "imageUrl": "https://picsum.photos/150/250"
        },
        {
            "id":1,
            "name":"Hello",
            "date":"2.3.2004",
            "imageUrl": "https://picsum.photos/150/250"
        }, 
        {
            "id":2,
            "name":"World",
            "date":"12.20.2003",
            "imageUrl": "https://picsum.photos/150/250"
        },
        {
            "id":1,
            "name":"Hello",
            "date":"2.3.2004",
            "imageUrl": "https://picsum.photos/150/250"
        }, 
        {
            "id":2,
            "name":"World",
            "date":"12.20.2003",
            "imageUrl": "https://picsum.photos/150/250"
        },
        {
            "id":1,
            "name":"Hello",
            "date":"2.3.2004",
            "imageUrl": "https://picsum.photos/150/250"
        }, 
        {
            "id":2,
            "name":"World",
            "date":"12.20.2003",
            "imageUrl": "https://picsum.photos/150/250"
        },
        {
            "id":1,
            "name":"Hello",
            "date":"2.3.2004",
            "imageUrl": "https://picsum.photos/150/250"
        }, 
        {
            "id":2,
            "name":"World",
            "date":"12.20.2003",
            "imageUrl": "https://picsum.photos/150/250"
        },
        {
            "id":1,
            "name":"Hello",
            "date":"2.3.2004",
            "imageUrl": "https://picsum.photos/150/250"
        }, 
        {
            "id":2,
            "name":"World",
            "date":"12.20.2003",
            "imageUrl": "https://picsum.photos/150/250"
        },
        {
            "id":1,
            "name":"Hello",
            "date":"2.3.2004",
            "imageUrl": "https://picsum.photos/150/250"
        }, 
        {
            "id":2,
            "name":"World",
            "date":"12.20.2003",
            "imageUrl": "https://picsum.photos/150/250"
        }
    ];
    function GetMovie() {
        const [imageUrl, setImageUrl] = useState(null);

        useEffect(() => {
            fetch('https://picsum.photos/800/450')
                .then(response => {
                    setImageUrl(response.url);
                })
                .catch(error => console.error(error));
        }, []);
        return imageUrl
    }

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

    let moviesShownList = movies.map(function(movie) {
        return ( 
            <section className="movie-box" key={movie.id}>
                <img className="movie-image" src={movie.imageUrl} alt={movie.name} />
                <div className="movie-desc-box">
                    <label className="movie-box-name">{movie.name}</label>
                    <label>{movie.date}</label>
                    <div className="movie-button-bundle">
                        <div className="movie-box-button">
                            <nav>
                                <Link to={`/read-more/${movie.id}`} className="movie-button-bundle-link">Read More</Link>
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
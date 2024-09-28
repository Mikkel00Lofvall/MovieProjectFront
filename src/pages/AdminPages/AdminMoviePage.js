import React, { useState, useEffect, useRef } from "react";
import { FromDateToString, Base64ToURL } from "../../global/functions";
import PopupPage from "../../components/popup";
import TicketPage from "../CustomerPages/TicketPage";
import "../../css/AdminCSS/AdminMovie.css"
import Cookies from 'js-cookie'
import AdminMenu from "../../components/adminMenu";
import Breakline from "../../components/breakline"
import { isVisible } from "@testing-library/user-event/dist/utils";

const AdminMoviePage = () => {
    let [selectedMovieID, setSelectedMovieID] = useState(0);
    let [scheduleData, setScheduleData] = useState([]);
    let [movieNameInput, setMovieName] = useState("");
    let [movieDescInput, setMovieDesc] = useState("");
    let [movieDurationInput, setMovieDuration] = useState(0);
    let [imageBlobs, setImageBlobs] = useState([]);

    let [dateString, setDateString] = useState('');
    let [CinemaHalls, setCinemaHalls] = useState(null)
    let [CinemaName, setCinemaName] = useState("")
    let [loading, setLoading] = useState(true); 
    let [movies, setMoviesData] = useState([]);
    let [SelectedHall, setSelectedHall] = useState(0)
    let [RowAmount, setRowAmount] = useState(0)
    let [SeatsOnARow, setSeatOnARow] = useState(0)
    let [selectedDate, setSelectedDate] = useState({});
    let [selectedTime, setSelectedTime] = useState('');
    let [frontPageImageUpload, SetFrontPageImage] = useState(null)

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Popup Controls
    const [isScheduleOpen, setIsScheduleOpen] = useState(false); 
    const [isMovieCreateOpen, setIsMovieCreateOpen] = useState(false); 

    //C Create Movie
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedFrontPageImage, setSelectedFrontPageImage] = useState([])
    const [FrontPageImageHasBeenSelected, setFrontPageImageHasBeenSelected] = useState(false)
    const [currentImageIndexAdmin, setCurrentImageIndexAdmin] = useState(0);
    let [movieRatingInput , setMovieRating] = useState(0);
    let [MovieDirectedInput, setMovieDirected] = useState("");
    let [MovieStudioInput, setMovieStudio] = useState("");
    let [MovieTrailerInput, setMovieTrailer] = useState("");
    const MoviePicturesInputRef = useRef(null);
    const MovieFrontPageInputRef = useRef(null)
    

    const ScrollLeft = () => {
        setCurrentImageIndexAdmin((prevIndex) => (prevIndex === 0 ? selectedImages.length - 1 : prevIndex - 1));
    };

    const ScrollRight = () => {
        setCurrentImageIndexAdmin((prevIndex) => (prevIndex === selectedImages.length - 1 ? 0 : prevIndex + 1));
    };
 


    const GetMovies = async () => {
        try {
            let response = await fetch(`https://localhost:7296/api/Movie/GetMovies`);
            if (!response) {
                console.log("Network was not ok!")
            }
            let result = await response.json()
            for (let i = 0; i < result.length; i++) {
                result[i].frontPageImage = Base64ToURL(result[i].frontPageImage.data)  
            }

            setMoviesData(result)
            console.log(result)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    };



    const GetCinemaHalls = async () => {
        try {
            let response = await fetch(`https://localhost:7296/api/CinemaHall/GetHalls`);
            if (!response) {
                console.log("Network was not ok!")
            }
            let result = await response.json()

            setCinemaHalls(result)
            console.log(result)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        GetCinemaHalls();
    }, []);


    useEffect(() => {
        GetMovies();
    }, []);


    const checkAuthStatus = () => {
        const myCookie = getCookie('MovieProjectCookeAuth');
        console.log(myCookie);
    };
    
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }


    useEffect(() => {
        checkAuthStatus();
    }, []);

    if (loading) return (
        <div className="page-admin-frame">
            <label>Loading</label>
        </div>
    );

    /*if (!isAuthenticated) {
        return (
            <div style={{ padding: "60px"}}>You are not authorized admin</div>
        );
    }*/

    const CreateMovie = () => {
        if (
            movieNameInput != "" && 
            movieDescInput != "" && 
            movieDurationInput > 0 && 
            imageBlobs.length > 0 && 
            frontPageImageUpload != null &&
            dateString != ""
        ) 
        {
            let newMovieData = {
                Name: movieNameInput,
                Description: movieDescInput,
                ImagesBlobs: imageBlobs.map(image => ({
                    data: image.data
                })),
                FrontPageImage: frontPageImageUpload[0],
                trailerLink: MovieTrailerInput,
                details: {
                    releaseDate: dateString,
                    rating: movieRatingInput,
                    durationInMinutes: movieDurationInput,
                    directedBy: {
                      name: MovieDirectedInput
                    },
                    studio: MovieStudioInput
                },
            }

            let userAction = async () => {
                let response = await fetch("https://localhost:7296/api/Movie/CreateMovie", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newMovieData)
                });
                
                if (response.ok) {
                    console.log("Movie created successfully");

                    
                    
                } else {
                    let errorMessage = await response.text();
                    console.error("Error creating movie:", errorMessage);
                    
                }

                
            }

            userAction()
        }
    }

    function HandleFiles(event, callback) {
        let files = Array.from(event.target.files);
        let imagesfiles = files.filter(file => {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const mimeType = file.type;
            
            const validExtensions = ['jpeg', 'jpg', 'png'];
            
            return mimeType.startsWith('image/') && validExtensions.includes(fileExtension);
        })

        let blobs = imagesfiles.map(file => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve({
                  name: file.name,
                  data: reader.result.split(',')[1]
                });
              };
              reader.readAsDataURL(file);
            });
        });

        Promise.all(blobs).then(results => {
            if (typeof callback === 'function') {
                callback(results);
            }
        });
    }

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


    const handleDateChange = (event) => {

        let dateValue = new Date(event.target.value);
        setSelectedDate(event.target.value);
    
        setDateString(FromDateToString(dateValue));
    };





    const CreateHall = async () => {
        if (CinemaName != "" && RowAmount > 0 && SeatsOnARow > 0) {
            let response = await fetch("https://localhost:7296/api/CinemaHall/CreateHall", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: CinemaName, rowAmount: RowAmount, seatsOnARow: SeatsOnARow})
            });
            
            if (response.ok) {
                console.log("Hall created successfully");
                GetCinemaHalls();
  
            } else {
                let errorMessage = await response.text();
                console.error("Error creating movie:", errorMessage);
                
            }
        }
    }

    const CreateSchedule = async (movieID) => {
        if (SelectedHall != null && selectedDate != null && movieID != null) {
            let response = await fetch(`https://localhost:7296/api/Schedule/CreateSchedule`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    movieId: movieID,
                    date: selectedDate,
                    hallId: SelectedHall
                })
            });
            
            if (response.ok) {
                console.log("Schedule created successfully");
    
            } else {
                let errorMessage = await response.text();
                console.error("Error creating movie:", errorMessage);
                
            }

        }

    }

    let moviesShownList = movies.map((movie) => {
        return ( 
            <section id={movie.key} className="page-admin-movie-box" key={movie.key} onClick={() => {
                setIsScheduleOpen(!isScheduleOpen);
                setScheduleData([]);
                FetchSchedulesByMovieID(movie.key);
                setSelectedMovieID(movie.key);
            }}>
                {isScheduleOpen && (

                    <PopupPage onClose={() => {
                        setIsScheduleOpen(false);
                    }}>
                        <TicketPage fetchedData={scheduleData} />
                        <div className="schedule-creator-container">
                            <section className="schedule-creator-time-container">
                                <label>Time: </label>
                                <input 
                                    id="time-input"
                                    type="time"
                                    value={selectedTime}
                                    onChange={(e) => {
                                        const timeValue = e.target.value;
                                        setSelectedTime(timeValue);

                                    
                                        const [hour, minute] = timeValue.split(':').map(Number);

                                    
                                        setSelectedDate(prevDate => ({
                                            ...prevDate,
                                            hour: hour,
                                            minute: minute
                                        }));
                                    }}
                                />
                            </section>
                            
                            <section className="schedule-creator-date-container">
                                <label>Date: </label>
                                <input 
                                    className="page-admin-input-date" 
                                    type="date" 
                                    onChange={(e) => {
                                        let dateValue = e.target.value;
                                        let dateObject = new Date(dateValue);
                                        let dateComponent = {
                                            year: dateObject.getFullYear(),
                                            month: dateObject.getMonth() + 1,
                                            day: dateObject.getDate(),
                                            hour: selectedDate.hour || 0, // Set default hour if not set yet
                                            minute: selectedDate.minute || 0, // Set default minute if not set yet
                                            second: dateObject.getSeconds(),
                                        };

                                        setSelectedDate(dateComponent);
                                    }}
                                />  
                            </section>

                            <section className="schedule-creator-Hall-container">
                                <label>Theatre Hall: </label>
                                <select onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedHall(value);
                                    console.log("Selected Hall ID:", value);
                                }}>
                                    <option value="">Select a Hall</option>
                                    {CinemaHalls.map((hall) => (
                                        <option key={hall.id} value={hall.id}>{hall.name}</option>
                                    ))}
                                </select>
                            </section>
                            
                            <section className="schedule-creator-button-container">
                                <button onClick={() => {
                                    CreateSchedule(selectedMovieID);
                                    console.log('Schedule Data:', selectedDate); // For debugging purposes
                                }}>
                                    Add New Schedule
                                </button>
                            </section>        

                        </div>
                        
                    </PopupPage>
                )}
    
                <img className="page-admin-movie-image" src={movie.frontPageImage} alt={movie.name} />
                <div className="page-admin-movie-desc-box">
                    <h3 className="page-admin-movie-box-name">{movie.name}</h3>
                    <h3 className="page-admin-movie-box-date">{movie.details.releaseDate}</h3>
                </div>
            </section>
        );
    });


    const handleImageChange = (e, isFrontPageImage) => {
        let files = Array.from(e.target.files);
        let imagesArray = [];
    
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
            imagesArray.push(reader.result);
            if (imagesArray.length === files.length) {
                if (!isFrontPageImage) {
                    setSelectedImages((prevImages) => [...prevImages, ...imagesArray]);
                }
            }};
            reader.readAsDataURL(file);
        });
    };


    const handleFrontPageImageChange = (e) => {
        const file = e.target.files[0];
    
        if (file) {
            const reader = new FileReader();
    
            reader.onloadend = () => {
                setSelectedFrontPageImage(reader.result);
            };
    
            reader.readAsDataURL(file); 
        }
    };


    const handleImagesIconClick = () => {
        if (MoviePicturesInputRef.current) {
            MoviePicturesInputRef.current.click();
        }
    };

    const handleFrontPageIconClick = () => {
        if (MovieFrontPageInputRef.current) {
            MovieFrontPageInputRef.current.click();
        }
    }


    const DeleteCurrentImageFromSelectedImages = () => {
        let newImages = selectedImages.filter((_, index) => index !== currentImageIndexAdmin);
        setSelectedImages(newImages);

        if (currentImageIndexAdmin > 0) {
            setCurrentImageIndexAdmin(currentImageIndexAdmin - 1);
        } else if (newImages.length === 0) {
            setCurrentImageIndexAdmin(0);
        }
    } 




    return (
        <div className="page-admin-frame">
            {isMovieCreateOpen && (
                <PopupPage isCloseButtonIcon={true} onClose={() => { 
                    setIsMovieCreateOpen(false)
                    setMovieName("");
                    setMovieDesc("");
                    setMovieDuration(0);
                    setMovieRating(0);
                    SetFrontPageImage(0);
                    setSelectedImages([]);
                    setSelectedFrontPageImage([]);
                }}>
                    <section className="admin-page-create-container">
                        <div className="show-scrollbar" style={{ height: '600px', overflowY: 'scroll' }}>
                            <section className="admin-page-create-intial-container">
                                <div className="admin-page-create-intial-item">
                                    <label>Name:</label>
                                    <input value={movieNameInput} onChange={(e) => setMovieName(e.target.value)} /> 
                                </div>

                                <div className="admin-page-create-intial-item">
                                    <label>Description:</label>
                                    <textarea value={movieDescInput} onChange={(e) => setMovieDesc(e.target.value)}></textarea>
                                </div>
                                
                                <div className="admin-page-create-intial-item">
                                    <label>Duration in Minutes:</label>
                                    <input type="number" value={movieDurationInput} onChange={(e) => setMovieDuration(e.target.value)} />
                                </div>
                                
                                <div className="admin-page-create-intial-item">
                                    <label>Rating:</label>
                                    <input type="number" value={movieRatingInput } onChange={(e) => setMovieRating(e.target.value)} />
                                </div>

                                <div className="admin-page-create-intial-item">
                                    <label>Studio:</label>
                                    <input type="number" value={movieRatingInput } onChange={(e) => setMovieStudio(e.target.value)} />
                                </div>

                                <div className="admin-page-create-intial-item">
                                    <label>Directed By:</label>
                                    <input type="number" value={movieRatingInput } onChange={(e) => setMovieDirected(e.target.value)} />
                                </div>
                                
                                <div className="admin-page-create-intial-item">
                                    <label>Release Date:</label>
                                    <input type="date" value={selectedDate} onChange={handleDateChange} />
                                </div>
                            </section>
                            <br></br>
                            <h3>Front Page Picture</h3>
                            <section className="admin-page-create-frontimage-container">
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    ref={MovieFrontPageInputRef}
                                    onChange={(event) => {
                                        handleFrontPageImageChange(event); 
                                        setFrontPageImageHasBeenSelected(true);
                                        HandleFiles(event, (result) => {
                                            SetFrontPageImage(result);
                                        });
                                    }}
                                />


                                <div className={`admin-page-image-controls-frontpage-image ${FrontPageImageHasBeenSelected ? 'bottom-left' : 'center'}`}>
                                    {!FrontPageImageHasBeenSelected && (
                                        <i
                                            className="bi bi-plus-circle admin-page-create-frontimage-upload-icon"
                                            style={{ cursor: 'pointer', fontSize: '50px' }}
                                            onClick={handleFrontPageIconClick}
                                        ></i>
                                    )}

                                    {FrontPageImageHasBeenSelected && (
                                        <>
                                            <button
                                                title="Delete Current Picture"
                                                className="admin-page-create-frontimage-delete-button"
                                                onClick={() => {
                                                    setSelectedFrontPageImage(null);
                                                    setFrontPageImageHasBeenSelected(false);
                                                }}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="admin-page-create-frontimage-scaledivs-container"></div>
                                <div className="admin-page-create-frontimage-apply-container">
                                    {selectedFrontPageImage && (
                                        <img 
                                            src={selectedFrontPageImage} 
                                            className="page-admin-create-frontimage"
                                        />
                                    )}
                                </div>
                                <div className="admin-page-create-frontimage-scaledivs-container"></div>
                            </section>
                            <br></br>
                            <h3>Movie Pictures</h3>
                            <section className="admin-page-create-images-container">

                                <input type="file" webkitsirectory="true" style={{ display: 'hidden' }} title="Add Movie Pictures" ref={MoviePicturesInputRef} multiple onChange={(event) => {
                                    handleImageChange(event, false)
                                    HandleFiles(event, (result) => {
                                        setImageBlobs(result)
                                    })
                                }}>
                                </input>
                                <div className={`admin-page-image-controls-images ${selectedImages.length > 0 ? 'bottom-left' : 'center'}`}>
                                    {selectedImages.length === 0 && (
                                        <i
                                            className="bi bi-plus-circle admin-page-create-images-upload-icon"
                                            style={{ cursor: 'pointer', fontSize: '50px' }}
                                            onClick={handleImagesIconClick}
                                        ></i>
                                    )}

                                    {selectedImages.length > 0 && (
                                        <>
                                            <i
                                                className="bi bi-plus-circle admin-page-create-images-upload-icon small"
                                                style={{ cursor: 'pointer', fontSize: '30px' }}
                                                onClick={handleImagesIconClick}
                                                title="Add New Picture"
                                            ></i>

                                            <button title="Delete Current Picture" className="admin-page-create-images-delete-button" onClick={() => {
                                                DeleteCurrentImageFromSelectedImages()
                                                console.log(selectedImages)
                                            }}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </>
                                    )}
                                </div>

                                <button className="page-admin-scroll-button-left" onClick={ScrollLeft}>
                                    <i className="bi bi-arrow-left-circle"></i>
                                </button>
                                <div className="admin-page-create-scroll-container">

                                    {selectedImages.length > 0 && (
                                        <img 
                                            src={selectedImages[currentImageIndexAdmin]} 
                                            alt={`Movie Image ${currentImageIndexAdmin}`} 
                                            className='page-admin-create-movie-image' 
                                        />
                                    )}

                                </div>
                                <button className="page-admin-scroll-button-right" onClick={ScrollRight}>
                                    <i className="bi bi-arrow-right-circle"></i>
                                </button>
                            </section>
                            <br></br>
                            <section>
                                <button onClick={() => CreateMovie()} className="page-admin-create-movie-button">Create Movie</button>
                            </section>
                        </div>  
                    </section>
                </PopupPage>
            )}
            <AdminMenu></AdminMenu>
            <section className="page-admin-header">
                <h2>Movies</h2>
            </section>
            <Breakline></Breakline>
            <section className="page-admin-tool-button-bundle">
                <button className="page-admin-tool-button-create" onClick={() => { setIsMovieCreateOpen(true) }}>Create</button>
            </section>
            <main className="page-admin-movies-container">
                {moviesShownList}
            </main>



        
            <br></br>
            <h2>Create CinemaHall</h2>
            <div>
                <label>Name</label>
                <br></br>
                <input type="text" onChange={(e) => setCinemaName(e.target.value)}></input>
                <br></br>
                <label>Seat Rows</label>
                <br></br>
                <input type="number" onChange={(e) => setRowAmount(e.target.value)}></input>
                <br></br>
                <label>Seats In On a Row</label>
                <br></br>
                <input type="number" onChange={(e) => setSeatOnARow(e.target.value)}></input>
                <br></br>
                <br></br>
                <button onClick={CreateHall} >Create CinemaHall</button>
            </div>
        </div>
    );
}

export default AdminMoviePage
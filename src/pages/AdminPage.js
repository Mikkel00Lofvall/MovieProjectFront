import React, { useState, useEffect } from "react";
import { FromDateToString, Base64ToURL } from "../global/functions";
import PopupPage from "../components/popup";
import TicketPage from "./TicketPage";
import "../css/admin.css"


const AdminPage = () => {
    let [selectedMovieID, setSelectedMovieID] = useState(0);
    let [scheduleData, setScheduleData] = useState([]);
    let [movieNameInput, setMovieName] = useState("");
    let [movieDescInput, setMovieDesc] = useState("");
    let [movieDurationInput, setMovieDuration] = useState(0);
    let [imageBlobs, setImageBlobs] = useState([]);
    let [frontPageImage, SetFrontPageImage] = useState(null)
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

    const [isScheduleOpen, setIsScheduleOpen] = useState(false); 

    const CreateMovie = () => {
        if (
            movieNameInput != "" && 
            movieDescInput != "" && 
            movieDurationInput > 0 && 
            imageBlobs.length > 0 && 
            frontPageImage != null &&
            dateString != ""
        ) 
        {
            let newMovieData = {
                Name: movieNameInput,
                Description: movieDescInput,
                ImagesBlobs: imageBlobs.map(image => ({
                    data: image.data
                })),
                FrontPageImage: frontPageImage[0],
                trailerLink: "",
                details: {
                    releaseDate: dateString,
                    rating: "some rating",
                    durationInMinutes: movieDurationInput,
                    directedBy: {
                      name: "some director"
                    },
                    studio: "some studio"
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

    useEffect(() => {
        GetMovies();
    }, []);

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
     }, [])

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

    const BuildTimeComponent = () => {

    }

    if (loading) return (
        <div className="page-admin-frame">
            <label>Loading</label>
        </div>
    );

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

                                        // Extract hour and minute from the selected time
                                        const [hour, minute] = timeValue.split(':').map(Number);

                                        // Update selectedDate with the selected time
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

    if (loading) return (
        <div className="page-admin-frame">
            <label>Loading</label>
        </div>
    );

    return (
        <div className="page-admin-frame">
            <h2>Create Movie</h2>
            <label>Name:</label>
            <br></br>
            <input value={movieNameInput} onChange={(e) => setMovieName(e.target.value)}></input>
            <br></br>
            <br></br>
            <label>Desc:</label>
            <br></br>
            <input value={movieDescInput} onChange={(e) => setMovieDesc(e.target.value)}></input>
            <br></br>
            <br></br>
            <label>Duration in Minutes:</label>
            <br></br>
            <input type="number" value={movieDurationInput} onChange={(e) => setMovieDuration(e.target.value)}></input>
            <br></br>
            <br></br>
            <label>Images (Upload Folder)</label>
            <br></br>
            <input type="file" webkitsirectory="true" multiple onChange={(event) => {
                HandleFiles(event, (result) => {
                    setImageBlobs(result)
                })
            }}></input>
            <br></br>
            <br></br>
            <label>Front Page Image:</label>
            <br></br>
            <input type="file" onChange={(event) => {
                HandleFiles(event, (result) => {
                    SetFrontPageImage(result)
                });
            }}></input>
            <br></br>
            <br></br>
            <label>Release Date:</label>
            <br></br>
            <input 
                type="date" 
                value={selectedDate} 
                onChange={handleDateChange} 
            />
            <br></br>
            <br></br>
            <button onClick={() => CreateMovie()}>Create Movie</button>
            <br></br>

            <h2>Current Movies</h2>
            <div className="movies-container">
                {moviesShownList}
            </div>

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

export default AdminPage
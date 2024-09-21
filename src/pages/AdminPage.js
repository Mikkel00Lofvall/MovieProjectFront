import React, { useState, useEffect } from "react";
import { FromDateToString, Base64ToURL } from "../global/functions";
import PopupPage from "../components/popup";
import "../css/admin.css"


const AdminPage = () => {
    let [movieNameInput, setMovieName] = useState("");
    let [movieDescInput, setMovieDesc] = useState("");
    let [movieDurationInput, setMovieDuration] = useState(0);
    let [imageBlobs, setImageBlobs] = useState([]);
    let [frontPageImage, SetFrontPageImage] = useState(null)
    let [dateString, setDateString] = useState('');
    let [selectedDate, setSelectedDate] = useState('');

    const [isPopupOpen, setIsPopupOpen] = useState(false); 

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
      };
    
      const closePopup = () => {
        setIsPopupOpen(false);
      };

    let [loading, setLoading] = useState(true); 
    let [movies, setData] = useState([]);

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

    let HandleFrontPageSelect = (event) => {
        HandleFiles(event, (result) => {
            SetFrontPageImage(result)
        });
    }

    let HandleFolderSelect = (event) => {
        HandleFiles(event, (result) => {
            setImageBlobs(result)
        })
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

    const handleDateChange = (event) => {

        let dateValue = new Date(event.target.value);
        setSelectedDate(event.target.value);
    
        setDateString(FromDateToString(dateValue));
    };

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


    let moviesShownList = movies.map(function(movie) {
        return ( 
            <section className="movie-box" key={movie.key}>
                <img className="movie-image" src={movie.frontPageImage} alt={movie.name} />
                <div className="movie-desc-box">
                    <h3 className="movie-box-name">{movie.name}</h3>
                    <h3 className="movie-box-date">{movie.details.releaseDate}</h3>
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
            <input type="file" webkitsirectory="true" multiple onChange={HandleFolderSelect}></input>
            <br></br>
            <br></br>
            <label>Front Page Image:</label>
            <br></br>
            <input type="file" onChange={HandleFrontPageSelect}></input>
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

            <div className="movies-container">
                {moviesShownList}
            </div>
        </div>
    );
}

export default AdminPage
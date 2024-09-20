import { useState, useEffect } from "react";

const AdminPage = () => {
    let [movieNameInput, setMovieName] = useState("");
    let [movieDescInput, setMovieDesc] = useState("");
    let [movieDurationInput, setMovieDuration] = useState(0);
    let [imageBlobs, setImageBlobs] = useState([]);
    let [frontPageImage, SetFrontPageImage] = useState(null)

    function CreateMovie() {
        alert("I Clicked IT")

        if (movieNameInput != "" && movieDescInput != "" && movieDurationInput > 0 && imageBlobs.length > 0 && frontPageImage != null) {


            let newMovieData = {
                Name: movieNameInput,
                Description: movieDescInput,
                DurationInMinutes: movieDurationInput,
                ImagesBlobs: imageBlobs.map(image => ({
                    data: image.data
                })),
                FrontPageImage: frontPageImage[0]

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

    return (
        <div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <label>Name:</label>
            <input value={movieNameInput} onChange={(e) => setMovieName(e.target.value)}></input>
            <label>Desc:</label>
            <input value={movieDescInput} onChange={(e) => setMovieDesc(e.target.value)}></input>
            <label>Duration in Minutes:</label>
            <input type="number" value={movieDurationInput} onChange={(e) => setMovieDuration(e.target.value)}></input>
            <label>Images (Upload Folder)</label>
            <input type="file" webkitsirectory="true" multiple onChange={HandleFolderSelect}></input>
            <label>Front Page Image:</label>
            <input type="file" onChange={HandleFrontPageSelect}></input>
            <br></br>
            <button onClick={() => CreateMovie()}>Create Movie</button>
        </div>
    );
}

export default AdminPage
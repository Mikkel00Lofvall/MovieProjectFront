import { useState, useEffect } from "react";

const AdminPage = () => {
    let [movieNameInput, setMovieName] = useState("");
    let [movieDescInput, setMovieDesc] = useState("");
    let [movieDurationInput, setMovieDuration] = useState(0);
    let [imageBlobs, setImageBlobs] = useState([]);

    function CreateMovie() {
        alert("I Clicked IT")

        if (movieNameInput != "" && movieDescInput != "" && movieDurationInput > 0 && imageBlobs.length > 0) {


            let newMovieData = {
                Name: movieNameInput,
                Description: movieDescInput,
                DurationInMinutes: movieDurationInput,
                ImagesBlobs: imageBlobs.map(image => ({
                    data: image.blob
                }))
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

    let HandleFolderSelect = (event) => {
        let files = Array.from(event.target.files);
        let imagesfiles = files.filter(file => {
            // Check MIME type and file extension
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const mimeType = file.type;
            
            // Valid image extensions
            const validExtensions = ['jpeg', 'jpg', 'png'];
            
            // Check if MIME type starts with 'image/' and the extension is valid
            return mimeType.startsWith('image/') && validExtensions.includes(fileExtension);
        })

        let blobs = imagesfiles.map(file => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve({
                  name: file.name,
                  blob: reader.result.split(',')[1] // Get base64 content
                });
              };
              reader.readAsDataURL(file);
            });
        });

        Promise.all(blobs).then(results => {
            setImageBlobs(results);
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
            <br></br>
            <button onClick={() => CreateMovie()}>Create Movie</button>
        </div>
    );
}

export default AdminPage
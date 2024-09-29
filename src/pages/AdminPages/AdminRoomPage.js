import AdminMenu from "../../components/adminMenu";
import "../../css/AdminCSS/AdminRoomPanel.css"
import Breakline from "../../components/breakline";
import React, { useState, useEffect } from "react";
import PopupPage from "../../components/popup";


const AdminRoomPage = () => {

    let [CinemaHalls, setCinemaHalls] = useState(null)

	
	// Create Hall
	let [inputName, setInputHallName] = useState("");
	let [inputRows, setInputRows] = useState(0)
	let [inputSeats, setInputSeats] = useState(0)


	// Load Dock
	let [LoadingFetchAllHalls, setLoadingFetchAllHalls] = useState(true)

	// Popup 
	const [isCreatPopupOpen, setCreatePopup] = useState(false)

	const CreateHall = async () => {
        if (inputName != "" && inputRows > 0 && inputSeats > 0) {
            let response = await fetch("https://localhost:7296/api/CinemaHall/CreateHall", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: inputName, rowAmount: inputRows, seatsOnARow: inputSeats})
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

	const GetCinemaHalls = async () => {
        try {
            let response = await fetch(`https://localhost:7296/api/CinemaHall/GetHalls`);
            if (!response) {
                console.log("Network was not ok!")
            }
            let result = await response.json()

            setCinemaHalls(result)
            console.log("Fetched Halls Data: ", result)
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingFetchAllHalls(false)
        }
    };

    useEffect(() => {
        GetCinemaHalls();
    }, []);

	if (LoadingFetchAllHalls) {
		return (
			<div className="page-admin-frame">
				<h2>Loading</h2>
			</div>
		);
	}

	const HallsList = CinemaHalls.map(hall => {
		return (
			<div className="page-admin-hall-container">
				<section className="page-admin-hall-details">
					<section>
						<h2>{hall.name}</h2>
						<br></br>
						<label>Size: {hall.seatsOnRow} x {hall.seats.length / hall.seatsOnRow} Seats</label>
					</section>
					<section className="page-admin-hall-button-bundle">
						<button>See Schedules</button>
						<button>Delete</button>
					</section>
				</section>

			</div>
		);
	})
  
    return (
		<div className="page-admin-frame">
			{isCreatPopupOpen && (
				<PopupPage isCloseButtonIcon={true} onClose={() => {
					setCreatePopup(false);
				}}>
					<div className="page-admin-room-create-container">
						<section className="page-admin-room-create-item">
							<label>Name: </label>
							<input type="text" onChange={(e) => {setInputHallName(e.target.value)}}></input>
						</section>
						<section>
							<label>Rows: </label>
							<input type="number" onChange={(e) => {setInputRows(e.target.value)}}></input>
						</section>
						<section>
							<label>Seats on a row: </label>
							<input type="number" onChange={(e) => {setInputSeats(e.target.value)}}></input>
						</section>
						<br></br>
						<div className="page-admin-room-create-item-button-bundle">
							<button onClick={CreateHall}>Create</button>
						</div>

					</div>
				</PopupPage>
			)}
			<AdminMenu></AdminMenu>



			<section className="page-admin-header">
				<h2>Room Panel</h2>
			</section>


			<Breakline></Breakline>
			<section className="page-admin-tool-button-bundle">
				<button className="page-admin-tool-button-create" onClick={() => {
					setCreatePopup(!isCreatPopupOpen)
				}}>Create</button>
			</section>
			<main className="page-admin-room-container">{HallsList}</main>
		</div>
    )
  };
  
  export default AdminRoomPage;
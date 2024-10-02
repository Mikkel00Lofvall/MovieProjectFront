import AdminMenu from "../../components/adminMenu";
import "../../css/AdminCSS/AdminRoomPanel.css"
import Breakline from "../../components/breakline";
import React, { useState, useEffect } from "react";
import PopupPage from "../../components/popup";
import ToastManager from "../../components/toast/toastManager"
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';


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
			try {
				let response = await fetch("https://localhost:7296/api/CinemaHall/CreateHall", {
					method: "POST",
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({name: inputName, rowAmount: inputRows, seatsOnARow: inputSeats})
				});
				
				if (response.ok) {
					window.addToast(`Room Created Successfully`, "success", 4000)
					GetCinemaHalls();
				}
			}
			catch (err) {
				window.addToast(`Failed due to server error \n Error message: ${err}`, "error", 4000)
			}
        }
    }

	const DeleteCinemaHall = async (id) => {
        let response = await fetch(`https://localhost:7296/api/CinemaHall/DeleteHall/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
			window.addToast(`Failed due to server error \n Error message: ${response.status}`, "error", 4000)
        }
    
        if (response.headers.get('Content-Type')?.includes('application/json')) {
            window.addToast(`Deleted Room Successfully`, "success", 4000)
			GetCinemaHalls()
        } else {
            window.addToast(`Deleted Room Successfully`, "success", 4000)
			GetCinemaHalls()
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
            console.log("Fetched Halls Data: ", result)
        } catch (err) {
			window.addToast(`Failed due to server error \n Error message: ${err}`, "error", 4000)
        } finally {
            setLoadingFetchAllHalls(false)
        }
    };

	const navigate = useNavigate();
	const NavigateToHome = () => {
		navigate("/")
	}

    useEffect(() => {
        const checkAuth = async () => {
            try {
                let response = await fetch('https://localhost:7296/api/Account/CheckAuth', {
                    method: 'POST',
                    credentials: 'include',
                });
        
                if (!response.ok) {
                    NavigateToHome()
                } 
            } catch (error) {
                return false;
            }

            GetCinemaHalls();
        }
        checkAuth();
    }, []);

	if (LoadingFetchAllHalls) {
		return (
			<div className="page-admin-frame">
				<ToastManager></ToastManager>
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
						<label>Size: {hall.seatsOnRow} x {hall.rowsOfSeat} Seats</label>
					</section>
					<section className="page-admin-hall-button-bundle">
						<button>See Schedules</button>
						<button onClick={() => {
							const buttons = [
								{
									label: "Yes",
									action: () => DeleteCinemaHall(hall.id)
								},
								{
									label: "No",
									action: () => {}
								}
							];
							
							window.addToast(`This cannot be undone \n are you sure?`, "warning", 100000, buttons);
						}}>Delete</button>
					</section>
				</section>

			</div>
		);
	})
  
    return (
		<div className="page-admin-frame">
			<ToastManager></ToastManager>
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
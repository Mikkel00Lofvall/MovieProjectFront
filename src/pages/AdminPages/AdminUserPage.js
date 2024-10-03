import AdminMenu from "../../components/adminMenu";
import "../../css/AdminCSS/AdminTheme.css"
import Breakline from "../../components/breakline";
import React, { useState, useEffect } from "react";
import PopupPage from "../../components/popup";
import ToastManager from "../../components/toast/toastManager";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';


const AdminUserPage = () => {
    let [FetchedThemes, setFetchedThemes] = useState([]);

    let [inputName, setNameInput] = useState("");
    let [inputPassword, setPasswordInput] = useState("");

    const [isCreatePopupOpen, setCreatePopup] = useState(false)


    // Load Dock 
    let [loadingUsers, setLoadingUsers] = useState(true);

    const CreateUser = async () => {
        if (inputName != "" && inputPassword != "") {
            try {
                let response = await fetch(`https://localhost:7296/api/Account/Create`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: inputName,
                        password: inputPassword
                    })
                });

                if (!response.ok) {
                    window.addToast(`Failed due to server error \n Error message: ${response.status}`, "error", 4000)
                }

                if (response.ok) {
                    window.addToast("User Was Created", "success", 4000)
                    FetchAllUser();
                }

            } catch (err) {
                window.addToast(`Failed due to server error \n Error message: ${err}`, "error", 4000)
            }
        }

    };


    const FetchAllUser = async () => {
        try {
            let response = await fetch('https://localhost:7296/api/Account/GetAll');
            if (!response.ok) {
                console.log("Network was not okay!")
                return
            }

            let result = await response.json();

            setFetchedThemes(result);
            console.log("Admin Data:", result);
        } catch (err) {
            window.addToast(`Failed due to server error \n Error message: ${err}`, "error", 4000)
        } finally {
            setLoadingUsers(false)
        }

    };

    const DeleteUser = async (userID) => {
        let response = await fetch(`https://localhost:7296/api/Account/Delete/${userID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            window.addToast(`Failed due to server error \n Error message: ${response.status}`, "error", 4000)
            return;
        }
    
        if (response.headers.get('Content-Type')?.includes('application/json')) {
            window.addToast("User Was Deleted", "success", 4000)
            FetchAllUser();
        } else {
            window.addToast("User Was Deleted", "success", 4000)
            FetchAllUser();
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

            FetchAllUser();
        }
        checkAuth();
    }, []);


    if (loadingUsers) {
        return (
            <div className="page-admin--loading-frame">
                <h2>Loading</h2>
            </div>
        );
    }

    return (
      <div className="page-admin-frame">
        <ToastManager></ToastManager>
        {isCreatePopupOpen && (
            <PopupPage isCloseButtonIcon={true} onClose={() => {
                setCreatePopup(false);
            }}>
                <div className="page-admin-themes-create-container">
                    <section className="page-admin-themes-create-input-container">
                        <label>Name:</label>
                        <input type="text" onChange={(e) => {setNameInput(e.target.value)}}></input>
                    </section>
                    <section className="page-admin-themes-create-input-container">
                        <label>Password:</label>
                        <input type="text" onChange={(e) => {setPasswordInput(e.target.value)}}></input>
                    </section>
                    <button onClick={CreateUser}>Create</button>
                </div>
            </PopupPage>
        )}

        <AdminMenu></AdminMenu>
        <section className="page-admin-header">
          <h2>Movie Themes</h2>
        </section>


        <Breakline></Breakline>
        <section className="page-admin-tool-button-bundle">
          <button className="page-admin-tool-button-create" onClick={() => {
            setCreatePopup(!isCreatePopupOpen)
          }}>Create</button>
        </section>
        <main className="page-admin-themes-container">
          <div className="show-scrollbar">
            <main className="page-admin-theme-grid-container">
                {FetchedThemes.map((user, index) => (
                    <div key={index} className="page-admin-theme-grid-item">
                        <div className="page-admin-theme-theme-container">
                            <label>{user.username}</label>
                        </div>
                        <div className="page-admin-theme-button-bundle-container" >
                            <button onClick={() => {
                                const buttons = [
                                    {
                                        label: "Yes",
                                        action: () => DeleteUser(user.id)
                                    },
                                    {
                                        label: "No",
                                        action: () => {}
                                    }
                                ];
            
                                window.addToast(`This cannot be undone \n are you sure?`, "warning", 100000, buttons);

                            }}>Delete</button>
                        </div>
                    </div>
                ))}
            </main>
          </div>
        </main>
      </div>
    )
  };
  
  export default AdminUserPage;
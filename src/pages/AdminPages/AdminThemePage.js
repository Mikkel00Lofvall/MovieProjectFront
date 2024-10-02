import AdminMenu from "../../components/adminMenu";
import "../../css/AdminCSS/AdminTheme.css"
import Breakline from "../../components/breakline";
import React, { useState, useEffect } from "react";
import PopupPage from "../../components/popup";
import ToastManager from "../../components/toast/toastManager";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';


const AdminThemesPage = () => {
    let [loading, setLoading] = useState(true); 
    let [FetchedThemes, setFetchedThemes] = useState([]);

    let [inputThemeName, setThemeNameInput] = useState("");

    const [isCreatePopupOpen, setCreatePopup] = useState(false)

    const CreateTheme = async () => {
        if (inputThemeName != "") {
            try {
                let response = await fetch(`https://localhost:7296/api/Theme/CreateTheme`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: inputThemeName
                    })
                });

                if (!response.ok) {
                    window.addToast(`Failed due to server error \n Error message: ${response.status}`, "error", 4000)
                    return
                }

            } catch (err) {
                window.addToast(`Failed due to server error \n Error message: ${err}`, "error", 4000)
            } finally {
                setLoading(false);
                window.addToast("Theme Was Created", "success", 4000)
                FetchAllThemes();

            }
        }

    };


    const FetchAllThemes = async () => {
        try {
            let response = await fetch('https://localhost:7296/api/Theme/GetThemes');
            if (!response.ok) {
                console.log("Network was not okay!")
                return
            }

            let result = await response.json();

            setFetchedThemes(result);
            console.log("Theme Data:", result);
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }

    };

    const DeleteTheme = async (themeID) => {
        let response = await fetch(`https://localhost:7296/api/Theme/DeleteTheme/${themeID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            console.log("Network request failed with status:", response.status);
            let errorMessage = await response.text();
            window.addToast(`Failed due to server error \n Error message: ${errorMessage}`, "error", 4000)
            return;
        }
    
        let result;
        if (response.headers.get('Content-Type')?.includes('application/json')) {
            result = await response.json();
            console.log("Theme Data:", result);
            window.addToast("Theme Was Deleted", "success", 4000)
            FetchAllThemes();
        } else {
            console.log("No JSON response, theme deleted successfully.");
            window.addToast("Theme Was Deleted", "success", 4000)
            FetchAllThemes();
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

            FetchAllThemes();
        }
        checkAuth();
    }, []);



    if (loading) return (
        <div className="page-admin-frame">
            <label>Loading</label>
        </div>
    );

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
                        <input type="text" onChange={(e) => {setThemeNameInput(e.target.value)}}></input>
                    </section>
                    <button onClick={CreateTheme}>Create</button>
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
                {FetchedThemes.map((theme, index) => (
                    <div key={index} className="page-admin-theme-grid-item">
                        <div className="page-admin-theme-theme-container">
                            <label>{theme.name}</label>
                        </div>
                        <div className="page-admin-theme-button-bundle-container" >
                            <button onClick={() => {
                                const buttons = [
                                    {
                                        label: "Yes",
                                        action: () => DeleteTheme(theme.id)
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
  
  export default AdminThemesPage;
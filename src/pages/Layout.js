import { Outlet, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import PopupPage from "../components/popup";
import LoginComponent from "../components/login";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import "../css/layout.css"

const Layout = () => {

  	const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false); 
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const location = useLocation();
	
	const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = async () => {
			setIsAuthenticated(false);
			try {
				let response = await fetch('https://localhost:7296/api/Account/CheckAuth', {
					method: 'POST',
					credentials: 'include',
				});

				if (response.ok) {
					setIsAuthenticated(true);
					setIsLoginPopupOpen(false)
				}
	  
			} catch (error) {
				return false;
			}
		}
		
		checkAuth();
	}, [location])


	const Logout = async () => {
		try {
            let response = await fetch('https://localhost:7296/api/Account/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setIsAuthenticated(false);
				setIsLoginPopupOpen(false)
                console.log("User logged out");
				navigate("/")
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
	}


  return (
    <>
		{isLoginPopupOpen && (
			<PopupPage isCloseButtonIcon={true} onClose={() => {
				setIsLoginPopupOpen(false);
			}}>
				<LoginComponent></LoginComponent>
			</PopupPage>
		)}
		<div className="header">
			<div className="flex-box">
				<nav className="flex-item">
					<div className="home-button">
						<Link to="/" className="layout-logo">
							<label>MovieLane</label>
							<i class="bi bi-house"></i>
						</Link>
					</div>
				</nav>
				<div className="flex-item">
					{!isAuthenticated ? (
						<div className="login-button" onClick={() => {
							setIsLoginPopupOpen(!isLoginPopupOpen);
						}}>
							<label>Login</label>
							<i class="bi bi-file-lock"></i>
						</div>
					) : (
						<nav className="flex-item">
							<div className="flex-admin-bar">
								<div className="layout-logo" onClick={() => {navigate("/admin")}}>
									<label>Admin Panel</label>
									<i class="bi bi-house"></i>
								</div>
								<div className="layout-logo" onClick={Logout}>
									<label>Logout</label>
									<i class="bi bi-file-lock"></i>
								</div>
							</div>
						</nav>
					)}
				</div>
			</div>
		</div>


      <Outlet />
    </>
  )
};

export default Layout;
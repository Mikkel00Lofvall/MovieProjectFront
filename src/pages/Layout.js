import { Outlet, Link } from "react-router-dom";
import React, { useState } from "react";
import PopupPage from "../components/popup";
import LoginComponent from "../components/login";
import logo from '../images/logo.png';
import "../css/layout.css"

const Layout = () => {
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false); 

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
            <div className="login-button" onClick={() => {
              setIsLoginPopupOpen(!isLoginPopupOpen);
            }}>
              <label>Login</label>
              <i class="bi bi-file-lock"></i>
            </div>
          </div>

        </div>
      </div>


      <Outlet />
    </>
  )
};

export default Layout;
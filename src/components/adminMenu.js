import "./css/adminMenu.css"
import React, { useState } from "react";

const AdminMenu = () => {
    // Initialize state to control menu width
    const [menuOpen, setMenuOpen] = useState(true);

    // Function to toggle the menu open/closed
    const handleSlide = () => {
        setMenuOpen((prev) => !prev);
    };

    return (
        <div
            className="adminmenu"
            id="adminmenu"
            style={{
                width: menuOpen ? "250px" : "0",
                transition: "width 0.3s ease",
                overflow: "hidden",
            }}
        >
            <div className="top-bar">
                <div className="menu" onClick={handleSlide}>
                    <i className="bi bi-list"></i>
                </div>
            </div>
            <div className="nav">
                <ul>
                    <li>
                        <a href="/admin">Movie Panel</a>
                    </li>
                    <li>
                        <a href="/admin/RoomPanel">Cinema Room Panel</a>
                    </li>
                    <li>
                        <a href="/admin/themes">Themes Panel</a>
                    </li>
                    <li>
                        <a href="/admin/users">Users Panel</a>
                    </li>
                </ul>
            </div>
        </div>
    );
};


export default AdminMenu
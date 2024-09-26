import "./css/login.css"
import React, { useState } from "react";

const LoginComponent = () => {

    const [showPassword, setShowPassword] = React.useState("password");
    let loginResult = false;

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => (prev === "password" ? "text" : "password"));
    };

    const loginResultIcon = (loginResult) => {
        return (
            <div className="login-result-icon" >
            {loginResult ? (
                <i className="bi bi-check2" style={{ color: 'green' }}></i>
            ) : (
                <i className="bi bi-x-circle" style={{ color: 'red' }}></i>
            )}
        </div>
        );
    }
    return (
        <div className="login-container">
            <div className="login-icon-flex-container">
                {loginResultIcon(loginResult)}
            </div>
            <div className="login-flex-container">
                <section className="login-input-container">
                    <label>Username:</label>
                    <input></input>
                </section>
                <section className="login-input-container">
                    <label>Password:</label>
                    <div className="login-input-password-container">
                    <input type={showPassword} />
                        <button onClick={togglePasswordVisibility}>
                            {showPassword === "password" ? (
                                <i className="bi bi-eye-slash-fill"></i>
                            ) : (
                                <i className="bi bi-eye-fill"></i>
                            )}
                        </button>
                    </div>

                </section>
                <section className="login-input-container">
                    <button>Login</button>
                </section>
            </div>
            
        </div>
    );
}

export default LoginComponent
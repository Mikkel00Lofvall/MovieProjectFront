import "./css/login.css"
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

const LoginComponent = () => {

    const [showPassword, setShowPassword] = useState("password");
    let [passwordVar, setPassword] = useState(null);
    let [emailVar, setEmail] = useState(null);
    let [loginResult, setLoginResult] = useState(false);

    const navigate = useNavigate();
    
    const Login = async () => {
        if (emailVar != null && passwordVar != null) {
            let response = await fetch("https://localhost:7296/api/Account/login", {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({username: emailVar, password: passwordVar})
            });
            
            if (response.ok) {
                console.log("logged in succesfully");
                setLoginResult(true);
                handleRedirect();
            } else {
                let errorMessage = await response.text();
                console.error("Error creating movie:", errorMessage);
                
            }
        }

        else console.log("Email or Password was null")
    }

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => (prev === "password" ? "text" : "password"));
    };

    const handleRedirect = () => {
        navigate('/admin');
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
                    <label>Email:</label>
                    <input onChange={(e) => {
                        setEmail(e.target.value)
                        console.log("Email: ", emailVar)
                    }}></input>
                </section>
                <section className="login-input-container">
                    <label>Password:</label>
                    <div className="login-input-password-container">
                    <input type={showPassword} onChange={(e) => {
                        setPassword(e.target.value)
                        console.log("Password: ", passwordVar)
                    }}/>
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
                    <button onClick={Login}>Login</button>
                </section>
            </div>
            
        </div>
    );
}

export default LoginComponent
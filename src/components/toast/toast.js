import React, { useEffect, useState } from 'react';
import "../css/toast.css";

const Toast = ({ message, type, duration, buttons, onClose }) => {
    const [isVisible, setVisible] = useState(true);
    let [buttonIndex, setButtonIndex] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleButtonClick = (action) => {
        action();
        setVisible(false);
        onClose();
    };

    if (!isVisible) return null;

    console.log("--------- Toast Information --------- ")
    console.log(` Message: ${message}`, )
    console.log(` Type: ${type}`, )
    console.log(` Duration: ${duration}`, )
    console.log(` Buttons: ${buttons}`, )

    const toastStyle = {
        height: type === 'warning' ? '150px' : '100px', 
    };



    return (
        <div className={`toast toast-${type}`} style={toastStyle}>
            <div className='toats-flex-box'>
                <div className="toast-flex-item">
                    {type === 'error' ? (
                        <i className="bi bi-x-octagon-fill toast-icon" style={{ color: "#dc3545" }}></i>
                    ) : type === 'warning' ? (
                        <i className="bi bi-exclamation-octagon-fill toast-icon" style={{ color: "#FFA500" }}></i>
                    ) : (
                        <i className="bi bi-check-circle-fill toast-icon" style={{ color: "#00c62e" }}></i>
                    )}
                </div>
                <section className='toast-detail-container'>
                    {message}
                </section>
            </div>
            {buttons && buttons.length > 0 && type === "warning" && (
                    <div className="toast-button-container">
                        {buttons.map((button, index) => {
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleButtonClick(button.action)}
                                    className={index === 0 ? 'toast-button toast-button-yes' : 'toast-button toast-button-no'}
                                >
                                    {button.label}
                                </button>
                             );
                        })}
                    </div>
                )}

        </div>
    );
};

export default Toast;
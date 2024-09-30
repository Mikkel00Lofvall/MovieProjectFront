import React, { useEffect, useState } from 'react';
import "../css/toast.css"

const Toast = ({ message, type, duration, onClose }) => {
    const [isVisible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose();
        }, duration)

        return () => clearTimeout(timer);
    }, [duration, onClose])

    if (!isVisible) return null;

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-flex-item">
                {type === 'error' ? (
                    <i className="bi bi-exclamation-octagon-fill toast-icon" style={{ color: "#dc3545" }}></i>
                ) : (
                    <i className="bi bi-check-circle-fill toast-icon" style={{ color: "#00c62e" }}></i>
                )}
            </div>
            <section className='toast-detail-container'>
                {message}
            </section>
        </div>
    );

}

export default Toast;
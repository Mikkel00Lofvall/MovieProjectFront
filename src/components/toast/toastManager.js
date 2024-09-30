import React, { useState } from 'react';
import Toast from './toast.js'
import "../css/toastManager.css"

const ToastManager = () => {
    const [toasts, setToasts] = useState([]);

    window.addToast = (message, type="error", duration) => {
        const id = Math.random().toString(36).substring(7);
        setToasts(prevToasts => [...prevToasts, { id, message, type, duration }])

        setTimeout(() => {
            setToasts(prevToasts => prevToasts.filter(t => t.id !== id));
        }, duration + 500);
    }

    return (

        <div>
            <div className="toast-container">
                {toasts.map(toast => {
                    return(
                        <Toast
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            duration={toast.duration}
                            onClose={() => setToasts(prevToasts => prevToasts.filter(t => t.id !== toast.id))}
                        ></Toast>
                    );

                })}
            </div>

        </div>
    );
}

export default ToastManager;
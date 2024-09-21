import "./css/popup.css"
import React from 'react';


const PopupPage = ({ children, onClose }) => {
  return (
    <>
      <div className="popup-modal" onClick={onClose}>
        <div className="popup-modal-content" onClick={(e) => e.stopPropagation()}>
          <span className="popup-modal-close-button" onClick={onClose}>
            &times;
          </span>
          {children}
        </div>
      </div>
    </>
  );
};

export default PopupPage;
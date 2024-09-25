import "./css/popup.css"
import React from 'react';


let PopupPage = ({ children, onClose }) => {
  return (
    <div className="pop-up-void" onClick={onClose}>
      <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="popup-modal-content">
          {children}
          <button className="popup-close-button" onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  );
};

export default PopupPage;
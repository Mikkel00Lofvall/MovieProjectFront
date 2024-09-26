import "./css/popup.css"
import React from 'react';


let PopupPage = ({ children, onClose, isCloseButtonIcon }) => {
  return (
    <div className="pop-up-void" onClick={onClose}>
      < div className="popup-modal" onClick={(e) => e.stopPropagation()}>
          <div className="popup-modal-content">
              {children}
              {isCloseButtonIcon ? (
                  <div className="popup-close-button-icon-version">
                    <i className="bi bi-x-lg popup-close-icon" onClick={onClose} style={{ cursor: 'pointer' }}></i>
                  </div>
                  
              ) : (
                  <button className="popup-close-button" onClick={onClose}>Close</button>
              )}
          </div>
        </div>
    </div>
  );
};

export default PopupPage;
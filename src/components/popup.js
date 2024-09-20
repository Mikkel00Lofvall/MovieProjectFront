import "./css/popup.css"
import React, { useImperativeHandle, forwardRef, useState } from 'react';


const PopupPage = ({children}) => {
    // Modal state management inside the same file
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
  
    return (
      <>
        <button onClick={openModal} className="open-modal-btn">
          Open Popup
        </button>
  
        {isModalOpen && (
          <div className="popup-modal" onClick={closeModal}>
            <div className="popup-modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="popup-modal-close-button" onClick={closeModal}>
                &times;
              </span>
              {children}
            </div>
          </div>
        )}
      </>
    );
  };

export default PopupPage;
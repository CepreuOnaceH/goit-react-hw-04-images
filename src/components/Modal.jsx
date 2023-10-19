import React, { useEffect } from 'react';

function Modal({ isOpen, imageUrl, onClose }) {
  useEffect(() => {
    const handleKeyPress = e => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      if (isOpen) {
        document.removeEventListener('keydown', handleKeyPress);
      }
    };
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div className="Overlay" onClick={onClose}>
          <div className="Modal">
            <img src={imageUrl} alt="" />
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;

// MyModal.tsx
import React from "react";
import "./modal.style.css";

interface Props {
  showModal: boolean;
  handleClose: () => void;
  handleData: () => void;
  name: string;
  setName: (name: string) => void;
}

const Modal = ({
  showModal,
  handleClose,
  handleData,
  name,
  setName,
}: Props) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <>
      <div className={`modal ${showModal ? "show" : ""}`}>
        <div className="modal-content">
          <span className="close" onClick={handleClose}>
            &times;
          </span>
          <h2>Modal</h2>
          <input
            type="text"
            placeholder="Enter the Name of ..."
            value={name}
            onChange={handleNameChange}
          />
          <button onClick={handleData}>Display Data</button>
        </div>
      </div>
    </>
  );
};

export default Modal;

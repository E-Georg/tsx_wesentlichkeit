// MyModal.tsx
import React from "react";
import "./modal.style.css";

interface Props {
  showModal: boolean;
  handleClose: () => void;
  handleData: () => void;
  title: string;
  text: string;
  setTitle: (title: string) => void;
  setText: (text: string) => void;
}

const Modal = ({
  showModal,
  handleClose,
  handleData,
  title,
  text,
  setTitle,
  setText,
}: Props) => {
  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setData: (x: string) => void
  ) => {
    setData(e.target.value);
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
            placeholder="Enter the Title of ..."
            value={title}
            onChange={(e) => handleNameChange(e, setTitle)}
          />
          <input
            type="text"
            placeholder="Enter the Text of ..."
            value={text}
            onChange={(e) => handleNameChange(e, setText)}
          />
          <button onClick={handleData}>Display Data</button>
        </div>
      </div>
    </>
  );
};

export default Modal;

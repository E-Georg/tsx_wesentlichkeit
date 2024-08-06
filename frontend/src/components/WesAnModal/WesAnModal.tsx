import React from "react";
import "./WesAnModal.scss";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  groupTitle: string;
  comments: Array<{
    SubStakeholderName: string;
    text: string;
  }>;
};

const ModalComponent: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  groupTitle,
  comments,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Comments for {groupTitle}</h2>
        <button onClick={onClose}>Close</button>
        {Array.isArray(comments) && comments.length > 0 ? (
          comments.map((message, index) => (
            <div key={index}>
              <p>
                <strong>{message.SubStakeholderName}:</strong> {message.text}
              </p>
            </div>
          ))
        ) : (
          <p>No comments available</p>
        )}
      </div>
    </div>
  );
};

export default ModalComponent;

import React from 'react';
import './WesAnModal.scss';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  groupTitle: string;
  comments: Array<{
    SubStakeholderName: string;
    text: string;
  }>;
};

const ModalComponent: React.FC<ModalProps> = ({ isOpen, onClose, groupTitle, comments }) => {
  if (!isOpen) return null;

  console.log(comments);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Comments for {groupTitle}</h2>
          <button className="modal-close" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="modal-body">
          {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((message, index) => (
              <div className="modal-comment" key={index}>
                <p className="modal-comment-header">
                  <strong>Stakeholder Name:</strong> {message.SubStakeholderName}
                </p>
                <p className="modal-comment-text">
                  <strong>Comment:</strong> {message.text}
                </p>
              </div>
            ))
          ) : (
            <p>No comments available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;

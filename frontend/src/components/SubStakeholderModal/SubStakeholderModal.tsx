import React from 'react';
import { SubStakeholder } from '../Models/data.interfaces';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  subStakeholderObject: Array<{}>;
};

const SubStakeholderModal: React.FC<ModalProps> = ({ isOpen, onClose, subStakeholderObject }) => {
  if (!isOpen) return null;

  console.log('subStakeholderObject:', subStakeholderObject);
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Liste der Bewertenden Stakeholder.</h2>
          <button className="modal-close" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="modal-body">
          {Array.isArray(subStakeholderObject) && subStakeholderObject.length > 0 ? (
            subStakeholderObject.map((subStakeholderInfo, index) => (
              <div className="modal-comment" key={index}>
                <p className="modal-comment-header">
                  <strong>Stakeholder Name:</strong> {subStakeholderInfo.name}
                </p>
                <p className="modal-comment-text">
                  {subStakeholderInfo.responded === 1 ? 'Bewertung abgegeben' : 'Bewertung nicht abgegeben'}
                </p>
              </div>
            ))
          ) : (
            <p>Keine Bewertung abgegeben</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubStakeholderModal;

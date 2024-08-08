import React from 'react';
import './ModalStakeholderView.scss'; // Importiere das SCSS-Styling

import { Relevances, Classifications } from '../../utils/constants';

type Info = {
  title: string;
  classification: string;
  relevance: string;
  relevanceText: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  info: Info;
};

const ModalStakeholderView: React.FC<Props> = ({ isOpen, onClose, info }) => {
  if (!isOpen) return null;

  const getRelevanceLabel = (value: number) => {
    const relevance = Relevances.find((r) => r.value === value);
    return relevance ? relevance.label : 'Unbekannt';
  };

  const getClassification = (value: number) => {
    const classification = Classifications.find((r) => r.value === value);
    return classification ? classification.label : 'Unbekannt';
  };

  return (
    <div className="ModalStakeholderView">
      <div className="ModalStakeholderView-content">
        <div>{info.title}</div>
        <div>
          {' '}
          <strong>Stakeholderklasse</strong>
          <br></br>
          {getClassification(info.classification)}
        </div>{' '}
        <strong>Relevanzbestimmung</strong>
        <br></br>
        <div>{getRelevanceLabel(info.relevance)}</div>
        <div>
          {' '}
          <strong>Begründung der Relevanz</strong>
          <br></br>
          {info.relevanceText}
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ModalStakeholderView;

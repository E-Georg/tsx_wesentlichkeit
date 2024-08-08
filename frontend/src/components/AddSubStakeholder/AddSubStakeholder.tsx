import './AddSubStakeholder.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { HttpAction, SubStakeholder } from '../Models/data.interfaces';
import useSubStakeholderData from '../Queries/useSubStakeholder';
import { useStore } from '../../store';
import useStakeholderData from '../Queries/useStakeholderData';
import { addStakeholder, handleStakeholderChange, updateDataOrDelete } from './AddSubStakeholderFunctions';
import SelectDropdown from '../SelectDropdown/SelectDropdown';
import { ChangeEvent, useState } from 'react';

type Props = {
  reset: () => void;
  newSubStakeholder: SubStakeholder;
  setNewSubStakeholder: (subStakeholder: SubStakeholder) => void;
};

const AddSubStakeholder = ({ reset, newSubStakeholder, setNewSubStakeholder }: Props) => {
  const { Stakeholder, isLoadingStake } = useStakeholderData();
  const { addSubStakeholderMutation, deleteSubStakeholderMutation, updateStakeholderMutation } =
    useSubStakeholderData();
  const { onChangeSubStakeholder, DELETE, SetDELETE } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [ButtonUpdateDelete, setButtonUpdateDelete] = useState('Daten Aktualisieren');
  const [error, setError] = useState<string | null>(null);

  if (isLoadingStake) {
    <div> ...LOADING</div>;
  }

  const options =
    Stakeholder && Stakeholder.length > 1
      ? Stakeholder.map((stakeholder) => ({
          value: stakeholder.id,
          label: stakeholder.title,
        }))
      : [];

  return (
    <>
      <button className="reset-button" onClick={reset}>
        Zurücksetzen
      </button>
      <h2>Substakeholder anlegen</h2>
      <div className="checkbox-wrapper">
        <label className="label" htmlFor="setDELETE">
          Löschen aktivieren:
        </label>
        <input
          type="checkbox"
          id="setDELETE"
          name="setDELETE"
          onChange={(event) => {
            console.log(DELETE);
            SetDELETE(event.target.checked);
            setButtonUpdateDelete(event.target.checked ? 'Daten Löschen' : 'Daten aktualisieren');
          }}
        />
      </div>

      <input
        type="text"
        placeholder="Name"
        value={newSubStakeholder.name}
        onChange={(e) => setNewSubStakeholder({ ...newSubStakeholder, name: e.target.value })}
        className="input-field"
      />
      <input
        type="email"
        placeholder="E-Mail"
        value={newSubStakeholder.email}
        onChange={(e) => setNewSubStakeholder({ ...newSubStakeholder, email: e.target.value })}
        className="input-field"
      />

      <SelectDropdown
        options={options}
        value={newSubStakeholder.stakeholderId}
        onChange={(event: ChangeEvent<HTMLSelectElement>) =>
          handleStakeholderChange(event, setNewSubStakeholder, newSubStakeholder)
        }
        placeholder="Stakeholdergruppe auswählen"
        style={{ margin: '10px 0', padding: '5px', width: '15rem', height: '2rem' }}
      />

      {onChangeSubStakeholder.mode !== HttpAction.POST && onChangeSubStakeholder.mode !== HttpAction.DELETE ? (
        <button
          onClick={() =>
            addStakeholder(setError, newSubStakeholder, addSubStakeholderMutation, reset, navigate, location)
          }
          className="primary-button"
        >
          Substakeholder hinzufügen
        </button>
      ) : (
        <button
          onClick={() =>
            updateDataOrDelete(
              DELETE,
              deleteSubStakeholderMutation,
              newSubStakeholder,
              updateStakeholderMutation,
              reset,
              location,
              navigate
            )
          }
          className="secondary-button"
        >
          {ButtonUpdateDelete}
        </button>
      )}
      {error && <p className="error-message">{error}</p>}
    </>
  );
};

export default AddSubStakeholder;

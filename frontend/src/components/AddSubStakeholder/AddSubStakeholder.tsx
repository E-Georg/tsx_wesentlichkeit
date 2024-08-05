import { useLocation, useNavigate } from 'react-router-dom';
import { COLORS } from '../../utils/constants';
import SelectDropdown from '../SelectDropdown/SelectDropdown';
import { ChangeEvent, useState } from 'react';
import { HttpAction, SubStakeholder } from '../Models/data.interfaces';
import useSubStakeholderData from '../Queries/useSubStakeholder';
import { useStore } from '../../store';
import useStakeholderData from '../Queries/useStakeholderData';
import { addStakeholder, handleStakeholderChange, updateDataOrDelete } from './AddSubStakeholderFunctions';

type Props = {
  reset: () => void;
  newSubStakeholder: SubStakeholder;
  setNewSubStakeholder: (subStakeholder: SubStakeholder) => void;
};

const AddSubStakeholder = ({ reset, newSubStakeholder, setNewSubStakeholder }: Props) => {
  const { Stakeholder, isLoadingStake } = useStakeholderData();
  const { addSubStakeholderMutation, deleteSubStakeholderMutation, updateStakeholderMutation } = useSubStakeholderData();
  const { onChangeSubStakeholder, DELETE, SetDELETE } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [ButtonUpdateDelete, setButtonUpdateDelete] = useState('Daten Aktualisieren');
  const [error, setError] = useState<string | null>(null);

  if (isLoadingStake) {
    <div> ...LOADING</div>;
  }

  const options =
    Stakeholder && Stakeholder?.length > 1
      ? Stakeholder.map((stakeholder) => ({
          value: stakeholder.id,
          label: stakeholder.title,
        }))
      : [];

  return (
    <>
      <button
        style={{
          height: '1.5rem',
          padding: '0 1rem',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          backgroundColor: 'grey',
          color: '#fff',
          borderRadius: '0.25rem',
          cursor: 'pointer',
        }}
        onClick={reset}
      >
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
        style={{ margin: '10px 0', padding: '5px', width: '200px', height: '25px' }}
      />
      <input
        type="email"
        placeholder="E-Mail"
        value={newSubStakeholder.email}
        onChange={(e) => setNewSubStakeholder({ ...newSubStakeholder, email: e.target.value })}
        style={{ margin: '10px 0', padding: '5px', width: '200px', height: '25px' }}
      />
      {/* // TODO: IN COMPONENT */}
      <SelectDropdown
        options={options}
        value={newSubStakeholder.stakeholderId}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => handleStakeholderChange(event, setNewSubStakeholder, newSubStakeholder)}
        placeholder="Stakeholdergruppe auswählen"
        style={{ margin: '10px 0', padding: '5px', width: '15rem', height: '2rem' }}
      />
      {onChangeSubStakeholder.mode != HttpAction.POST && onChangeSubStakeholder.mode != HttpAction.DELETE ? (
        <button
          onClick={() => addStakeholder(setError, newSubStakeholder, addSubStakeholderMutation, reset, navigate, location)}
          style={{ backgroundColor: COLORS.TERTIARY, padding: '5px 10px', marginLeft: '10px' }}
        >
          Substakeholder hinzufügen
        </button>
      ) : (
        <button
          onClick={() => updateDataOrDelete(DELETE, deleteSubStakeholderMutation, newSubStakeholder, updateStakeholderMutation, reset, location, navigate)}
          style={{ backgroundColor: COLORS.SECONDARY, padding: '5px 10px', marginLeft: '10px' }}
        >
          {ButtonUpdateDelete}
        </button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  );
};

export default AddSubStakeholder;

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import useStakeholderData from '../Queries/useStakeholderData';
import { HttpAction, SubStakeholder } from '../Models/data.interfaces';
import useSubStakeholderData from '../Queries/useSubStakeholder';
import { COLORS } from '../../utils/constants';

// 1. mit Query die Daten holen (id, name, email, stakeholderId)
// 2. unterscheidung zwischen löschen/updaten/adden
//    onChangeSubStakeholer({mode, id})
// 3. states alle hier lassen
// 4. ein button für delete / update

const SubStakeholderList = () => {
  // GET Stakeholder from query
  const { Stakeholder, isLoadingStack } = useStakeholderData();
  const { SubStakeholder: SubStakeholderQuery, addSubStakeholderMutation, deleteSubStakeholderMutation, updateStakeholderMutation } = useSubStakeholderData();
  const { onChangeSubStakeholder, setOnChangeSubStakeholder, DELETE, SetDELETE } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [newStakeholder, setNewStakeholder] = useState<SubStakeholder>({
    id: 0,
    name: '',
    email: '',
    stakeholderId: 0,
  });
  const [ButtonUpdateDelete, setButtonUpdateDelete] = useState('Daten Aktualisieren');

  const [error, setError] = useState<string | null>(null);

  if (isLoadingStack) {
    <div> ...LOADING</div>;
  }

  useEffect(() => {
    SetDELETE(false);
  }, []);

  const addStakeholder = async () => {
    // Post to Database
    // need more checking?
    if (!/\S+@\S+\.\S+/.test(newStakeholder.email)) {
      setError('Email must contain an "@" and a "."');
      return;
    }
    console.log(newStakeholder);

    // post
    await addSubStakeholderMutation({
      newStakeholder: {
        name: newStakeholder.name,
        email: newStakeholder.email,
        stakeholderId: newStakeholder.stakeholderId,
      },
    });
    reset();
    setError(null);

    if (location.state?.from === 'modal') {
      navigate('/');
    }
  };

  const updateDataOrDelete = async () => {
    // Update logic
    if (DELETE) {
      await deleteSubStakeholderMutation(newStakeholder.id);
    } else {
      await updateStakeholderMutation({
        newStakeholder: {
          id: newStakeholder.id,
          name: newStakeholder.name,
          email: newStakeholder.email,
          stakeholderId: newStakeholder.stakeholderId,
        },
      });
    }
    reset();
    // if succes testen
    if (location.state?.from === 'modal') {
      navigate('/');
    }
  };

  const reset = () => {
    setOnChangeSubStakeholder({ mode: HttpAction.DEFAULT, ID: 0 });
    setNewStakeholder({ id: 0, name: '', email: '', stakeholderId: 0 });
  };

  // SORT im BACKEND
  // const sortedSubStakeholders = SubStakeholderQuery?.sort((x, y) => x.id - y.id);

  return (
    <div style={{ margin: '20px' }}>
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
          // TODO: FUNKT net
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
        value={newStakeholder.name}
        onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })}
        style={{ margin: '10px 0', padding: '5px', width: '200px', height: '25px' }}
      />
      <input
        type="email"
        placeholder="E-Mail"
        value={newStakeholder.email}
        onChange={(e) => setNewStakeholder({ ...newStakeholder, email: e.target.value })}
        style={{ margin: '10px 0', padding: '5px', width: '200px', height: '25px' }}
      />
      {/* // TODO: IN COMPONENT */}
      <select
        value={newStakeholder.stakeholderId}
        onChange={(e) => {
          setNewStakeholder({
            ...newStakeholder,
            stakeholderId: Number(e.target.value),
          });
        }}
        style={{ margin: '10px 0', padding: '5px', width: '15rem', height: '2rem' }}
      >
        {newStakeholder.stakeholderId === 0 && <option value={0}>Stakeholdergruppe auswählen</option>}
        {Stakeholder?.map((stakeholder, index) => (
          <option key={index} value={stakeholder.id}>
            {stakeholder.title}
          </option>
        ))}
      </select>
      {onChangeSubStakeholder.mode != HttpAction.POST && onChangeSubStakeholder.mode != HttpAction.DELETE ? (
        <button onClick={addStakeholder} style={{ backgroundColor: COLORS.TERTIARY, padding: '5px 10px', marginLeft: '10px' }}>
          Substakeholder hinzufügen
        </button>
      ) : (
        <button onClick={updateDataOrDelete} style={{ backgroundColor: COLORS.SECONDARY, padding: '5px 10px', marginLeft: '10px' }}>
          {ButtonUpdateDelete}
        </button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {SubStakeholderQuery && (
        <div>
          <h2 style={{ marginTop: '5rem' }}>Substakeholder Übersicht </h2>
          <table style={{ margin: '20px 0', width: '100%' }}>
            <thead style={{ textAlign: 'left', fontSize: '20px', textDecoration: 'underline', textDecorationThickness: '0.01rem' }}>
              <tr>
                <th>Name</th>
                <th>E-Mail</th>
                <th>Stakeholdergruppe</th>
              </tr>
            </thead>
            <tbody>
              {SubStakeholderQuery?.length! >= 1 &&
                SubStakeholderQuery?.map((stakeholder: SubStakeholder, index: number) => (
                  <tr
                    onClick={() => {
                      setNewStakeholder({
                        id: stakeholder.id,
                        name: stakeholder.name,
                        email: stakeholder.email,
                        stakeholderId: stakeholder.stakeholderId,
                      });
                      // nur um die Button zutauschen, da DELETE in der Function abgefragt wird!
                      // TODO: Muss überdacht werden
                      if (DELETE) setOnChangeSubStakeholder({ mode: HttpAction.DELETE, ID: stakeholder.id });
                      else setOnChangeSubStakeholder({ mode: HttpAction.POST, ID: stakeholder.id });
                    }}
                    key={index}
                  >
                    <td>{stakeholder.name}</td>
                    <td>{stakeholder.email}</td>
                    <td>{Stakeholder?.find((data) => data.id === stakeholder.stakeholderId)?.title}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubStakeholderList;

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import useStakeholderData from '../Queries/useStakeholderData';
import { HttpAction, SubStakeholder } from '../Models/data.interfaces';
import useSubStakeholderData from '../Queries/useSubStakeholder';

// 1. mit Query die Daten holen (id, name, email, stakeholderId)
// 2. unterscheidung zwischen löschen/updaten/adden
//    onChangeSubStakeholer({mode, id})
// 3. states alle hier lassen
// 4. ein button für delete / update

const StakeholderList = () => {
  // GET Stakeholder from query
  const { Stakeholder, isLoadingStack } = useStakeholderData();
  const {
    SubStakeholder: SubStakeholderQuery,
    addSubStakeholderMutation,
    deleteSubStakeholderMutation,
  } = useSubStakeholderData();
  const { setSubStakeholder, SubStakeholder, onChangeSubStakeholder, setOnChangeSubStakeholder, DELETE, SetDELETE } =
    useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [newStakeholder, setNewStakeholder] = useState<SubStakeholder>({
    id: 0,
    name: '',
    email: '',
    stakeholderId: 0,
  });

  const [error, setError] = useState<string | null>(null);

  if (isLoadingStack) {
    <div> ...LOADING</div>;
  }

  const addStakeholder = () => {
    // Post to Database
    // need more checking?
    if (!/\S+@\S+\.\S+/.test(newStakeholder.email)) {
      setError('Email must contain an "@" and a "."');
      return;
    }

    // post
    setSubStakeholder(newStakeholder);
    setNewStakeholder({ id: 0, name: '', email: '', stakeholderId: 0 });
    setError(null);

    if (location.state?.from === 'modal') {
      navigate('/');
    }
  };

  const updateDataOrDelete = () => {
    // Update logic
    console.log(newStakeholder);
    if (onChangeSubStakeholder.mode === HttpAction.DELETE) {
      deleteSubStakeholderMutation(newStakeholder);
    } else if (onChangeSubStakeholder.mode === HttpAction.POST) {
      addSubStakeholderMutation(newStakeholder);
    }
  };
  console.log(SubStakeholderQuery);

  return (
    <div style={{ margin: '20px' }}>
      <div className="checkbox-wrapper">
        <label className="label" htmlFor="setDELETE">
          Löschen aktivieren:
        </label>
        <input type="checkbox" id="setDELETE" name="setDELETE" onChange={() => SetDELETE()} />
      </div>
      <h2>Add a new stakeholder</h2>
      <input
        type="text"
        placeholder="Name"
        value={newStakeholder.name}
        onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })}
        style={{ margin: '10px 0', padding: '5px', width: '200px', height: '25px' }}
      />
      <input
        type="email"
        placeholder="Email"
        value={newStakeholder.email}
        onChange={(e) => setNewStakeholder({ ...newStakeholder, email: e.target.value })}
        style={{ margin: '10px 0', padding: '5px', width: '200px', height: '25px' }}
      />

      <select
        value={newStakeholder.stakeholderId}
        onChange={(e) =>
          setNewStakeholder({
            ...newStakeholder,
            stakeholderId: Number(e.target.value),
          })
        }
        style={{ margin: '10px 0', padding: '5px', width: '200px', height: '25px' }}
      >
        {Stakeholder?.map((stakeholder, index) => (
          <option key={index} value={stakeholder.id}>
            {stakeholder.title}
          </option>
        ))}
      </select>

      <button onClick={addStakeholder} style={{ padding: '5px 10px', margin: '10px 0' }}>
        Add Stakeholder
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {SubStakeholder && (
        <div>
          <h2>Stakeholders</h2>
          <table style={{ margin: '20px 0', width: '100%' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Stakeholder</th>
              </tr>
            </thead>
            <tbody>
              {SubStakeholderQuery?.map((stakeholder: SubStakeholder, index: number) => (
                <tr
                  onClick={() => {
                    setNewStakeholder({
                      id: stakeholder.id,
                      name: stakeholder.name,
                      email: stakeholder.email,
                      stakeholderId: stakeholder.stakeholderId,
                    });

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
      <button onClick={updateDataOrDelete} style={{ padding: '5px 10px', margin: '10px 0' }}>
        Update / Delete Data
      </button>
    </div>
  );
};

export default StakeholderList;

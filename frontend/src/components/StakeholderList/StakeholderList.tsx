import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import useStakeholderData from '../Queries/useStakeholderData';

interface Stakeholder {
  id: number;
  name: string;
  email: string;
  stakeholder: string;
}

const StakeholderList = () => {
  // GET Stakeholder from query
  let { Stakeholder, isLoadingStack } = useStakeholderData();

  if (isLoadingStack) {
    <div> ...LOADING</div>;
  }

  const navigate = useNavigate();
  const location = useLocation();

  const { setSubStakeholder, SubStakeholder } = useStore();

  const [newStakeholder, setNewStakeholder] = useState<Stakeholder>({
    id: 99,
    name: '',
    email: '',
    stakeholder: '',
  });

  const [error, setError] = useState<string | null>(null);

  const addStakeholder = () => {
    // Post to Database

    // need more checking?
    if (!/\S+@\S+\.\S+/.test(newStakeholder.email)) {
      setError('Email must contain an "@" and a "."');
      return;
    }

    setSubStakeholder(newStakeholder);
    setNewStakeholder({ id: 0, name: '', email: '', stakeholder: '' });
    console.log(SubStakeholder);
    setError(null);

    if (location.state?.from === 'modal') {
      navigate('/');
    }
  };

  return (
    <div style={{ margin: '20px' }}>
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
        value={newStakeholder.stakeholder}
        onChange={(e) =>
          setNewStakeholder({
            ...newStakeholder,
            stakeholder: e.target.value,
          })
        }
        style={{ margin: '10px 0', padding: '5px', width: '200px', height: '25px' }}
      >
        {Stakeholder?.map((stakeholder, index) => (
          <option key={index} value={stakeholder.text}>
            {stakeholder.text}
          </option>
        ))}
      </select>

      <button onClick={addStakeholder} style={{ padding: '5px 10px', margin: '10px 0' }}>
        Add Stakeholder
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Stakeholders</h2>
      <table style={{ margin: '20px 0', width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>stakeholder</th>
          </tr>
        </thead>
        <tbody>
          {/* Get from Database */}
          {SubStakeholder.map((stakeholder, index) => (
            <tr key={index}>
              <td>{stakeholder.name}</td>
              <td>{stakeholder.email}</td>
              <td>{stakeholder.stakeholder}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StakeholderList;

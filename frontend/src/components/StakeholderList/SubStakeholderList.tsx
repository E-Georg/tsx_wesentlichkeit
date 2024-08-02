import { useEffect, useState } from 'react';
import { useStore } from '../../store';
import AddSubStakeholder from '../AddSubStakeholder/AddSubStakeholder';
import DisplaySubStakeholder from '../DisplaySubStakeholder/DisplaySubStakeholder';
import { SubStakeholder } from '../Models/data.interfaces';
import { reset } from './SubStakeholderListFunctions';

const SubStakeholderList = () => {
  // GET Stakeholder from query
  const { SetDELETE, setOnChangeSubStakeholder } = useStore();
  const [newSubStakeholder, setNewSubStakeholder] = useState<SubStakeholder>({
    id: 0,
    name: '',
    email: '',
    stakeholderId: 0,
  });

  useEffect(() => {
    SetDELETE(false);
    reset(setOnChangeSubStakeholder, setNewSubStakeholder);
  }, []);

  return (
    <div style={{ margin: '20px' }}>
      <AddSubStakeholder
        reset={() => reset(setOnChangeSubStakeholder, setNewSubStakeholder)}
        newSubStakeholder={newSubStakeholder}
        setNewSubStakeholder={setNewSubStakeholder}
      />
      
      <DisplaySubStakeholder setNewSubStakeholder={setNewSubStakeholder} />
    </div>
  );
};

export default SubStakeholderList;

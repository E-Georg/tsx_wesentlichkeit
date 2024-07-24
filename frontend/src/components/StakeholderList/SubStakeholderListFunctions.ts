import { ChangeObject } from '../../store';
import { HttpAction, SubStakeholder } from '../Models/data.interfaces';

export const reset = (setOnChangeSubStakeholder: (obj: ChangeObject) => void, setNewSubStakeholder: (substakeholder: SubStakeholder) => void) => {
  setOnChangeSubStakeholder({ mode: HttpAction.DEFAULT, ID: 0 });
  setNewSubStakeholder({ id: 0, name: '', email: '', stakeholderId: 0 });
};

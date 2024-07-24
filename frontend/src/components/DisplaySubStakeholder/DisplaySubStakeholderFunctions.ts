import { ChangeObject } from '../../store';
import { HttpAction, SubStakeholder } from '../Models/data.interfaces';

export const setEditOrDelete = (
  setNewStakeholder: (substakeholder: SubStakeholder) => void,
  subStakeholder: SubStakeholder,
  DELETE: boolean,
  setOnChangeSubStakeholder: (obj: ChangeObject) => void
) => {
  setNewStakeholder({
    id: subStakeholder.id,
    name: subStakeholder.name,
    email: subStakeholder.email,
    stakeholderId: subStakeholder.stakeholderId,
  });
  // nur um die Button zutauschen, da DELETE in der Function abgefragt wird!
  // TODO: Muss überdacht werden
  if (DELETE) setOnChangeSubStakeholder({ mode: HttpAction.DELETE, ID: subStakeholder.id });
  else setOnChangeSubStakeholder({ mode: HttpAction.POST, ID: subStakeholder.id });
};

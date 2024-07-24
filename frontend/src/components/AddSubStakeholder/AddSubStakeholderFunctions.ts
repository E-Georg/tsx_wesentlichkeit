import { MutationFunction } from '@tanstack/react-query';
import { SubStakeholder } from '../Models/data.interfaces';
import { Location, NavigateFunction } from 'react-router-dom';
import { ChangeEvent } from 'react';

export const addStakeholder = async (
  setError: (error: string | null) => void,
  newStakeholder: SubStakeholder,
  addSubStakeholderMutation: MutationFunction<void, { newStakeholder: SubStakeholder }>,
  reset: () => void,
  navigate: NavigateFunction,
  location: Location<any>
) => {
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
      id: 0,
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

export const updateDataOrDelete = async (
  DELETE: boolean,
  deleteSubStakeholderMutation: MutationFunction<void, number>,
  newStakeholder: SubStakeholder,
  updateStakeholderMutation: MutationFunction<void, { newStakeholder: SubStakeholder }>,
  reset: () => void,
  location: Location<any>,
  navigate: NavigateFunction
) => {
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

export const handleStakeholderChange = (
  event: ChangeEvent<HTMLSelectElement>,
  setNewSubStakeholder: (subStakeholder: SubStakeholder) => void,
  newSubStakeholder: SubStakeholder
) => {
  setNewSubStakeholder({
    ...newSubStakeholder,
    stakeholderId: Number(event.target.value),
  });
};

import { ChangeEvent, useState } from 'react';
import { useStore } from '../../store';
import { SubStakeholder } from '../Models/data.interfaces';
import useStakeholderData from '../Queries/useStakeholderData';
import useSubStakeholderData from '../Queries/useSubStakeholder';
import { setEditOrDelete } from './DisplaySubStakeholderFunctions';
import SelectDropdown from '../SelectDropdown/SelectDropdown';

type Props = {
  setNewSubStakeholder: (subStakeholder: SubStakeholder) => void;
};

const DisplaySubStakeholder = ({ setNewSubStakeholder: setNewStakeholder }: Props) => {
  const { Stakeholder, isLoadingStack } = useStakeholderData();
  const { SubStakeholder: SubStakeholderQuery } = useSubStakeholderData();
  const { setOnChangeSubStakeholder, DELETE } = useStore();
  const [filter, setFilter] = useState(0);

  if (isLoadingStack) {
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
      {SubStakeholderQuery && SubStakeholderQuery.length > 1 && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
            <h2 style={{ marginTop: '5rem' }}>Substakeholder Übersicht </h2>
            {/* Choose the wanted Stakeholder */}
            <SelectDropdown
              options={options}
              value={filter}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => setFilter(Number(event.target.value))}
              placeholder="Stakeholdergruppe auswählen"
              style={{ marginLeft: '7rem', padding: '5px', width: '15rem', height: '2rem' }}
            />
          </div>
          <table style={{ margin: '20px 0', width: '100%' }}>
            <thead style={{ textAlign: 'left', fontSize: '20px', textDecoration: 'underline', textDecorationThickness: '0.01rem' }}>
              <tr>
                <th>Name</th>
                <th>E-Mail</th>
                <th>Stakeholdergruppe</th>
              </tr>
            </thead>
            <tbody>
              {SubStakeholderQuery &&
                SubStakeholderQuery.length! >= 1 &&
                Array.isArray(SubStakeholderQuery) &&
                // Sort
                SubStakeholderQuery?.sort((x: any, y: any) => x.stakeholderId - y.stakeholderId)
                  // Filter according to choosen stakeholder or all
                  .filter((subStake: SubStakeholder) => {
                    if (filter != 0) {
                      return subStake.stakeholderId === filter;
                    }
                    return subStake;
                  })
                  // Map over the filtered SubStakeholder
                  .map((subStakeholder: SubStakeholder, index: number) => (
                    <tr
                      onClick={() => {
                        setEditOrDelete(setNewStakeholder, subStakeholder, DELETE, setOnChangeSubStakeholder);
                      }}
                      key={index}
                    >
                      <td>{subStakeholder.name}</td>
                      <td>{subStakeholder.email}</td>
                      <td>{Stakeholder?.find((data) => data.id === subStakeholder.stakeholderId)?.title}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default DisplaySubStakeholder;

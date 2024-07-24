import { useStore } from '../../store';
import { SubStakeholder } from '../Models/data.interfaces';
import useStakeholderData from '../Queries/useStakeholderData';
import useSubStakeholderData from '../Queries/useSubStakeholder';
import { setEditOrDelete } from './DisplaySubStakeholderFunctions';

type Props = {
  setNewSubStakeholder: (subStakeholder: SubStakeholder) => void;
};

const DisplaySubStakeholder = ({ setNewSubStakeholder: setNewStakeholder }: Props) => {
  const { Stakeholder, isLoadingStack } = useStakeholderData();
  const { SubStakeholder: SubStakeholderQuery } = useSubStakeholderData();
  const { setOnChangeSubStakeholder, DELETE } = useStore();

  if (isLoadingStack) {
    <div> ...LOADING</div>;
  }
  return (
    <>
      {SubStakeholderQuery && SubStakeholderQuery.length > 1 && (
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
              {SubStakeholderQuery &&
                SubStakeholderQuery.length! >= 1 &&
                SubStakeholderQuery?.map((subStakeholder: SubStakeholder, index: number) => (
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

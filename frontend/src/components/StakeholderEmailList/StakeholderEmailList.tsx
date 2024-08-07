import Emailbtn from '../Emailbtn/Emailbtn';

// Definiere die Typen für Stakeholder und SubStakeholder
interface Stakeholder {
  id: number;
  relevance: number;
}

interface SubStakeholder {
  stakeholderId: number;
  email: string;
  id: number;
}

interface EmailButtonListProps {
  stakeholders: any;
  subStakeholder: SubStakeholder;
  Betreff: string;
}

const isStakeholder = (item: Stakeholder): item is Stakeholder => item && item.relevance !== undefined;

const EmailButtonList = ({ stakeholders, subStakeholder, Betreff }: EmailButtonListProps) => {
  return (
    <>
      {Array.isArray(stakeholders) &&
        stakeholders.map((item: Stakeholder) => {
          if (isStakeholder(item) && subStakeholder.stakeholderId === item.id && item.relevance === 1) {
            return <Emailbtn key={item.id} email={subStakeholder.email} subject={Betreff} body={`http://localhost:5173/survey/${subStakeholder.id}`} />;
          }
          return null;
        })}
    </>
  );
};

export default EmailButtonList;

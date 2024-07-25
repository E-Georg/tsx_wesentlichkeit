import { useParams } from 'react-router-dom';

const Survey = () => {
  const { id } = useParams();
  console.log(id);

  // Group Überschrift

  return (
    <>
      <h1>Befragung</h1>
    </>
  );
};

export default Survey;

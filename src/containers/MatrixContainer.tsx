import { useEffect } from 'react';
import Matrix from '../components/Matrix/Matrix';
import { ClientTypes } from '../utils/data.interfaces';
import { fetchCells, fetchData } from '../services/ApiService';
import { useStore } from '../store';
import Modal from '../components/Modal/Modal';

const MatrixContainer = () => {
  const { title, setTitle, text, setText, ClientID, GroupID, rows, setRows, columns, setColumns, cells, setCells } =
    useStore();

  useEffect(() => {
    fetchData(ClientTypes.Stakeholders, setColumns, ClientID);
    fetchData(ClientTypes.SubGroups, setRows, ClientID, GroupID);
    fetchCells(ClientTypes.Cells, ClientID, GroupID, setCells);
  }, []);

  return (
    <>
      <Matrix
        rows={rows}
        columns={columns}
        cells={cells}
        showAddToMatrix={true}
        setTitle={setTitle}
        setText={setText}
      />

      <Modal title={title} text={text} setTitle={setTitle} setText={setText} />
    </>
  );
};

export default MatrixContainer;

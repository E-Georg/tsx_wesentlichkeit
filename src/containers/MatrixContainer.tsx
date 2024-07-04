import { useEffect } from "react";
import Matrix from "../components/Matrix/Matrix";
import {
  ClientTypes,
} from "../utils/data.interfaces";
import { fetchCells, fetchData } from "../services/ApiService";
import { useMatrixContainerStore } from "../store";

const MatrixContainer = () => {
  const {count, increment, title,setTitle, text, setText, ClientID, GroupID, rows,setRows, columns, setColumns, cells,setCells} = useMatrixContainerStore();


  // use REDUX
  useEffect(() => {
    fetchData(ClientTypes.Stakeholders, setColumns, ClientID);
    console.log("COLUMNS", columns, count);
    increment()
  }, []);

  useEffect(() => {
    fetchData(ClientTypes.SubGroups, setRows, ClientID, GroupID);
    console.log("ROWS", rows, count);
    increment()
  }, []);

  useEffect(() => {
    fetchCells(ClientTypes.Cells, ClientID, GroupID, setCells);
    console.log("CELLS", cells, count);
    increment()
  }, []);

  return (
    <>
      <Matrix
        rows={rows}
        setRows={setRows}
        columns={columns}
        setColumns={setColumns}
        cells={cells}
        setCells={setCells}
        showAddToMatrix={true}
        title={title}
        text={text}
        setTitle={setTitle}
        setText={setText}
      />
    </>
  );
};

export default MatrixContainer;

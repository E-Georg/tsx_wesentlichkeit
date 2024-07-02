import { useEffect, useState } from "react";
import Matrix from "../components/Matrix/Matrix";
import {
  SubGroup,
  Stackholder,
  Cell,
  ClientTypes,
} from "../utils/data.interfaces";
import { fetchCells, fetchData } from "../services/ApiService";
import { Zellen, initialColumns, initialRows } from "../utils/data.api";

const MatrixContainer = () => {
  const [rows, setRows] = useState<SubGroup[]>(initialRows);
  const [columns, setColumns] = useState<Stackholder[]>(initialColumns);
  const [cells, setCells] = useState<Cell[]>(Zellen);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const [count, setCount] = useState(1);

  // use REDUX
  useEffect(() => {
    fetchData(ClientTypes.Stakeholders, setColumns, 2);
    console.log("COLUMNS", columns, count);
    setCount(() => count + 1);
  }, []);

  useEffect(() => {
    fetchData(ClientTypes.SubGroups, setRows, 2, 1);
    console.log("ROWS", rows, count);
    setCount(() => count + 1);
  }, []);

  useEffect(() => {
    fetchCells(2, 1, setCells);
    console.log("CELLS", cells, count);
    setCount(() => count + 1);
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

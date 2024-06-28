import { useEffect, useState } from "react";
import Matrix from "../components/Matrix/Matrix";
import { initialRows, initialColumns, Zellen } from "../utils/data.api";
import {
  SubGroup,
  Stackholder,
  Cell,
  ClientTypes,
} from "../utils/data.interfaces";
import { fetchCells, fetchData } from "../services/ApiService";

// ENUM FÜR API TYPES

// MatrixContainer.tsx
const MatrixContainer = () => {
  const [rows, setRows] = useState<SubGroup[]>(initialRows);
  const [columns, setColumns] = useState<Stackholder[]>(initialColumns);
  const [cells, setCells] = useState<Cell[]>(Zellen);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const [count, setCount] = useState(1);

  useEffect(() => {
    // console.log("why");
    // if (count > 1) return;
    fetchData(ClientTypes.Stakeholders, setColumns, 2);
    fetchData(ClientTypes.SubGroups, setRows, 2, 1);
    fetchCells(2, 1, setCells);
    console.log("Cells: ", cells);
    console.log("Columns: ", columns);
    setCount(count + 1);
    console.log(" Counter: ", count);
  }, [columns.length, rows.length, cells.length]);

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

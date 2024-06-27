import { useState } from "react";
import Matrix from "../components/Matrix/Matrix";
import { initialRows, initialColumns, Zellen } from "../utils/data.api";
import { SubGroup, Stackholder } from "../utils/data.interfaces";


// MatrixContainer.tsx
const MatrixContainer = () => {
  const [rows, setRows] = useState<SubGroup[]>(initialRows);
  const [columns, setColumns] = useState<Stackholder[]>(initialColumns);
  const [name, setName] = useState("");

  return (
    <>
      <Matrix
        rows={rows}
        setRows={setRows}
        columns={columns}
        setColumns={setColumns}
        cells={Zellen}
        showAddToMatrix={true}
        name={name}
        setName={setName}
      />
    </>
  );
};

export default MatrixContainer;

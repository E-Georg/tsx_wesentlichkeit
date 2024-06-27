import { useState } from "react";
import Matrix from "../components/Matrix/Matrix";
import {
  Stackholder,
  SubGroup,
  Zellen,
  initialColumns,
  initialRows,
} from "../utils/InterfacesData";

// MatrixContainer.tsx
const MatrixContainer = () => {
  const [rows, setRows] = useState<SubGroup[]>(initialRows);
  const [columns, setColumns] = useState<Stackholder[]>(initialColumns);

  return (
    <>
      <Matrix
        rows={rows}
        setRows={setRows}
        columns={columns}
        setColumns={setColumns}
        cells={Zellen}
      />
    </>
  );
};

export default MatrixContainer;

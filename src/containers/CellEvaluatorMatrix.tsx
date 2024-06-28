import { useEffect, useState } from "react";
import Matrix from "../components/Matrix/Matrix";
import { initialColumns } from "../utils/data.api";
import { SubGroup, Stackholder, Cell } from "../utils/data.interfaces";

// MatrixContainer.tsx
const CellEvaluatorMatrix = () => {
  const [rows, setRows] = useState<SubGroup[]>([]);
  const [columns, setColumns] = useState<Stackholder[]>(initialColumns);
  const [cells, setCells] = useState<Cell[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const [count, setCount] = useState(1);

  useEffect(() => {
    // get Cells as subgroup => parse them in subgroup
    // subgroup.id = Cells.id
    // subgroupo.text = Cells...SubgroupID.Cells...StackholderID
    // Stackholder allways the same
    // Cells empty and habe to be generated.

    setCount(count + 1);
    console.log(" Counter: ", count);
  }, [cells.length]);

  return (
    <>
      <Matrix
        rows={rows}
        setRows={setRows}
        columns={columns}
        setColumns={setColumns}
        cells={cells}
        showAddToMatrix={true}
        title={title}
        text={text}
        setTitle={setTitle}
        setText={setText}
        count={setCount}
      />
    </>
  );
};

export default CellEvaluatorMatrix;

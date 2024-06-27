import { useState } from "react";
import "./App.css";
import MatrixContainer from "./containers/MatrixContainer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <MatrixContainer />
    </>
  );
}

export default App;

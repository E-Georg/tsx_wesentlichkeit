import "./App.css";
import MatrixContainer from "./containers/MatrixContainer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MatrixContainer />}></Route>
      </Routes>
    </Router>
  );
}

export default App;

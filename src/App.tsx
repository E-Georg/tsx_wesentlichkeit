import "./App.css";
import Editor from "./components/Editor/Editor";
import MatrixContainer from "./containers/MatrixContainer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Home" element={<MatrixContainer />}></Route>
        <Route path="/" element={<Editor />}></Route>
      </Routes>
    </Router>
  );
}

export default App;

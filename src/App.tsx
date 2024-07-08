import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import Editor from './components/Editor/Editor';
import MatrixContainer from './containers/MatrixContainer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/Home" element={<MatrixContainer />}></Route>
          <Route path="/" element={<Editor />}></Route>
        </Routes>
      </QueryClientProvider>
    </Router>
  );
}

export default App;

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './components/Pages/LoginPages/LoginPages';
import RegisterPage from './components/Pages/RegisterPage/RegisterPage';
import MatrixPage from './components/Pages/MatrixPages/MatrixPage';
import { tokenLoader } from './utils/auth';
import RootLayout from './components/Root/RootLayout';
import SubStakeholderList from './components/StakeholderList/SubStakeholderList';
import SurveyPage from './components/Pages/SurveyPage/SurveyPage';
import Wesentlichkeitsanalyse from './components/Pages/Wesentlichkeitsanalyse/Wesentlichkeitsanalyse';
import PrevaluationPage from './components/Pages/PrevaluationPage/PrevaluationPage';

//TODO: infinity hinzufügen
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 2400000,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    // error: <ErrorPage/>
    loader: tokenLoader,
    children: [
      {
        path: '/',
        element: <MatrixPage />,
        // loader: checkAuthLoader
      },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/stakeholderlist', element: <SubStakeholderList /> },
      { path: '/survey/:id?', element: <SurveyPage /> },
      { path: '/WesAn', element: <Wesentlichkeitsanalyse /> },
      { path: '/Prevaluation', element: <PrevaluationPage /> },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;

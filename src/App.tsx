import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UpdateAffiliate from './pages/UpdateAffiliate';
import RegisterLocation from './pages/RegisterLocation';
import DeleteAccount from './pages/DeleteAccount';
import RegisterAffiliate from './pages/RegisterAffiliate';
import Login from './pages/Login';
import Loading from './components/Loading';

function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route
          path="/"
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="update-affiliate" element={<UpdateAffiliate />} />
          <Route path="register-location" element={<RegisterLocation />} />
          <Route path="delete-account" element={<DeleteAccount />} />
          <Route path="register-affiliate" element={<RegisterAffiliate />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
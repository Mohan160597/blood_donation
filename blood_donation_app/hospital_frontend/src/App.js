import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Registration';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CreateRequest from './components/Request_Management/CreateRequest';
import ManageRequests from './components/Request_Management/ManageRequests';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing page with header, logo, and buttons */}
          <Route path="/" element={<LandingPage />} />

          {/* Route for the hospital registration */}
          <Route path="/registration" element={<Register />} />

          {/* Route for the hospital login */}
          <Route path="/login" element={<Login />} />

          {/* Routes inside the Dashboard */}
          {isAuthenticated ? (
            <Route
              path="/dashboard/*"
              element={
                <Dashboard>
                  <Routes>
                    <Route path="create-requests" element={<CreateRequest />} />
                    <Route path="manage-requests" element={<ManageRequests />} />
                  </Routes>
                </Dashboard>
              }
            />
          ) : (
            <Route path="*" element={<Login />} />
          )}

          {/* Fallback for undefined routes */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

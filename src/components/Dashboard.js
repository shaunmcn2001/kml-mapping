import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <div className="topbar">
        <span className="logo">Spatial KML Viewer</span>
        <div>
          {user && <span>Welcome, {user.username}! </span>}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="content">
        <h2>Dashboard</h2>
        <p>Upload a KML file to visualize its contents.</p>
        <Link to="/upload" className="button">Upload New KML</Link>
      </div>
    </div>
  );
}
export default Dashboard;
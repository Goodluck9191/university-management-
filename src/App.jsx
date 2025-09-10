// src/App.jsx (Alternative with user selection)
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import Assets from './pages/Assets'
import AddAsset from './pages/AddAsset'
import Reports from './pages/Reports'
import AssetDetails from './pages/AssetDetails'
import EditAsset from './pages/EditAsset'
import Assignments from './pages/Assignment'
import Maintenance from './pages/Maintenance'
import './index.css'

// Mock user data for different roles
const mockUsers = {
  admin: {
    userId: 1,
    name: 'System Administrator',
    email: 'admin@university.edu',
    role: 'admin',
    avatar: 'A',
    department: 'IT Department',
    createdAt: '2024-01-01'
  },
  professor: {
    userId: 2,
    name: 'Professor John Smith',
    email: 'prof@university.edu',
    role: 'professor',
    avatar: 'P',
    department: 'Computer Science',
    createdAt: '2024-01-15'
  },
  staff: {
    userId: 3,
    name: 'Staff Member',
    email: 'staff@university.edu',
    role: 'staff',
    avatar: 'S',
    department: 'Administration',
    createdAt: '2024-02-01'
  }
}

function App() {
  const [currentUser, setCurrentUser] = useState(mockUsers.admin)

  const handleUserChange = (role) => {
    setCurrentUser(mockUsers[role])
  }

  const handleLogout = () => {
    // Just for consistency with the Layout component
    console.log('Logout placeholder');
  }

  return (
    <Router>
      <div className="App">
        {/* User selector for testing different roles */}
        <div className="user-selector">
          <label htmlFor="user-role">User Role: </label>
          <select 
            id="user-role" 
            value={currentUser.role} 
            onChange={(e) => handleUserChange(e.target.value)}
            style={{ margin: '10px', padding: '5px' }}
          >
            <option value="admin">Administrator</option>
            <option value="professor">Professor</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        <Layout user={currentUser} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/assets/:id" element={<AssetDetails />} />
            <Route path="/assets/edit/:id" element={<EditAsset />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/add-asset" element={<AddAsset />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  )
}

export default App
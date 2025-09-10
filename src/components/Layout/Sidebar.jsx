// src/components/Layout/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'assets', label: 'Assets', icon: '💻', path: '/assets' },
    { id: 'assignments', label: 'Assignments', icon: '👥', path: '/assignments' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧', path: '/maintenance' },
    { id: 'add-asset', label: 'Add Asset', icon: '➕', path: '/add-asset' },
    { id: 'reports', label: 'Reports', icon: '📈', path: '/reports' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>🏫 University</h2>
        <p>Asset Management</p>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map(item => (
            <li key={item.id}>
              <Link 
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <p>v1.0.0</p>
      </div>
    </aside>
  )
}

export default Sidebar
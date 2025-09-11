// src/components/Layout/Header.jsx
import { useState, useRef, useEffect } from 'react'
import './Header.css'

const Header = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🏫</span>
            <h1>University Asset Manager</h1>
          </div>
        </div>
        
        <div className="header-right">
          <div className="header-actions">
            <button className="header-action-btn" title="Notifications">
              <span className="icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>
            
            <button className="header-action-btn" title="Help">
              <span className="icon">❓</span>
            </button>
          </div>
          
          <div 
            className={`user-profile ${showDropdown ? 'active' : ''}`}
            ref={dropdownRef}
          >
            <div 
              className="profile-trigger"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img 
                src={user.avatar || '/default-avatar.png'} 
                alt={user.name} 
                className="avatar" 
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNlMWUxZTEiLz4KPHBhdGggZD0iTTIwIDIxQzIzLjMxMzcgMjEgMjYgMTguMzEzNyAyNiAxNUMyNiAxMS42ODYzIDIzLjMxMzcgOSAyMCA5QzE2LjY4NjMgOSAxNCAxMS42ODYzIDE0IDE1QzE0IDE4LjMxMzcgMTYuNjg2MyAyMSAyMCAyMVoiIGZpbGw9IiNhNGE0YTQiLz4KPHBhdGggZD0iTTI2Ljg2ODIgMjcuODUwMkMyNS41MjI1IDI2LjQ4MjYgMjMuNzc2NCAyNS42MDg2IDIxLjg5ODcgMjUuNDE0MkMyMC4xNzYzIDI1LjIzMTIgMTkuODIzNyAyNS4yMzEyIDE4LjEwMTMgMjUuNDE0MkMxNi4yMjM2IDI1LjYwODYgMTQuNDc3NSAyNi40ODI2IDEzLjEzMTggMjcuODUwMkMxMS43ODYxIDI5LjIxNzggMTEgMzEuMDAyNiAxMSAzMi44NzVDMTEgMzQuMDQxOSAxMS44NTk0IDM1IDEyLjkyMjkgMzVIMjcuMDc3MUMyOC4xNDA2IDM1IDI5IDM0LjA0MTkgMjkgMzIuODc1QzI5IDMxLjAwMjYgMjguMjEzOSAyOS4yMTc4IDI2Ljg2ODIgMjcuODUwMloiIGZpbGw9IiNhNGE0YTQiLz4KPC9zdmc+';
                }}
              />
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
              <span className="dropdown-arrow">▼</span>
            </div>
            
            {showDropdown && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <img 
                    src={user.avatar || '/default-avatar.png'} 
                    alt={user.name} 
                    className="dropdown-avatar"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNlMWUxZTEiLz4KPHBhdGggZD0iTTIwIDIxQzIzLjMxMzcgMjEgMjYgMTguMzEzNyAyNiAxNUMyNiAxMS42ODYzIDIzLjMxMzcgOSAyMCA5QzE2LjY4NjMgOSAxNCAxMS42ODYzIDE0IDE1QzE0IDE4LjMxMzcgMTYuNjg2MyAyMSAyMCAyMVoiIGZpbGw9IiNhNGE0YTQiLz4KPHBhdGggZD0iTTI2Ljg2ODIgMjcuODUwMkMyNS41MjI1IDI2LjQ4MjYgMjMuNzc2NCAyNS42MDg2IDIxLjg5ODcgMjUuNDE0MkMyMC4xNzYzIDI1LjIzMTIgMTkuODIzNyAyNS4yMzEyIDE4LjEwMTMgMjUuNDE0MkMxNi4yMjM2IDI1LjYwODYgMTQuNDc3NSAyNi40ODI2IDEzLjEzMTggMjcuODUwMkMxMS43ODYxIDI5LjIxNzggMTEgMzEuMDAyNiAxMSAzMi44NzVDMTEgMzQuMDQxOSAxMS44NTk0IDM1IDEyLjkyMjkgMzVIMjcuMDc3MUMyOC4xNDA2IDM1IDI5IDM0LjA0MTkgMjkgMzIuODc1QzI5IDMxLjAwMjYgMjguMjEzOSAyOS4yMTc4IDI2Ljg2ODIgMjcuODUwMloiIGZpbGw9IiNhNGE0YTQiLz4KPC9zdmc+';
                    }}
                  />
                  <div className="dropdown-user-info">
                    <span className="dropdown-user-name">{user.name}</span>
                    <span className="dropdown-user-role">{user.role}</span>
                    <span className="dropdown-user-email">{user.email || 'user@university.edu'}</span>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <div className="dropdown-items">
                  <button className="dropdown-item">
                    <span className="item-icon">👤</span>
                    My Profile
                  </button>
                  
                  <button className="dropdown-item">
                    <span className="item-icon">⚙️</span>
                    Settings
                  </button>
                  
                  <button className="dropdown-item">
                    <span className="item-icon">🌙</span>
                    Dark Mode
                  </button>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <div className="dropdown-items">
                  <button className="dropdown-item" onClick={onLogout}>
                    <span className="item-icon">🚪</span>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
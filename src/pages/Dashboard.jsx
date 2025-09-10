// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { assetService } from '../services/assetService';
import { assignmentService } from '../services/assignmentService';
import { maintenanceService } from '../services/maintenanceService';
import { authService } from '../services/authService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalAssignments: 0,
    activeMaintenance: 0,
    availableAssets: 0
  });
  const [recentAssets, setRecentAssets] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current user role for conditional rendering
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUserRole(currentUser.role);
        }
        
        // Fetch all data in parallel
        const [assetsRes, assignmentsRes, maintenanceRes] = await Promise.allSettled([
          assetService.getAllAssets(),
          assignmentService.getAllAssignments(),
          maintenanceService.getAllMaintenance()
        ]);
        
        // Handle assets data
        if (assetsRes.status === 'fulfilled' && assetsRes.value && assetsRes.value.data) {
          const assets = assetsRes.value.data;
          setStats(prev => ({
            ...prev,
            totalAssets: assets.length,
            availableAssets: assets.filter(asset => asset.status === 'Available').length
          }));
          
          // Get recent assets (last 5)
          setRecentAssets(assets.slice(-5).reverse());
        } else if (assetsRes.status === 'rejected') {
          console.warn('Failed to fetch assets:', assetsRes.reason);
        }
        
        // Handle assignments data
        if (assignmentsRes.status === 'fulfilled' && assignmentsRes.value && assignmentsRes.value.data) {
          const assignments = assignmentsRes.value.data;
          setStats(prev => ({
            ...prev,
            totalAssignments: assignments.length
          }));
          
          // Get recent assignments (last 5)
          setRecentAssignments(assignments.slice(-5).reverse());
        } else if (assignmentsRes.status === 'rejected') {
          console.warn('Failed to fetch assignments:', assignmentsRes.reason);
        }
        
        // Handle maintenance data
        if (maintenanceRes.status === 'fulfilled' && maintenanceRes.value && maintenanceRes.value.data) {
          const maintenance = maintenanceRes.value.data;
          setStats(prev => ({
            ...prev,
            activeMaintenance: maintenance.filter(m => m.status === 'In Progress').length
          }));
        } else if (maintenanceRes.status === 'rejected') {
          console.warn('Failed to fetch maintenance records:', maintenanceRes.reason);
        }
        
        // Check if all requests failed
        const allFailed = assetsRes.status === 'rejected' && 
                         assignmentsRes.status === 'rejected' && 
                         maintenanceRes.status === 'rejected';
        
        if (allFailed) {
          setError('Unable to connect to the server. Please check your connection and try again.');
        }
        
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-error">
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={handleRetry} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: '#e3f2fd'}}>
            📦
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Total Assets</h3>
            <p className="stat-value">{stats.totalAssets}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: '#e8f5e9'}}>
            👥
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Active Assignments</h3>
            <p className="stat-value">{stats.totalAssignments}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: '#fff3e0'}}>
            🔧
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Active Maintenance</h3>
            <p className="stat-value">{stats.activeMaintenance}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: '#f3e5f5'}}>
            ✅
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Available Assets</h3>
            <p className="stat-value">{stats.availableAssets}</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content-grid">
        {/* Recent Assets */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 className="dashboard-card-title">Recently Added Assets</h2>
            <span className="badge">{recentAssets.length}</span>
          </div>
          {recentAssets.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssets.map(asset => (
                    <tr key={asset.id} className="table-row">
                      <td>
                        <div className="asset-info">
                          <span className="asset-name">{asset.name || 'Unnamed Asset'}</span>
                          <span className="asset-tag">{asset.tag || 'No tag'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">{asset.category || 'N/A'}</span>
                      </td>
                      <td>
                        <span className={`status-badge status-${asset.status ? asset.status.toLowerCase() : 'unknown'}`}>
                          {asset.status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p className="empty-text">No assets found</p>
              <p className="empty-subtext">Assets will appear here once added to the system</p>
            </div>
          )}
        </div>
        
        {/* Recent Assignments */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 className="dashboard-card-title">Recent Assignments</h2>
            <span className="badge">{recentAssignments.length}</span>
          </div>
          {recentAssignments.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Assigned To</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssignments.map(assignment => (
                    <tr key={assignment.id} className="table-row">
                      <td>
                        <div className="asset-info">
                          <span className="asset-name">{assignment.assetName || 'Unknown Asset'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="user-badge">{assignment.assignedTo || 'Unknown User'}</span>
                      </td>
                      <td>
                        <span className="date-text">
                          {assignment.assignedDate 
                            ? new Date(assignment.assignedDate).toLocaleDateString() 
                            : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p className="empty-text">No assignments found</p>
              <p className="empty-subtext">Assignments will appear here once created</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Admin-only section */}
      {userRole === 'admin' && (
        <div className="dashboard-card admin-actions">
          <h2 className="dashboard-card-title">Admin Quick Actions</h2>
          <div className="action-buttons">
            <button className="btn btn-primary">
              <span className="btn-icon">📊</span>
              Generate Report
            </button>
            <button className="btn btn-success">
              <span className="btn-icon">➕</span>
              Add New Asset
            </button>
            <button className="btn btn-secondary">
              <span className="btn-icon">👥</span>
              Manage Users
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
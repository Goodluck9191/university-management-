// src/pages/Assignments.jsx
import { useState, useEffect } from 'react';
import { assignmentService } from '../services/assignmentService';
import { assetService } from '../services/assetService';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assetId: '',
    assignedTo: '',
    assignedDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    fetchAssignments();
    fetchAvailableAssets();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await assignmentService.getAllAssignments();
      setAssignments(response.data || []);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
      setError('Failed to load assignments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableAssets = async () => {
    try {
      const response = await assetService.getAllAssets();
      const availableAssets = response.data.filter(asset => asset.status === 'Available');
      setAssets(availableAssets);
    } catch (err) {
      console.error('Failed to fetch assets:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedAsset = assets.find(asset => asset.id === parseInt(formData.assetId));
      const assignmentData = {
        ...formData,
        assetName: selectedAsset?.name || 'Unknown Asset'
      };

      await assignmentService.createAssignment(assignmentData);
      
      // Update asset status to "Assigned"
      await assetService.updateAsset(formData.assetId, {
        ...selectedAsset,
        status: 'Assigned',
        assignedTo: formData.assignedTo
      });

      setShowForm(false);
      setFormData({
        assetId: '',
        assignedTo: '',
        assignedDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
      
      fetchAssignments();
      fetchAvailableAssets();
    } catch (err) {
      console.error('Failed to create assignment:', err);
      setError('Failed to create assignment. Please try again.');
    }
  };

  const handleReturnAsset = async (assignmentId, assetId) => {
    try {
      // Update assignment with return date
      const assignment = assignments.find(a => a.id === assignmentId);
      await assignmentService.updateAssignment(assignmentId, {
        ...assignment,
        returnDate: new Date().toISOString().split('T')[0]
      });

      // Update asset status back to "Available"
      const asset = assets.find(a => a.id === assetId) || await assetService.getAssetById(assetId);
      await assetService.updateAsset(assetId, {
        ...asset,
        status: 'Available',
        assignedTo: 'Unassigned'
      });

      fetchAssignments();
      fetchAvailableAssets();
    } catch (err) {
      console.error('Failed to return asset:', err);
      setError('Failed to return asset. Please try again.');
    }
  };

  const getAssignmentStatus = (assignment) => {
    return assignment.returnDate ? 'Returned' : 'Active';
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Asset Assignments</h1>
        </div>
        <div className="loading">Loading assignments...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Asset Assignments</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={assets.length === 0}
        >
          {showForm ? 'Cancel' : '➕ Assign Asset'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠</span>
          {error}
        </div>
      )}

      {assets.length === 0 && !showForm && (
        <div className="alert alert-info">
          <span className="alert-icon">ℹ</span>
          No available assets to assign. All assets are currently assigned or in maintenance.
        </div>
      )}

      {/* Assignment Form */}
      {showForm && (
        <div className="form-container">
          <h3>Assign Asset to User</h3>
          <form onSubmit={handleSubmit} className="assignment-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="assetId">Asset *</label>
                <select
                  id="assetId"
                  name="assetId"
                  value={formData.assetId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Asset</option>
                  {assets.map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} ({asset.tag})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="assignedTo">Assign To *</label>
                <input
                  type="text"
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter user name or department"
                />
              </div>

              <div className="form-group">
                <label htmlFor="assignedDate">Assignment Date *</label>
                <input
                  type="date"
                  id="assignedDate"
                  name="assignedDate"
                  value={formData.assignedDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Purpose of assignment, duration, etc."
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Assign Asset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignments Table */}
      <div className="table-card">
        <h3>Current and Historical Assignments</h3>
        {assignments.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Assigned To</th>
                  <th>Assignment Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(assignment => (
                  <tr key={assignment.id}>
                    <td>{assignment.assetName}</td>
                    <td>{assignment.assignedTo}</td>
                    <td>{assignment.assignedDate ? new Date(assignment.assignedDate).toLocaleDateString() : 'N/A'}</td>
                    <td>{assignment.returnDate ? new Date(assignment.returnDate).toLocaleDateString() : 'Not returned'}</td>
                    <td>
                      <span className={`status-badge status-${getAssignmentStatus(assignment).toLowerCase()}`}>
                        {getAssignmentStatus(assignment)}
                      </span>
                    </td>
                    <td>{assignment.notes || 'No notes'}</td>
                    <td>
                      {!assignment.returnDate && (
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleReturnAsset(assignment.id, assignment.assetId)}
                        >
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p className="empty-text">No assignments found</p>
            <p className="empty-subtext">Assign assets to users to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;
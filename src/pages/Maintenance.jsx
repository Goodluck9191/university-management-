// src/pages/Maintenance.jsx
import { useState, useEffect } from 'react';
import { maintenanceService } from '../services/maintenanceService';
import { assetService } from '../services/assetService';

const Maintenance = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assetId: '',
    type: '',
    date: new Date().toISOString().split('T')[0],
    technician: '',
    notes: '',
    status: 'Scheduled'
  });

  useEffect(() => {
    fetchMaintenanceData();
    fetchAssets();
  }, []);

  const fetchMaintenanceData = async () => {
    try {
      setLoading(true);
      const response = await maintenanceService.getAllMaintenance();
      setMaintenanceRecords(response.data || []);
    } catch (err) {
      console.error('Failed to fetch maintenance records:', err);
      setError('Failed to load maintenance records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssets = async () => {
    try {
      const response = await assetService.getAllAssets();
      setAssets(response.data || []);
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
      await maintenanceService.createMaintenance(formData);
      setShowForm(false);
      setFormData({
        assetId: '',
        type: '',
        date: new Date().toISOString().split('T')[0],
        technician: '',
        notes: '',
        status: 'Scheduled'
      });
      fetchMaintenanceData();
    } catch (err) {
      console.error('Failed to create maintenance record:', err);
      setError('Failed to create maintenance record. Please try again.');
    }
  };

  const getAssetName = (assetId) => {
    const asset = assets.find(a => a.id === parseInt(assetId));
    return asset ? asset.name : 'Unknown Asset';
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'in progress': return 'status-in-progress';
      case 'scheduled': return 'status-scheduled';
      default: return 'status-unknown';
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Maintenance Management</h1>
        </div>
        <div className="loading">Loading maintenance records...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Maintenance Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '➕ Schedule Maintenance'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠</span>
          {error}
        </div>
      )}

      {/* Maintenance Form */}
      {showForm && (
        <div className="form-container">
          <h3>Schedule New Maintenance</h3>
          <form onSubmit={handleSubmit} className="maintenance-form">
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
                <label htmlFor="type">Maintenance Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Routine Check">Routine Check</option>
                  <option value="Repair">Repair</option>
                  <option value="Software Update">Software Update</option>
                  <option value="Hardware Replacement">Hardware Replacement</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Calibration">Calibration</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="technician">Technician *</label>
                <input
                  type="text"
                  id="technician"
                  name="technician"
                  value={formData.technician}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter technician name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Additional notes about the maintenance..."
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Schedule Maintenance
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Maintenance Records Table */}
      <div className="table-card">
        <h3>Maintenance Records</h3>
        {maintenanceRecords.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Technician</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceRecords.map(record => (
                  <tr key={record.id}>
                    <td>{getAssetName(record.assetId)}</td>
                    <td>{record.type}</td>
                    <td>{record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}</td>
                    <td>{record.technician}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>{record.notes || 'No notes'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔧</div>
            <p className="empty-text">No maintenance records found</p>
            <p className="empty-subtext">Schedule maintenance to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Maintenance;
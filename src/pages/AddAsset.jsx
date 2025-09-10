// src/pages/AddAsset.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assetService } from '../services/assetService';
import './AddAsset.css'

const AddAsset = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    category: '',
    status: 'Available',
    location: '',
    assignedTo: '',
    purchaseDate: '',
    value: '',
    description: '',
    serialNumber: '',
    warranty: '',
    supplier: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Basic validation
      if (!formData.name.trim() || !formData.tag.trim() || !formData.category.trim()) {
        throw new Error('Name, Tag, and Category are required fields');
      }

      // Prepare data for API
      const assetData = {
        ...formData,
        // Convert empty strings to null for optional fields
        assignedTo: formData.assignedTo || 'Unassigned',
        location: formData.location || null,
        value: formData.value || null,
        description: formData.description || null,
        serialNumber: formData.serialNumber || null,
        supplier: formData.supplier || null,
        // Convert date strings to proper format
        purchaseDate: formData.purchaseDate || null,
        warranty: formData.warranty || null
      };

      console.log('Submitting asset data:', assetData);

      const response = await assetService.createAsset(assetData);
      
      if (response && response.data) {
        setSuccess('Asset created successfully!');
        setTimeout(() => {
          navigate('/assets');
        }, 1500);
      } else {
        throw new Error('Failed to create asset');
      }
    } catch (err) {
      console.error('Error creating asset:', err);
      setError(err.message || 'Failed to create asset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      name: '',
      tag: '',
      category: '',
      status: 'Available',
      location: '',
      assignedTo: '',
      purchaseDate: '',
      value: '',
      description: '',
      serialNumber: '',
      warranty: '',
      supplier: ''
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Add New Asset</h2>
        <p>Fill in the details below to add a new asset to the system</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✓</span>
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠</span>
          {error}
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit} className="asset-form">
          <div className="form-grid">
            {/* Basic Information */}
            <div className="form-section">
              <h3>Basic Information</h3>
              
              <div className="form-group">
                <label htmlFor="name">Asset Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Dell Latitude Laptop"
                />
              </div>

              <div className="form-group">
                <label htmlFor="tag">Asset Tag *</label>
                <input
                  type="text"
                  id="tag"
                  name="tag"
                  value={formData.tag}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., IT-001"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="IT Equipment">IT Equipment</option>
                  <option value="Audio Visual">Audio Visual</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Other">Other</option>
                </select>
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
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
            </div>

            {/* Location & Assignment */}
            <div className="form-section">
              <h3>Location & Assignment</h3>
              
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Lab A"
                />
              </div>

              <div className="form-group">
                <label htmlFor="assignedTo">Assigned To</label>
                <input
                  type="text"
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  placeholder="e.g., John Smith"
                />
              </div>

              <div className="form-group">
                <label htmlFor="purchaseDate">Purchase Date</label>
                <input
                  type="date"
                  id="purchaseDate"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="value">Value</label>
                <input
                  type="text"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  placeholder="e.g., $1,200.00"
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="form-section">
              <h3>Additional Details</h3>
              
              <div className="form-group">
                <label htmlFor="serialNumber">Serial Number</label>
                <input
                  type="text"
                  id="serialNumber"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., DL5420-12345"
                />
              </div>

              <div className="form-group">
                <label htmlFor="warranty">Warranty Until</label>
                <input
                  type="date"
                  id="warranty"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="supplier">Supplier</label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  placeholder="e.g., Dell Technologies"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe the asset, including specifications, condition, and any other relevant details..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/assets')}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline"
              disabled={loading}
            >
              Reset
            </button>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner-small"></span>
                  Creating...
                </>
              ) : (
                'Create Asset'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAsset;
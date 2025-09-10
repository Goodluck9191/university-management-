// src/pages/EditAsset.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { assetService } from '../services/assetService'

const EditAsset = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [asset, setAsset] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setLoading(true)
        setError('')
        
        if (!id || isNaN(parseInt(id, 10))) {
          throw new Error('Invalid asset ID')
        }
        
        const response = await assetService.getAssetById(id)
        
        if (response && response.data) {
          setAsset(response.data)
        } else {
          throw new Error('Asset not found')
        }
      } catch (err) {
        console.error('Failed to fetch asset:', err)
        setError(err.message || 'Failed to load asset data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchAsset()
  }, [id])

  const handleSubmit = async (assetData) => {
    try {
      setSubmitting(true)
      setError('')
      setSuccess('')
      
      const response = await assetService.updateAsset(id, assetData)
      
      if (response && response.data) {
        setSuccess('Asset updated successfully!')
        setTimeout(() => {
          navigate(`/assets/${id}`)
        }, 1500)
      } else {
        throw new Error('Failed to update asset')
      }
    } catch (err) {
      console.error('Failed to update asset:', err)
      setError(err.message || 'Failed to update asset. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setAsset(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <Link to={`/assets/${id}`} className="back-link">← Back to Asset Details</Link>
          <h2>Edit Asset</h2>
        </div>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading asset data...</p>
        </div>
      </div>
    )
  }

  if (error && !asset) {
    return (
      <div className="page">
        <div className="page-header">
          <Link to="/assets" className="back-link">← Back to Assets</Link>
          <h2>Edit Asset</h2>
        </div>
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <div className="error-actions">
            <Link to="/assets" className="btn btn-primary">
              Back to Assets
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="page">
        <div className="page-header">
          <Link to="/assets" className="back-link">← Back to Assets</Link>
          <h2>Edit Asset</h2>
        </div>
        <div className="error-message">
          <h3>Asset Not Found</h3>
          <p>The requested asset could not be found.</p>
          <Link to="/assets" className="btn btn-primary">
            Back to Assets
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <Link to={`/assets/${id}`} className="back-link">← Back to Asset Details</Link>
        <h2>Edit Asset</h2>
        <p>Update asset information for {asset.name || 'Unknown Asset'}</p>
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
        <form onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(asset)
        }} className="asset-form">
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
                  value={asset.name || ''}
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
                  value={asset.tag || ''}
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
                  value={asset.category || ''}
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
                  value={asset.status || 'Available'}
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
                  value={asset.location || ''}
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
                  value={asset.assignedTo || ''}
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
                  value={asset.purchaseDate ? asset.purchaseDate.split('T')[0] : ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="value">Value</label>
                <input
                  type="text"
                  id="value"
                  name="value"
                  value={asset.value || ''}
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
                  value={asset.serialNumber || ''}
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
                  value={asset.warranty ? asset.warranty.split('T')[0] : ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="supplier">Supplier</label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={asset.supplier || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., Dell Technologies"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={asset.description || ''}
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
              onClick={() => navigate(`/assets/${id}`)}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="loading-spinner-small"></span>
                  Updating...
                </>
              ) : (
                'Update Asset'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditAsset
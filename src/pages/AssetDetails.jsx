// src/pages/AssetDetails.jsx
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { assetService } from '../services/assetService'
import { maintenanceService } from '../services/maintenanceService'
import './AssetDetails.css'

const AssetDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [asset, setAsset] = useState(null)
  const [maintenanceHistory, setMaintenanceHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Validate ID
        if (!id || isNaN(parseInt(id, 10))) {
          throw new Error('Invalid asset ID')
        }
        
        console.log('Fetching asset with ID:', id)
        
        // Fetch asset details
        const assetResponse = await assetService.getAssetById(id)
        console.log('Asset API response:', assetResponse)
        
        if (assetResponse && assetResponse.data) {
          setAsset(assetResponse.data)
        } else {
          throw new Error('Invalid response format from server')
        }
        
        // Fetch maintenance history for this asset
        try {
          const maintenanceResponse = await maintenanceService.getAllMaintenance()
          console.log('Maintenance API response:', maintenanceResponse)
          
          if (maintenanceResponse && maintenanceResponse.data) {
            // Filter maintenance records for this asset
            const assetMaintenance = maintenanceResponse.data.filter(
              record => record.assetId === parseInt(id)
            )
            setMaintenanceHistory(assetMaintenance)
          }
        } catch (maintenanceError) {
          console.warn('Failed to fetch maintenance history:', maintenanceError)
          setMaintenanceHistory([])
        }
      } catch (err) {
        console.error('Failed to fetch asset details:', err)
        setError(`Failed to load asset details: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchAssetData()
    } else {
      setError('No asset ID provided')
      setLoading(false)
    }
  }, [id])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        setError(null)
        const response = await assetService.deleteAsset(id)
        console.log('Delete response:', response)
        
        navigate('/assets', { 
          state: { message: 'Asset deleted successfully' } 
        })
      } catch (err) {
        console.error('Failed to delete asset:', err)
        setError(`Failed to delete asset: ${err.message}`)
      }
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading asset details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Try Again
            </button>
            <Link to="/assets" className="btn btn-secondary">
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
        <Link to="/assets" className="back-link">← Back to Assets</Link>
        <h2>{asset.name || 'Unnamed Asset'}</h2>
        <p>Asset Tag: {asset.tag || 'N/A'}</p>
      </div>
      
      <div className="asset-details-container">
        <div className="asset-details-card">
          <h3>Basic Information</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Category:</span>
              <span className="detail-value">{asset.category || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className={`status status-${asset.status ? asset.status.toLowerCase() : 'unknown'}`}>
                {asset.status ? (
                  asset.status.charAt(0).toUpperCase() + asset.status.slice(1)
                ) : 'Unknown'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{asset.location || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Assigned To:</span>
              <span className="detail-value">{asset.assignedTo || 'Unassigned'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Purchase Date:</span>
              <span className="detail-value">
                {asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Value:</span>
              <span className="detail-value">{asset.value || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Serial Number:</span>
              <span className="detail-value">{asset.serialNumber || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Warranty Until:</span>
              <span className="detail-value">
                {asset.warranty ? new Date(asset.warranty).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="detail-item full-width">
              <span className="detail-label">Supplier:</span>
              <span className="detail-value">{asset.supplier || 'N/A'}</span>
            </div>
            <div className="detail-item full-width">
              <span className="detail-label">Description:</span>
              <span className="detail-value">{asset.description || 'No description available'}</span>
            </div>
          </div>
        </div>
        
        <div className="maintenance-history">
          <h3>Maintenance History</h3>
          {maintenanceHistory.length > 0 ? (
            <div className="history-list">
              {maintenanceHistory.map((record, index) => (
                <div key={index} className="history-item">
                  <div className="history-date">
                    {record.date ? new Date(record.date).toLocaleDateString() : 'Unknown date'}
                  </div>
                  <div className="history-type">{record.type || 'Maintenance'}</div>
                  <div className="history-technician">
                    By: {record.technician || 'Unknown technician'}
                  </div>
                  {record.notes && (
                    <div className="history-notes">{record.notes}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No maintenance records found.</p>
          )}
        </div>
      </div>
      
      <div className="asset-actions">
        <Link to={`/assets/edit/${asset.id}`} className="btn btn-primary">
          Edit Asset
        </Link>
        <button className="btn btn-secondary">Request Maintenance</button>
        <button className="btn btn-secondary">Print Details</button>
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete Asset
        </button>
      </div>
    </div>
  )
}

export default AssetDetails
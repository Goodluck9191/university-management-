// src/pages/Reports.jsx
import { useState } from 'react';
import { assetService } from '../services/assetService';
import { assignmentService } from '../services/assignmentService';
import { maintenanceService } from '../services/maintenanceService';
import './Reports.css'

const Reports = () => {
  const [generatingReports, setGeneratingReports] = useState({});
  const [reportData, setReportData] = useState(null);
  const [activeReport, setActiveReport] = useState(null);
  
  const reports = [
    { 
      id: 1, 
      title: 'Asset Inventory Report', 
      description: 'Complete list of all assets with details', 
      icon: '📋',
      generate: generateAssetInventoryReport
    },
    { 
      id: 2, 
      title: 'Maintenance Schedule', 
      description: 'Upcoming and past maintenance activities', 
      icon: '🔧',
      generate: generateMaintenanceReport
    },
    { 
      id: 3, 
      title: 'Asset Value Report', 
      description: 'Financial summary and valuation of assets', 
      icon: '💰',
      generate: generateAssetValueReport
    },
    { 
      id: 4, 
      title: 'Assignment History', 
      description: 'Complete history of asset assignments', 
      icon: '📊',
      generate: generateAssignmentReport
    },
    { 
      id: 5, 
      title: 'Depreciation Report', 
      description: 'Asset depreciation calculations over time', 
      icon: '📉',
      generate: generateDepreciationReport
    },
    { 
      id: 6, 
      title: 'Audit Trail', 
      description: 'All changes to asset records with timestamps', 
      icon: '👁️',
      generate: generateAuditTrailReport
    },
  ];

  // Report generation functions
  async function generateAssetInventoryReport() {
    try {
      const response = await assetService.getAllAssets();
      const assets = response.data || [];
      
      return {
        title: 'Asset Inventory Report',
        generatedAt: new Date().toLocaleString(),
        data: assets,
        columns: [
          { header: 'Asset Name', key: 'name' },
          { header: 'Tag ID', key: 'tag' },
          { header: 'Category', key: 'category' },
          { header: 'Status', key: 'status' },
          { header: 'Location', key: 'location' },
          { header: 'Purchase Date', key: 'purchaseDate' },
          { header: 'Value', key: 'value', format: 'currency' }
        ],
        summary: {
          totalAssets: assets.length,
          available: assets.filter(a => a.status === 'Available').length,
          assigned: assets.filter(a => a.status === 'Assigned').length,
          maintenance: assets.filter(a => a.status === 'Maintenance').length
        }
      };
    } catch (error) {
      console.error('Error generating asset inventory report:', error);
      throw new Error('Failed to generate asset inventory report');
    }
  }

  async function generateMaintenanceReport() {
    try {
      const [maintenanceRes, assetsRes] = await Promise.all([
        maintenanceService.getAllMaintenance(),
        assetService.getAllAssets()
      ]);
      
      const maintenanceRecords = maintenanceRes.data || [];
      const assets = assetsRes.data || [];
      
      // Enrich maintenance data with asset names
      const enrichedData = maintenanceRecords.map(record => {
        const asset = assets.find(a => a.id === record.assetId);
        return {
          ...record,
          assetName: asset ? asset.name : 'Unknown Asset'
        };
      });
      
      return {
        title: 'Maintenance Report',
        generatedAt: new Date().toLocaleString(),
        data: enrichedData,
        columns: [
          { header: 'Asset', key: 'assetName' },
          { header: 'Maintenance Type', key: 'type' },
          { header: 'Scheduled Date', key: 'date', format: 'date' },
          { header: 'Technician', key: 'technician' },
          { header: 'Status', key: 'status' },
          { header: 'Cost', key: 'cost', format: 'currency' },
          { header: 'Notes', key: 'notes' }
        ],
        summary: {
          totalRecords: maintenanceRecords.length,
          scheduled: maintenanceRecords.filter(m => m.status === 'Scheduled').length,
          inProgress: maintenanceRecords.filter(m => m.status === 'In Progress').length,
          completed: maintenanceRecords.filter(m => m.status === 'Completed').length
        }
      };
    } catch (error) {
      console.error('Error generating maintenance report:', error);
      throw new Error('Failed to generate maintenance report');
    }
  }

  async function generateAssetValueReport() {
    try {
      const response = await assetService.getAllAssets();
      const assets = response.data || [];
      
      // Calculate total value by category
      const valueByCategory = assets.reduce((acc, asset) => {
        const category = asset.category || 'Uncategorized';
        const value = parseFloat(asset.value) || 0;
        acc[category] = (acc[category] || 0) + value;
        return acc;
      }, {});
      
      return {
        title: 'Asset Value Report',
        generatedAt: new Date().toLocaleString(),
        data: assets.filter(a => a.value), // Only assets with values
        columns: [
          { header: 'Asset Name', key: 'name' },
          { header: 'Category', key: 'category' },
          { header: 'Purchase Date', key: 'purchaseDate', format: 'date' },
          { header: 'Purchase Value', key: 'value', format: 'currency' },
          { header: 'Current Value', key: 'currentValue', format: 'currency' },
          { header: 'Depreciation', key: 'depreciation', format: 'currency' }
        ],
        summary: {
          totalValue: assets.reduce((sum, asset) => sum + (parseFloat(asset.value) || 0), 0),
          valueByCategory,
          averageValue: assets.length ? assets.reduce((sum, asset) => sum + (parseFloat(asset.value) || 0), 0) / assets.length : 0
        }
      };
    } catch (error) {
      console.error('Error generating asset value report:', error);
      throw new Error('Failed to generate asset value report');
    }
  }

  async function generateAssignmentReport() {
    try {
      const [assignmentsRes, assetsRes] = await Promise.all([
        assignmentService.getAllAssignments(),
        assetService.getAllAssets()
      ]);
      
      const assignments = assignmentsRes.data || [];
      const assets = assetsRes.data || [];
      
      // Enrich assignment data with asset details
      const enrichedData = assignments.map(assignment => {
        const asset = assets.find(a => a.id === assignment.assetId);
        return {
          ...assignment,
          assetName: asset ? asset.name : 'Unknown Asset',
          assetCategory: asset ? asset.category : 'Unknown'
        };
      });
      
      return {
        title: 'Assignment History Report',
        generatedAt: new Date().toLocaleString(),
        data: enrichedData,
        columns: [
          { header: 'Asset', key: 'assetName' },
          { header: 'Category', key: 'assetCategory' },
          { header: 'Assigned To', key: 'assignedTo' },
          { header: 'Assignment Date', key: 'assignedDate', format: 'date' },
          { header: 'Return Date', key: 'returnDate', format: 'date' },
          { header: 'Status', key: 'status' },
          { header: 'Notes', key: 'notes' }
        ],
        summary: {
          totalAssignments: assignments.length,
          active: assignments.filter(a => !a.returnDate).length,
          completed: assignments.filter(a => a.returnDate).length
        }
      };
    } catch (error) {
      console.error('Error generating assignment report:', error);
      throw new Error('Failed to generate assignment report');
    }
  }

  async function generateDepreciationReport() {
    try {
      const response = await assetService.getAllAssets();
      const assets = response.data || [];
      
      // Calculate depreciation (simple straight-line method for demonstration)
      const currentYear = new Date().getFullYear();
      const dataWithDepreciation = assets.map(asset => {
        const purchaseYear = asset.purchaseDate ? new Date(asset.purchaseDate).getFullYear() : currentYear;
        const age = currentYear - purchaseYear;
        const usefulLife = 5; // Default 5 years
        const purchaseValue = parseFloat(asset.value) || 0;
        const annualDepreciation = purchaseValue / usefulLife;
        const accumulatedDepreciation = annualDepreciation * Math.min(age, usefulLife);
        const currentValue = Math.max(0, purchaseValue - accumulatedDepreciation);
        
        return {
          ...asset,
          age,
          annualDepreciation,
          accumulatedDepreciation,
          currentValue
        };
      });
      
      return {
        title: 'Depreciation Report',
        generatedAt: new Date().toLocaleString(),
        data: dataWithDepreciation,
        columns: [
          { header: 'Asset Name', key: 'name' },
          { header: 'Purchase Date', key: 'purchaseDate', format: 'date' },
          { header: 'Purchase Value', key: 'value', format: 'currency' },
          { header: 'Age (Years)', key: 'age' },
          { header: 'Annual Depreciation', key: 'annualDepreciation', format: 'currency' },
          { header: 'Accumulated Depreciation', key: 'accumulatedDepreciation', format: 'currency' },
          { header: 'Current Value', key: 'currentValue', format: 'currency' }
        ],
        summary: {
          totalPurchaseValue: assets.reduce((sum, asset) => sum + (parseFloat(asset.value) || 0), 0),
          totalCurrentValue: dataWithDepreciation.reduce((sum, asset) => sum + (asset.currentValue || 0), 0),
          totalDepreciation: assets.reduce((sum, asset) => sum + (parseFloat(asset.value) || 0), 0) - 
                            dataWithDepreciation.reduce((sum, asset) => sum + (asset.currentValue || 0), 0)
        }
      };
    } catch (error) {
      console.error('Error generating depreciation report:', error);
      throw new Error('Failed to generate depreciation report');
    }
  }

  async function generateAuditTrailReport() {
    try {
      // This would typically come from an audit service that tracks changes
      // For now, we'll simulate this data
      const response = await assetService.getAllAssets();
      const assets = response.data || [];
      
      // Simulate audit trail - in a real app, this would come from a proper audit log
      const auditTrail = assets.flatMap(asset => [
        {
          id: `create-${asset.id}`,
          action: 'CREATE',
          entity: 'Asset',
          entityId: asset.id,
          entityName: asset.name,
          timestamp: asset.createdAt || asset.purchaseDate || new Date().toISOString(),
          user: 'System',
          changes: 'Asset created'
        },
        {
          id: `update-${asset.id}`,
          action: 'UPDATE',
          entity: 'Asset',
          entityId: asset.id,
          entityName: asset.name,
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date in last 30 days
          user: 'Admin',
          changes: 'Asset details updated'
        }
      ]).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by timestamp descending
      
      return {
        title: 'Audit Trail Report',
        generatedAt: new Date().toLocaleString(),
        data: auditTrail,
        columns: [
          { header: 'Timestamp', key: 'timestamp', format: 'datetime' },
          { header: 'Action', key: 'action' },
          { header: 'Entity', key: 'entity' },
          { header: 'Entity Name', key: 'entityName' },
          { header: 'User', key: 'user' },
          { header: 'Changes', key: 'changes' }
        ],
        summary: {
          totalEntries: auditTrail.length,
          creations: auditTrail.filter(a => a.action === 'CREATE').length,
          updates: auditTrail.filter(a => a.action === 'UPDATE').length,
          deletions: auditTrail.filter(a => a.action === 'DELETE').length
        }
      };
    } catch (error) {
      console.error('Error generating audit trail report:', error);
      throw new Error('Failed to generate audit trail report');
    }
  }

  const handleGenerateReport = async (report) => {
    try {
      setGeneratingReports(prev => ({...prev, [report.id]: true}));
      setActiveReport(report.id);
      
      const data = await report.generate();
      setReportData(data);
      
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setGeneratingReports(prev => ({...prev, [report.id]: false}));
    }
  };

  const handleExportPDF = () => {
    alert('PDF export functionality would be implemented here. Typically using libraries like jsPDF or browser print functionality.');
    // In a real implementation, this would generate a PDF using jsPDF or similar
  };

  const handleExportCSV = () => {
    if (!reportData) return;
    
    // Create CSV content
    const headers = reportData.columns.map(col => col.header).join(',');
    const rows = reportData.data.map(item => 
      reportData.columns.map(col => {
        let value = item[col.key] || '';
        
        // Format values based on column format
        if (col.format === 'currency' && value) {
          value = `$${parseFloat(value).toFixed(2)}`;
        } else if ((col.format === 'date' || col.format === 'datetime') && value) {
          const date = new Date(value);
          value = col.format === 'datetime' 
            ? date.toLocaleString() 
            : date.toLocaleDateString();
        }
        
        // Escape commas and quotes for CSV
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportData.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatValue = (value, format) => {
    if (!value) return '-';
    
    switch (format) {
      case 'currency':
        return `$${parseFloat(value).toFixed(2)}`;
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'datetime':
        return new Date(value).toLocaleString();
      default:
        return value;
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Reports</h2>
        <p>Generate and view various asset management reports</p>
      </div>
      
      {reportData && (
        <div className="report-viewer">
          <div className="report-header">
            <h3>{reportData.title}</h3>
            <div className="report-actions">
              <button className="btn btn-secondary" onClick={handleExportPDF}>
                Export PDF
              </button>
              <button className="btn btn-secondary" onClick={handleExportCSV}>
                Export CSV
              </button>
              <button 
                className="btn btn-outline" 
                onClick={() => setReportData(null)}
              >
                Close Report
              </button>
            </div>
          </div>
          
          <div className="report-meta">
            <p>Generated on: {reportData.generatedAt}</p>
          </div>
          
          {reportData.summary && (
            <div className="report-summary">
              <h4>Summary</h4>
              <div className="summary-grid">
                {Object.entries(reportData.summary).map(([key, value]) => (
                  <div key={key} className="summary-item">
                    <span className="summary-label">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                    </span>
                    <span className="summary-value">
                      {typeof value === 'object' 
                        ? Object.entries(value).map(([k, v]) => (
                            <div key={k}>{k}: {formatValue(v, 'currency')}</div>
                          ))
                        : formatValue(value, 
                            key.toLowerCase().includes('value') ? 'currency' : undefined
                          )
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {reportData.columns.map(col => (
                    <th key={col.key}>{col.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.data.map((item, index) => (
                  <tr key={index}>
                    {reportData.columns.map(col => (
                      <td key={col.key}>
                        {formatValue(item[col.key], col.format)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {reportData.data.length === 0 && (
            <div className="empty-state">
              <p>No data available for this report</p>
            </div>
          )}
        </div>
      )}
      
      {!reportData && (
        <div className="reports-grid">
          {reports.map(report => (
            <div key={report.id} className="report-card">
              <div className="report-icon">{report.icon}</div>
              <h3>{report.title}</h3>
              <p>{report.description}</p>
              <button 
                className={`btn ${generatingReports[report.id] ? 'btn-generating' : 'btn-primary'}`}
                onClick={() => handleGenerateReport(report)}
                disabled={generatingReports[report.id]}
              >
                {generatingReports[report.id] ? (
                  <>
                    <span className="spinner"></span>
                    Generating...
                  </>
                ) : (
                  'Generate Report'
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
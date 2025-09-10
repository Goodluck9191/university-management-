// src/services/assetService.js
import api from './api';

// Utility function to handle API errors consistently
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error Response:', error.response.data);
    console.error('API Error Status:', error.response.status);
    
    let errorMessage = 'An error occurred';
    
    if (error.response.status === 404) {
      errorMessage = 'Resource not found';
    } else if (error.response.status === 400) {
      errorMessage = 'Invalid request data';
    } else if (error.response.status === 401) {
      errorMessage = 'Unauthorized access';
    } else if (error.response.status === 500) {
      errorMessage = 'Server error, please try again later';
    }
    
    throw new Error(errorMessage);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API Error Request:', error.request);
    throw new Error('No response received from server. Please check your connection.');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API Error Message:', error.message);
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

export const assetService = {
  getAllAssets: async () => {
    try {
      const response = await api.get('/assets');
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },

  getAssetById: async (id) => {
    try {
      // Ensure ID is a number
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error('Invalid asset ID');
      }
      
      const response = await api.get(`/assets/${numericId}`);
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },

  createAsset: async (assetData) => {
    try {
      const response = await api.post('/assets', assetData);
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateAsset: async (id, assetData) => {
    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error('Invalid asset ID');
      }
      
      const response = await api.put(`/assets/${numericId}`, assetData);
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteAsset: async (id) => {
    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error('Invalid asset ID');
      }
      
      const response = await api.delete(`/assets/${numericId}`);
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },

  searchAssets: async (query) => {
    try {
      const response = await api.get('/assets/search', { 
        params: { q: query } 
      });
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },

  getAssetsByStatus: async (status) => {
    try {
      const response = await api.get(`/assets/status/${status}`);
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },

  getAssetsByCategory: async (category) => {
    try {
      const response = await api.get(`/assets/category/${category}`);
      return response;
    } catch (error) {
      handleApiError(error);
    }
  }
};
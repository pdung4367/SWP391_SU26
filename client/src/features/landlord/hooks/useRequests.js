import { useState, useEffect } from 'react';
import { landlordService } from '../services/landlordService';

export const useRequests = (params = {}) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await landlordService.getRequests(params);
        
        // Handle both array and object responses
        if (Array.isArray(response)) {
          setRequests(response);
        } else if (response.data) {
          setRequests(response.data);
          if (response.pagination) {
            setPagination(response.pagination);
          }
        } else {
          setRequests([]);
        }
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch requests');
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [JSON.stringify(params)]);

  const approve = async (id) => {
    try {
      const updated = await landlordService.approveRequest(id);
      // Refresh requests after approval
      const response = await landlordService.getRequests(params);
      if (Array.isArray(response)) {
        setRequests(response);
      } else if (response.data) {
        setRequests(response.data);
      }
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to approve request');
      throw err;
    }
  };

  const reject = async (id, reason) => {
    try {
      const updated = await landlordService.rejectRequest(id, reason);
      // Refresh requests after rejection
      const response = await landlordService.getRequests(params);
      if (Array.isArray(response)) {
        setRequests(response);
      } else if (response.data) {
        setRequests(response.data);
      }
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to reject request');
      throw err;
    }
  };

  return { requests, loading, error, pagination, approve, reject };
};

export default useRequests;

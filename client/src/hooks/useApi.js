import { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (method, url, data = null, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await api({
        method,
        url,
        data,
        headers: { ...headers, ...config.headers }
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Something went wrong';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, request };
};

export const useFetch = (url, dependencies = []) => {
  const { data, loading, error, request } = useApi();

  useEffect(() => {
    if (url) {
      request('GET', url);
    }
  }, [url, ...dependencies]);

  return { data, loading, error, refetch: () => request('GET', url) };
};
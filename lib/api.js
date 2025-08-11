// lib/api.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const fetchUsers = async () => {
  const response = await api.get('/users/all');
  return response.data;
};

export const deleteUser = async (userId) => {
  await api.delete(`/users/${userId}`);
};

export const fetchPendingVerifications = async () => {
  const response = await api.get('/users/pending-verifications');
  return response.data;
};

export const verifyWorker = async (userId, status) => {
  await api.post('/users/verify-worker', { userId, status });
};

export const searchUsersByLocation = async (city, town) => {
  const response = await api.get('/users/search', { params: { city, town } });
  return response.data;
};
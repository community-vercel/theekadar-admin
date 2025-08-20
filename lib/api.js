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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    const message = error.response?.data?.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post('/admin/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to login');
  }
};

export const fetchUsers = async (page = 1, pageSize = 10) => {
  try {
    const response = await api.get('/admin/all', { params: { page, pageSize } });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch users');
  }
};

export const deleteUser = async (userId) => {
  try {
    await api.delete(`/admin/${userId}`);
  } catch (error) {
    throw new Error(error.message || 'Failed to delete user');
  }
};

export const updateUserByAdmin = async (userId, data) => {
  try {
    const response = await api.put(`/admin/${userId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to update user');
  }
};

export const verifyWorker = async (userId, status) => {
  try {
    const response = await api.post('/admin/verify-worker', { userId, status });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to verify worker');
  }
};

export const searchUsersByLocation = async (city, town) => {
  try {
    const response = await api.get('/admin/search', { params: { city, town } });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to search users');
  }
};
export const fetchUserss = async (page = 1, pageSize = 10) => {
  return api.get('/admin/all', { params: { page, pageSize } });
};
// app/lib/api.js
export const fetchReviews = async ({ page = 1, limit = 10 }) => {
  try {
    const response = await api.get(`/reviews?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch reviews');
  }
};

export const updateReview = async (reviewId, data) => {
  try {
    const response = await api.put(`/reviews/${reviewId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to update review');
  }
};

export const deleteReview = async (reviewId) => {
  try {
    await api.delete(`/reviews/${reviewId}`);
  } catch (error) {
    throw new Error(error.message || 'Failed to delete review');
  }
};


export const fetchAnalytics = async () => {
  try {
    const res = await api.get('/admin/analytics');
    return res.data; // ✅ now you get the actual analytics object
  } catch (error) {
    throw new Error(error.message);
  }

};


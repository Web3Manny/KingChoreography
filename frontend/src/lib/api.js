import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('kc_token');
      localStorage.removeItem('kc_user');
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Public
export const getServices = (category) => api.get('/services', { params: category ? { category } : {} });
export const getService = (id) => api.get(`/services/${id}`);
export const submitApplication = (data) => api.post('/applications', data);
export const submitSubmission = (data) => api.post('/submissions', data);
export const submitFreeSubmission = (data) => api.post('/submissions/free', data);
export const calculatePrice = (data) => api.post('/calculate-price', data);
export const submitContact = (data) => api.post('/contact', data);
export const createPayPalOrder = (data) => api.post('/payments/create-order', data);
export const capturePayPalOrder = (data) => api.post('/payments/capture-order', null, { params: data });

// Auth
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Admin
export const getAdminStats = () => api.get('/admin/stats');
export const getAdminApplications = (params) => api.get('/admin/applications', { params });
export const getAdminApplication = (id) => api.get(`/admin/applications/${id}`);
export const updateAdminApplication = (id, data) => api.patch(`/admin/applications/${id}`, data);
export const getAdminSubmissions = (params) => api.get('/admin/submissions', { params });
export const getAdminSubmission = (id) => api.get(`/admin/submissions/${id}`);
export const updateAdminSubmission = (id, data) => api.patch(`/admin/submissions/${id}`, data);
export const completeSubmission = (id) => api.post(`/admin/submissions/${id}/complete`);
export const getAdminQueue = (week) => api.get('/admin/queue', { params: week ? { week } : {} });
export const getAdminServices = () => api.get('/admin/services');
export const createAdminService = (data) => api.post('/admin/services', data);
export const updateAdminService = (id, data) => api.patch(`/admin/services/${id}`, data);
export const deleteAdminService = (id) => api.delete(`/admin/services/${id}`);
export const getRecentActivity = () => api.get('/admin/recent-activity');

export default api;

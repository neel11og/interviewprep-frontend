// src/services/api.js
import axios from 'axios';
import config from '../config/environment';

// Create axios instance
const api = axios.create({
  baseURL: `${config.api.baseUrl}/api/${config.api.version}`,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      // Clear any stale auth and force re-auth
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/me', userData);
    return response.data;
  },
};

// Resume API
export const resumeAPI = {
  // Upload resume
  uploadResume: async (file, userId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (userId) {
      formData.append('user_id', userId);
    }

    const response = await api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Analyze resume text
  analyzeText: async (resumeText, userId = null) => {
    const response = await api.post('/resume/analyze-text', {
      resume_text: resumeText,
      user_id: userId,
    });
    return response.data;
  },

  // Get user resumes
  getUserResumes: async (userId) => {
    const response = await api.get(`/resume/user/${userId}`);
    return response.data;
  },
};

// Questions API
export const questionsAPI = {
  // Get random questions
  getRandomQuestions: async (count = 10, difficulty = 'medium') => {
    const response = await api.get('/questions/random', {
      params: { count, difficulty },
    });
    return response.data;
  },

  // Generate questions from resume
  generateFromResume: async (resumeText, role = null, skills = []) => {
    const response = await api.post('/questions/generate', {
      resume_text: resumeText,
      role,
      skills,
    });
    return response.data;
  },
};

// Interview API
export const interviewAPI = {
  // Create interview session
  createSession: async (sessionData) => {
    const response = await api.post('/interview/session', sessionData);
    return response.data;
  },

  // Submit answer for evaluation
  submitAnswer: async (sessionId, questionId, answer, resumeText = null) => {
    const response = await api.post('/interview/evaluate', {
      session_id: sessionId,
      question_id: questionId,
      answer,
      resume_text: resumeText,
    });
    return response.data;
  },

  // Get interview feedback
  getFeedback: async (sessionId) => {
    const response = await api.get(`/interview/feedback/${sessionId}`);
    return response.data;
  },

  // Complete interview session
  completeSession: async (sessionId) => {
    const response = await api.post(`/interview/complete/${sessionId}`);
    return response.data;
  },
};

// Gemini AI API
export const geminiAPI = {
  // Ask Gemini a question
  askQuestion: async (question, context = null) => {
    const response = await api.post('/gemini/ask', {
      question,
      context,
    });
    return response.data;
  },

  // Generate interview questions
  generateQuestions: async (prompt, count = 5) => {
    const response = await api.post('/gemini/generate-questions', {
      prompt,
      count,
    });
    return response.data;
  },

  // Evaluate answer
  evaluateAnswer: async (question, answer, resumeText = null) => {
    const response = await api.post('/gemini/evaluate', {
      question,
      answer,
      resume_text: resumeText,
    });
    return response.data;
  },
};

// Health API
export const healthAPI = {
  // Check API health
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // Get API info
  getInfo: async () => {
    const response = await api.get('/info');
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        details: error.response.data?.details || null,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error - please check your connection',
        status: 0,
        details: null,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        details: null,
      };
    }
  },

  // Set auth token
  setAuthToken: (token) => {
    localStorage.setItem('authToken', token);
  },

  // Remove auth token
  removeAuthToken: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

export default api;

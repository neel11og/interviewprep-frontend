// src/config/environment.js
// Environment configuration for the frontend application

const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    version: import.meta.env.VITE_API_VERSION || 'v1',
    timeout: 30000,
  },

  // Application Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'InterviewPrep.AI',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'AI-powered interview preparation platform',
    debug: import.meta.env.VITE_DEBUG === 'true' || false,
  },

  // UI Configuration
  ui: {
    defaultTheme: import.meta.env.VITE_DEFAULT_THEME || 'dark',
    enableAnimations: import.meta.env.VITE_ENABLE_ANIMATIONS !== 'false',
    particleCount: parseInt(import.meta.env.VITE_PARTICLE_COUNT) || 1000,
  },

  // File Upload Configuration
  upload: {
    maxFileSizeMB: parseInt(import.meta.env.VITE_MAX_FILE_SIZE_MB) || 5,
    allowedFileTypes: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'pdf,doc,docx').split(','),
    maxFileSizeBytes: (parseInt(import.meta.env.VITE_MAX_FILE_SIZE_MB) || 5) * 1024 * 1024,
  },

  // Interview Configuration
  interview: {
    defaultQuestionCount: parseInt(import.meta.env.VITE_DEFAULT_QUESTION_COUNT) || 10,
    maxDurationMinutes: parseInt(import.meta.env.VITE_MAX_INTERVIEW_DURATION_MINUTES) || 60,
    enableVoiceRecording: import.meta.env.VITE_ENABLE_VOICE_RECORDING === 'true' || false,
  },

  // Feature Flags
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true' || false,
    errorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true' || false,
    performanceMonitoring: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true' || false,
  },

  // Development Configuration
  development: {
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
    enableHotReload: import.meta.env.DEV || false,
  },
};

// Validation
const validateConfig = () => {
  const errors = [];

  if (!config.api.baseUrl) {
    errors.push('API base URL is required');
  }

  if (config.upload.maxFileSizeMB > 10) {
    errors.push('Max file size cannot exceed 10MB');
  }

  if (config.interview.defaultQuestionCount < 1 || config.interview.defaultQuestionCount > 50) {
    errors.push('Default question count must be between 1 and 50');
  }

  if (errors.length > 0) {
    console.error('Configuration validation errors:', errors);
    throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
  }
};

// Validate configuration on import
if (typeof window !== 'undefined') {
  validateConfig();
}

export default config;

// Environment Configuration
export const config = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.diginer.app',
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',

  // Wallet & Blockchain
  walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '9f4bd472c01ba49282b42e5e1874c2af',
  chainId: parseInt(import.meta.env.VITE_CHAIN_ID || '8453'),
  chainName: import.meta.env.VITE_CHAIN_NAME || 'Base',

  // Payment Configuration
  paymentApiUrl: import.meta.env.VITE_PAYMENT_API_URL || 'https://payments.vistara.dev',
  microTransactionAmount: parseFloat(import.meta.env.VITE_MICRO_TRANSACTION_AMOUNT || '0.001'),

  // Farcaster Configuration
  farcasterHubUrl: import.meta.env.VITE_FARCASTER_HUB_URL || 'https://hub.farcaster.xyz',
  farcasterAppFid: import.meta.env.VITE_FARCASTER_APP_FID,

  // TikTok Integration
  tiktokApiKey: import.meta.env.VITE_TIKTOK_API_KEY,
  tiktokApiSecret: import.meta.env.VITE_TIKTOK_API_SECRET,

  // Analytics & Monitoring
  analyticsId: import.meta.env.VITE_ANALYTICS_ID,
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,

  // Feature Flags
  features: {
    tiktokIntegration: import.meta.env.VITE_ENABLE_TIKTOK_INTEGRATION === 'true',
    farcasterFrames: import.meta.env.VITE_ENABLE_FARCASTER_FRAMES === 'true',
    paymentFeatures: import.meta.env.VITE_ENABLE_PAYMENT_FEATURES === 'true',
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },

  // Development Configuration
  debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
  mockApiResponses: import.meta.env.VITE_MOCK_API_RESPONSES === 'true',

  // Computed values
  get isDevelopment() {
    return this.environment === 'development';
  },

  get isProduction() {
    return this.environment === 'production';
  },

  get isStaging() {
    return this.environment === 'staging';
  },
};

// Validation function to ensure required environment variables are set
export const validateEnvironment = () => {
  const requiredVars = [
    'VITE_API_BASE_URL',
    'VITE_WALLET_CONNECT_PROJECT_ID',
  ];

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    if (config.isProduction) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }

  // Warn about optional but recommended variables
  const recommendedVars = [
    'VITE_FARCASTER_APP_FID',
    'VITE_ANALYTICS_ID',
  ];

  const missingRecommended = recommendedVars.filter(varName => !import.meta.env[varName]);
  if (missingRecommended.length > 0 && config.isProduction) {
    console.warn('Missing recommended environment variables:', missingRecommended);
  }
};

export default config;

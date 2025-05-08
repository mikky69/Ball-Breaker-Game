// Configuration for the application
const config = {
  // Supabase
  supabase: {
    url: 'YOUR_SUPABASE_URL',
    key: 'YOUR_SUPABASE_ANON_KEY'
  },
  
  // Server
  server: {
    port: 3000,
    env: 'production'
  },
  
  // API
  api: {
    url: 'https://your-production-api-url.com'
  }
};

// Override with environment variables if they exist
if (typeof process !== 'undefined') {
  // Supabase
  if (process.env.SUPABASE_URL) config.supabase.url = process.env.SUPABASE_URL;
  if (process.env.SUPABASE_ANON_KEY) config.supabase.key = process.env.SUPABASE_ANON_KEY;
  
  // Server
  if (process.env.PORT) config.server.port = process.env.PORT;
  if (process.env.NODE_ENV) config.server.env = process.env.NODE_ENV;
  
  // API
  if (process.env.API_URL) config.api.url = process.env.API_URL;
}

// Export the configuration
module.exports = config;

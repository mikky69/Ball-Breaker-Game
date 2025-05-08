// Browser-specific configuration
const config = {
  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL || 'https://snnptmpgyykohcmwyxze.supabase.co',
    key: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNubnB0bXBneXlrb2hjbXd5eHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NzEzODUsImV4cCI6MjA2MjE0NzM4NX0.uGUlRHLBYopMxbxoU0nXVKDUCnSbLA4Ft5Wt1GJzu0w'
  },
  
  // Server
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'production'
  },
  
  // API
  api: {
    url: `${process.env.SUPABASE_URL || 'https://snnptmpgyykohcmwyxze.supabase.co'}/rest/v1`
  }
};

// Make config available globally
window.config = config;

// Export the configuration
export default config;

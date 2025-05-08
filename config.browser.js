// Browser-specific configuration
const config = {
  // Supabase
  supabase: {
    url: 'https://snnptmpgyykohcmwyxze.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNubnB0bXBneXlrb2hjbXd5eHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NzEzODUsImV4cCI6MjA2MjE0NzM4NX0.uGUlRHLBYopMxbxoU0nXVKDUCnSbLA4Ft5Wt1GJzu0w'
  },
  
  // Server
  server: {
    port: 3000,
    env: 'production'
  },
  
  // API
  api: {
    url: 'https://snnptmpgyykohcmwyxze.supabase.co/rest/v1'
  }
};

// Make config available globally
window.config = config;

// Export the configuration
export default config;

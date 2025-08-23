const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://a11ycheck-server-c9z2.onrender.com'  // ❌ REMOVED trailing slash
  : 'http://localhost:4000';

export default API_BASE_URL;
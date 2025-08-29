// api.js

// This code reads the variable from Vercel's settings in production.
// If it's not found (like when you're running locally), it falls back to localhost.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default API_BASE_URL;
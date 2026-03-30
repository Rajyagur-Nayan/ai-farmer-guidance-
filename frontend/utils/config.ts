/**
 * Production-Ready API Configuration
 * 
 * Automatically resolves the Backend API URL based on the environment.
 * Uses NEXT_PUBLIC_API_URL for production (Render/Vercel) 
 * and fallbacks to localhost:8000 for local development.
 */

export const getApiUrl = (path: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
  // Remove leading slash from path if it exists to prevent double slashes
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  return `${baseUrl}/${cleanPath}`;
};

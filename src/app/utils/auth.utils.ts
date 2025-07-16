/**
 * Utility function to check if user is authenticated
 * @returns boolean indicating if user has valid token
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  
  // Check if token exists
  if (!token) {
    return false;
  }
  
  // Check if token is valid JWT format and not expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      localStorage.removeItem('token'); // Remove expired token
      return false;
    }
    
    return true;
  } catch (error) {
    // Invalid token format
    localStorage.removeItem('token'); // Remove invalid token
    return false;
  }
}

/**
 * Get token payload without verification
 * @returns decoded JWT payload or null
 */
export function getTokenPayload(): any | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    return null;
  }
}

/**
 * Get user info from token
 * @returns user info object or null
 */
export function getUserFromToken(): any | null {
  const payload = getTokenPayload();
  return payload ? {
    id: payload.sub || payload.userId,
    email: payload.email,
    firstName: payload.firstName,
    // Add other user fields as needed
  } : null;
}
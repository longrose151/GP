export const API_BASE_URL = import.meta.env.VITE_API_URL;

// Function to get the CSRF token from the cookie
export function getCsrfToken() {
  const csrfToken = document.cookie.replace(
    /(?:(?:^|.*;\s*)csrftoken\s*=\s*([^;]*).*$)|^.*$/,
    '$1'
  );
  return csrfToken;
}
import axios from "axios";

// If you have a specific base URL you can define it here,
// though we'll primarily use the absolute paths from API_URL constants
export const axiosInstance = axios.create({
  withCredentials: true, // Crucial for sending/receiving HttpOnly cookies (JWT)
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Response Interceptor to globally handle 401 Unauthorized errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the backend returns 401 Unauthorized, we could theoretically trigger a context reset here
    /*
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or unauthorized");
      // Specific logout dispatch or location reload logic could go here
    }
    */
    return Promise.reject(error);
  },
);

import ky from "ky";

// Token helpers
export const getToken = () => localStorage.getItem("token");
export const setToken = (token: string) => localStorage.setItem("token", token);
export const clearToken = () => localStorage.removeItem("token");

// API client with auth interceptor
export const api = ky.create({
  prefixUrl: "/api", // Uses Vite proxy in development, absolute URL in production
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getToken();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    beforeError: [
      (error) => {
        if (error.response?.status === 401) {
          clearToken();
          window.location.href = "/login";
        }
        return error;
      },
    ],
  },
});

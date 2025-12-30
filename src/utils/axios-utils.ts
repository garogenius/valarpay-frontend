import axios from "axios";
import Cookies from "js-cookie";

const api = process.env.NEXT_PUBLIC_BACKEND_API;
const apiKey = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

export const client = axios.create({
  baseURL: `${api}`,
  headers: {
    "x-api-key": apiKey,
  },
});

export const request = ({ ...options }) => {
  const token = Cookies.get("accessToken");
  // Only add Authorization header if token exists and endpoint is not a public endpoint
  const publicEndpoints = ["/user/register", "/auth/login", "/user/register-business"];
  const isPublicEndpoint = publicEndpoints.some(endpoint => options.url?.includes(endpoint));
  const isNoAuth = options?.noAuth === true;
  
  // Create a new headers object for this request
  const headers = { ...client.defaults.headers.common };
  
  if (token && !isPublicEndpoint && !isNoAuth) {
    headers.Authorization = `Bearer ${token}`;
  } else if (isPublicEndpoint || isNoAuth) {
    // Explicitly remove Authorization header for public endpoints
    delete headers.Authorization;
  }
  
  client.defaults.withCredentials = true;
  return client({
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
};

export const removeHeaderToken = (): void => {
  delete client.defaults.headers.common["Authorization"];
};

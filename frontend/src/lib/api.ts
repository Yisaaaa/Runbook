import { useAuthStore } from "@/store/authStore";

export const fetchWrapper = async (url: string, options: RequestInit = {}) => {
  const token = useAuthStore.getState().accessToken;
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  console.log(process.env.API_BASE_URL);
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

  const response = await fetch(API_BASE_URL + url, { ...options, headers });

  if (!response.ok) {
    if ([401, 403].includes(response.status)) {
      useAuthStore.getState().logout();
    }
    let message = "`HTTP error! status: ${response.status}`";

    try {
      const errorBody = await response.json();
      message = errorBody.message ?? message;
    } catch {}

    throw new Error(message);
  }

  const data = await response.json();
  return data;
};

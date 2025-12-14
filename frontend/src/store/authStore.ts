import { create } from "zustand";
import { loginSchemaType } from "@/types/auth";
import { signupSchemaType } from "@/types/auth";
import { fetchWrapper } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  initAuth: () => void;
  login: (loginUserData: loginSchemaType) => Promise<void>;
  signup: (signupUserData: signupSchemaType) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,

  initAuth: () => {
    const storedUser = localStorage.getItem("user");
    const storedAccessToken = localStorage.getItem("accessToken");
    if (storedUser && storedAccessToken) {
      set({
        user: JSON.parse(storedUser),
        accessToken: storedAccessToken,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
  },

  login: async (loginUserData: loginSchemaType) => {
    const responseData = await fetchWrapper("/auth/signin", {
      method: "POST",
      body: JSON.stringify(loginUserData),
    });
    console.log("login response: ", responseData);

    const { user, accessToken } = responseData;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("access_accessToken", accessToken);
    set({ user, accessToken, isLoading: false });
  },

  signup: async (signupUserData: signupSchemaType) => {
    const responseData = await fetchWrapper("/signup", {
      body: JSON.stringify(signupUserData),
    });
    console.log("signup response: ", responseData);

    const { user, accessToken } = responseData;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    set({ user, accessToken, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");

    set({
      user: null,
      accessToken: null,
    });
  },
}));

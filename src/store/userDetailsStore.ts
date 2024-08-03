import { create } from "zustand";
import axios from "axios";
import  { BackendGet } from "@/utils/backend";
import { backendRoutes } from "@/constants";

interface UserDetails {
  email: string;
  name: string;
  picture: string;
}

interface UserDetailsStore {
  userDetails: UserDetails | null;
  isLoading: boolean;
  updateUserDetails: (details: Partial<UserDetails> | null) => void;
  fetchUserDetails: () => Promise<void>;
}

const useUserDetailsStore = create<UserDetailsStore>((set) => ({
  userDetails: null,
  isLoading: false,
  updateUserDetails: (details) => {
    set((state) => ({
      userDetails: details
        ? { ...(state.userDetails as UserDetails), ...details }
        : null,
    }));
  },
  fetchUserDetails: async () => {
    set({ isLoading: true });
    try {
      const response = await BackendGet({
        path: backendRoutes.userDetails,
        headers: {
          "X-API-NAME": "userDetails",
        },
      });

      if (response?.type === "success" && response?.user) {
        set({
          userDetails: response?.user,
          isLoading: false,
        });
      } else {
        set({ userDetails: null, isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch user details", error);
      set({ userDetails: null, isLoading: false });
    }
  },
}));

export default useUserDetailsStore;

import { create } from "zustand";
import axios from "axios";

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
      const response = await axios.get<{
        type: string;
        user: { email: string; name: string; picture: string };
      }>(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`, {
        withCredentials: true,
      });

      if (response?.data?.type === "success"&&response?.data?.user) {
        set({
          userDetails: response?.data?.user,
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

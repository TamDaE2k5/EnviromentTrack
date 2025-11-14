import axios from "axios";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
export const profileService = {
  getProfile: () => {
    const token = useAuthStore.getState().user?.token;
    return api.get("/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  updateProfile: (data) => {
    const token = useAuthStore.getState().user?.token;
    return axios.put("/profile", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

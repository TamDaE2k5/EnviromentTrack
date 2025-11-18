import axios from "axios";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
export const profileService = {
  getProfile: () => {
    const token = useAuthStore.getState().user?.token;
    // console.log(token)
    return api.get("/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  updateProfile: (data) => {
    const token = useAuthStore.getState().user?.token;
    // console.log(token)
    return axios.put("http://localhost:5000/api/profile", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

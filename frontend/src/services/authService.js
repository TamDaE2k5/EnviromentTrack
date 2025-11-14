import api from "@/lib/axios";

export const authService = {
  async register(data) {
    const res = await api.post("/auth/signup", data);
    return res.data;
  },

  async login(data) {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  async logout() {
    const res = await api.post("/auth/logout");
    return res.data;
  },
};

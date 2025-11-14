import { create } from "zustand";
import { authService } from "@/services/authService";
import { toast } from "sonner";
export const useAuthStore = create((get,set) => ({
  user: null,
  loading: false,
  error: null,
  
  setUser: (userData) => set({ user: userData }),

  register: async (data) => {
    set({ loading: true, error: null });
    try {
        const res = await authService.register(data);
        set({ user: res.user || null, loading: false });
        toast.success('Đăng ký thành công!')
        return res;
    } catch (err) {
        toast.error('Đăng ký thất bại!')
        set({ error: err.response?.data?.message || "Đăng ký thất bại", loading: false });
        throw err;
    }
    },

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.login(data);
      set({ user: res.user || null, loading: false });
      toast.success('Đăng nhập thành công!')
      return res;
    } catch (err) {
      set({ error: err.response?.data?.message || "Đăng nhập thất bại", loading: false });
      toast.error('Đăng nhập thất bại!')
      throw err;
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null });
    console.log('Logout success!')
    toast.success('Logout success!')
  },
}));
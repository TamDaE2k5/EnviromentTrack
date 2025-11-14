import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/authService";
import { toast } from "sonner";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      setUser: (userData) => set({ user: userData }),

      register: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await authService.register(data);
          set({ user: res.user || null, loading: false });
          toast.success("Đăng ký thành công!");
          return res;
        } catch (err) {
          toast.error("Đăng ký thất bại!");
          set({
            error: err.response?.data?.message || "Đăng ký thất bại",
            loading: false,
          });
          throw err;
        }
      },

      login: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await authService.login(data);
          // console.log("LOGIN RESPONSE:", res);
          set({
                user: {
                  ...res.user,
                  token: res.accessToken, // Lưu token vào store
                }
              });
            
          toast.success("Đăng nhập thành công!");
          return res;
        } catch (err) {
          set({
            error: err.response?.data?.message || "Đăng nhập thất bại",
            loading: false,
          });
          toast.error("Đăng nhập thất bại!");
          throw err;
        }
      },

      logout: async () => {
        await authService.logout();
        set({ user: null });
        toast.success("Logout success!");
      },
    }),
    {
      name: "auth-storage", // tên key lưu trong localStorage
      partialize: (state) => ({ user: state.user }), // chỉ lưu phần user, không lưu loading/error
    }
  )
);

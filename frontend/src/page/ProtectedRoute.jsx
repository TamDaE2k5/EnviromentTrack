import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore.persist?.hasHydrated?.();

  // Tránh protected route redirect trước khi Zustand load state
  if (!hasHydrated) {
    return <div className="p-4">Đang tải...</div>; 
  }
  // console.log(user)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

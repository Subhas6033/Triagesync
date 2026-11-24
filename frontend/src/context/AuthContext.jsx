import { AuthContext } from "./authState";
import { useAuthSession } from "../features/auth/hooks/useAuth";
export function AuthProvider({ children }) {
  const auth = useAuthSession();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

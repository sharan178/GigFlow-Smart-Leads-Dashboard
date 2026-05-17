import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { authApi } from "../services/api";
import { User } from "../types";

interface AuthContextValue {
  user: User | null;
  login(email: string, password: string): Promise<void>;
  register(input: { name: string; email: string; password: string; role: string }): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  });

  const saveSession = (token: string, nextUser: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      async login(email, password) {
        const data = await authApi.login({ email, password });
        saveSession(data.token, data.user);
      },
      async register(input) {
        const data = await authApi.register(input);
        saveSession(data.token, data.user);
      },
      logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

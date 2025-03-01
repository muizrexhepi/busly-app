import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

type User = {
  _id: string;
  email: string;
  name: string;
  [key: string]: any;
};

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  refreshUser: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserInfo: (info: any) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("authToken");
      if (token) {
        const decodedUser: User = jwtDecode(token);
        setUser(decodedUser.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
    2;
  }, []);

  // On first render, fetch the user
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Logout function to clear SecureStore and update user state
  const logout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    setUser(null);
  };
  const updateUserInfo = (updatedInfo: any) => {
    setUser((prevUser: any) => ({
      ...prevUser,
      ...updatedInfo,
    }));
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser: fetchUser,
        logout,
        updateUserInfo,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

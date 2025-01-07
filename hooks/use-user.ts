import { useCallback, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {jwtDecode} from "jwt-decode";

type User = {
  id: string;
  email: string;
  name: string;
  [key: string]: any; 
};

const useUser = () => {
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
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const refreshUser = fetchUser;

  return { user, loading, refreshUser };
};

export default useUser;

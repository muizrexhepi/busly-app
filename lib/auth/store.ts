import {create} from 'zustand';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  
  login: async (token: string) => {
    await SecureStore.setItemAsync('authToken', token);  // Store token securely
    set({ token, isAuthenticated: true });
  },
  
  logout: async () => {
    await SecureStore.deleteItemAsync('authToken');  // Clear the token
    set({ token: null, isAuthenticated: false });
  },

  register: async (email: string, password: string) => {
    try {
      const response = await axios.post('https://your-backend.com/register', { email, password });
      const { token } = response.data; // Assuming your backend returns a token upon successful registration
      await SecureStore.setItemAsync('authToken', token); // Store the token
      set({ token, isAuthenticated: true }); // Update state
    } catch (error) {
      console.error('Registration failed', error); // Handle registration failure (e.g., invalid email, weak password)
    }
  },
  
  checkAuth: async () => {
    const token = await SecureStore.getItemAsync('authToken');
    set({ token, isAuthenticated: token != null });
  },
}));

export default useAuthStore;

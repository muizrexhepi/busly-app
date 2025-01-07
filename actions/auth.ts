import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { environment } from '@/environment';

type AuthProps = {
  email: string;
  password: string;
  fullName?: string;
};

type AuthResponse = {
  success: boolean;
  token?: string;
  error?: string;
};

const login = async ({ email, password }: AuthProps): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${environment.apiurl}/auth/login`, { email, password });
    const { token } = response.data;
    await SecureStore.setItemAsync('authToken', token);
    return { success: true, token };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed'
    };
  }
};

const register = async ({ fullName, email, password }: AuthProps): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${environment.apiurl}/auth/register`, {
      name: fullName,
      email,
      password
    });
    console.log({response})
    const { token } = response.data;
    await SecureStore.setItemAsync('authToken', token);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Registration failed'
    };
  }
};

const isAuthenticated = async () => {
  const token = await SecureStore.getItemAsync('authToken');
  return token != null; 
};

const logout = async () => {
  await SecureStore.deleteItemAsync('authToken'); 
};

export { login, register, isAuthenticated, logout };

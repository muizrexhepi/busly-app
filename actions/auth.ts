import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { environment } from "@/environment";

type OTPLoginProps = {
  email: string;
  otp: string;
};

type SendOTPProps = {
  email: string;
};

type AuthResponse = {
  success: boolean;
  token?: string;
  error?: string;
};

const sendOTP = async ({ email }: SendOTPProps): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${environment.apiurl}/auth/otp/send`, {
      email,
    });
    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to send OTP",
    };
  }
};

const login = async ({ email, otp }: OTPLoginProps): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${environment.apiurl}/auth/otp/verify`, {
      email,
      otp,
    });
    const token = response.data.data;
    console.log({ token });
    await SecureStore.setItemAsync("authToken", token);
    return { success: true, token };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "OTP verification failed",
    };
  }
};

const isAuthenticated = async () => {
  const token = await SecureStore.getItemAsync("authToken");
  return token != null;
};

const logout = async () => {
  await SecureStore.deleteItemAsync("authToken");
};

export { login, sendOTP, isAuthenticated, logout };

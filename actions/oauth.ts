import * as AppleAuthentication from "expo-apple-authentication";
import { environment } from "@/environment";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import * as Google from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

export const appleLogin = async () => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    console.log("Apple login credentials:", credential);


    const { email, fullName, identityToken } = credential;

    console.log({identityToken})

    const response = await axios.post(`${environment.apiurl}/auth/apple-login`, {
      email,
      fullName:fullName?.givenName+ ' ' + fullName?.familyName,
      identityToken, 
    });

    console.log({responsimi:response.data})

    const token = response.data.data;
    console.log(token)
    await SecureStore.setItemAsync("authToken", token);

    return { success: true, token };
  } catch (e: any) {
    if (e.code === "ERR_REQUEST_CANCELED") {
      console.log("User canceled Apple login");
    } else {
      console.error("Apple login error:", e);
    }
    return { success: false, error: e.response?.data?.message || "Login failed" };
  }
};
// export const googleLogin = async () => {
//   try {
//     WebBrowser.maybeCompleteAuthSession();

//     const redirectUri = Google.makeRedirectUri();
    
//     const request = new Google.AuthRequest({
//       clientId: environment.GOOGLE_IOS_CLIENT_ID,
//       clientSecret:environment.GOOGLE_WEB_CLIENT_SECRET,
//       redirectUri,
//       scopes: ['profile', 'email'],
//       responseType: 'token',
//     });
//     console.log({request})

//     const discovery = {
//       authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
//       tokenEndpoint: 'https://oauth2.googleapis.com/token',
//     };

//     const result = await request.promptAsync(discovery);
//     console.log({result})

//     if (result.type === 'success' && result.authentication) {
//       const { accessToken } = result.authentication;

//       const loginResponse = await axios.post(`${environment.apiurl}/auth/google-login`, {
//         accessToken,
//       });

//       const { token } = loginResponse.data;

//       // Store the auth token securely
//       await SecureStore.setItemAsync('authToken', token);

//       return { success: true, token };
//     }

//     // If user cancels or there's an error, handle it here
//     return { success: false, error: 'Login failed or canceled' };
//   } catch (e: any) {
//     console.error('Google login error:', e);
//     return { success: false, error: e.response?.data?.message || 'Login failed' };
//   }
// };
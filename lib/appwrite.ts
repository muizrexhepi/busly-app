// import { Client, Account, ID, Models } from 'react-native-appwrite';

// let client: Client;
// export let account: Account;

// client = new Client()
//   .setEndpoint('https://cloud.appwrite.io/v1')          // Correct Appwrite Cloud endpoint
//   .setProject('674844030034afde5fd6')                   
//   .setPlatform('com.gobuslyllc.gobusly');              

// account = new Account(client);

// export async function appwriteLogin(email: string, password: string) {
//   try {
//     console.log('Attempting to login:', { email, password });
//     const session = await account.createEmailPasswordSession(email, password);
//     console.log('Login successful:', session);
//     return session;
//   } catch (error: any) {
//     console.error('Login failed:', error.message || error);
//     throw error;
//   }
// }

// export async function register(email: string, password: string, name: string) {
//   try {
//     console.log('Attempting to register:', { email, name });
//     const user = await account.create(ID.unique(), email, password, name);
//     console.log('Registration successful:', user);

//     const session = await appwriteLogin(email, password);
//     return session;
//   } catch (error: any) {
//     console.error('Registration failed:', error.message || error);
//     throw error;
//   }
// }

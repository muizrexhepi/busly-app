// import { useCallback, useEffect, useState } from "react";
// import { account } from "@/appwrite.config";

// const useUser = () => {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true); 

//   const fetchUser = useCallback(async () => {
//     try {
//       setLoading(true); 
//       const fetchedUser = await account.get();
//       setUser(fetchedUser);
//     } catch (error) {
//       setUser(null);
//       console.error("Failed to fetch user:", error);
//     } finally {
//       setLoading(false); 
//     }
//   }, []);

//   useEffect(() => {
//     fetchUser();

//     const handleUserChange = () => {
//       fetchUser();
//     };

//     window.addEventListener("userChange", handleUserChange);

//     return () => {
//       window.removeEventListener("userChange", handleUserChange);
//     };
//   }, [fetchUser]);

//   return { loading, user }; 
// };

// export default useUser;

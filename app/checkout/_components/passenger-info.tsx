// // PassengerInfo.tsx

// import React, { useEffect } from "react";
// import { View, Text, TextInput, ScrollView } from "react-native";
// import PhoneInput from "react-native-phone-input";
// import { PassengerData, useCheckoutStore } from "@/store"; // Adjust the import based on your store structure

// interface InputFieldProps {
//   label: string;
//   placeholder: string;
//   value: string;
//   onChange: (value: string) => void;
//   required: boolean;
// }

// const InputField: React.FC<InputFieldProps> = ({
//   label,
//   placeholder,
//   value,
//   onChange,
//   required,
// }) => (
//   <View className="mb-2">
//     <Text className="font-normal text-sm text-black">{label}</Text>
//     <TextInput
//       className="border border-gray-400 p-2 bg-white rounded-lg"
//       placeholder={placeholder}
//       value={value}
//       onChangeText={onChange}
//     />
//   </View>
// );

// const PassengerInfo: React.FC = () => {
//   const { passengers, setPassengers } = useCheckoutStore((state) => ({
//     passengers: state.passengers,
//     setPassengers: state.setPassengers,
//   }));

//   // Example values for adults and children; adjust as necessary
//   const adults = 1;
//   const children = 0;

//   useEffect(() => {
//     if (passengers.length === adults + children) {
//       return;
//     }

//     const initialPassengers: PassengerData[] = [
//       ...Array(adults).fill({
//         full_name: "",
//         email: "",
//         phone: "",
//         birthdate: "",
//         age: 33,
//         price: 0,
//       }),
//       ...Array(children).fill({
//         full_name: "",
//         email: "",
//         phone: "",
//         birthdate: "",
//         age: 0,
//         price: 0,
//       }),
//     ];

//     setPassengers(initialPassengers);
//   }, [adults, children, setPassengers]);

//   const updatePassenger = (
//     index: number,
//     field: keyof PassengerData,
//     value: string
//   ) => {
//     const updatedPassengers = [...passengers];
//     updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };

//     // Age calculation for birthdate field
//     if (field === "birthdate") {
//       const birthDate = new Date(value);
//       const today = new Date();
//       let age = today.getFullYear() - birthDate.getFullYear();
//       const monthDiff = today.getMonth() - birthDate.getMonth();
//       if (
//         monthDiff < 0 ||
//         (monthDiff === 0 && today.getDate() < birthDate.getDate())
//       ) {
//         age--;
//       }
//       updatedPassengers[index].age = age;
//     }

//     setPassengers(updatedPassengers);
//   };

//   const renderPassengerInputs = (passengerIndex: number, isChild: boolean) => {
//     const passenger = passengers[passengerIndex];

//     return (
//       <View key={passengerIndex} className="mb-4">
//         <Text className="font-medium text-black mb-2">
//           {isChild
//             ? `Child ${passengerIndex - adults + 1}`
//             : `Adult ${passengerIndex + 1}`}
//         </Text>
//         <View className="flex flex-col gap-2">
//           <InputField
//             label="First Name"
//             placeholder="Enter first name"
//             value={passenger.full_name.split(" ")[0] || ""}
//             onChange={(value) => {
//               const lastName = passenger.full_name
//                 .split(" ")
//                 .slice(1)
//                 .join(" ");
//               updatePassenger(
//                 passengerIndex,
//                 "full_name",
//                 `${value} ${lastName}`.trim()
//               );
//             }}
//             required={true}
//           />
//           <InputField
//             label="Last Name"
//             placeholder="Enter last name"
//             value={passenger.full_name.split(" ").slice(1).join(" ") || ""}
//             onChange={(value) => {
//               const firstName = passenger.full_name.split(" ")[0];
//               updatePassenger(
//                 passengerIndex,
//                 "full_name",
//                 `${firstName} ${value}`.trim()
//               );
//             }}
//             required={true}
//           />
//           {passengerIndex === 0 && (
//             <>
//               <InputField
//                 label="Email"
//                 placeholder="Enter email"
//                 value={passenger.email}
//                 onChange={(value) =>
//                   updatePassenger(passengerIndex, "email", value)
//                 }
//                 required={true}
//               />
//               <View className="flex flex-col">
//                 <Text className="font-normal text-sm text-black">
//                   Phone Number
//                 </Text>
//                 <PhoneInput
//                   //   className="border border-gray-400 p-2 bg-white rounded-lg"
//                   initialCountry="MK"
//                   onChangePhoneNumber={(value: any) =>
//                     updatePassenger(passengerIndex, "phone", value)
//                   }
//                   //   value={passenger.phone}
//                 />
//               </View>
//             </>
//           )}
//           {isChild && (
//             <InputField
//               label="Birthdate"
//               placeholder="Enter birthdate"
//               value={passenger.birthdate}
//               onChange={(value) =>
//                 updatePassenger(passengerIndex, "birthdate", value)
//               }
//               required={true}
//             />
//           )}
//         </View>
//       </View>
//     );
//   };

//   return (
//     <ScrollView className="flex-1 bg-white rounded-lg p-4">
//       <View className="flex flex-row items-center gap-4">
//         <Text className="w-8 h-8 bg-green-100 text-green-600 rounded-full text-center leading-8 font-semibold">
//           1
//         </Text>
//         <Text className="text-lg font-medium text-gray-800">
//           Passenger Information
//         </Text>
//       </View>
//       <Text className="text-sm text-gray-500">
//         Please fill in the details below.
//       </Text>
//       <View className="my-4">
//         {passengers.map((_, index) =>
//           renderPassengerInputs(index, index >= adults)
//         )}
//       </View>
//       {/* <PassengerSelector /> */}
//     </ScrollView>
//   );
// };

// export default PassengerInfo;

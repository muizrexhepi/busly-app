//   import React, { createContext, useContext, useState } from 'react';
//   import { useStripe } from '@stripe/stripe-react-native';
//   import { useRouter } from 'expo-router';
//   import { Alert } from 'react-native';
//   import axios from 'axios';
//   import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ticket } from '@/models/ticket';
// import { Passenger } from '@/models/passenger';
// import { Stop } from 'react-native-svg';
// import { useCheckoutStore, useDepositStore } from '@/store';

//   interface PaymentContextValue {
//     loading: boolean;
//     cardDetails: CardDetails | null;
//     handlePayment: () => Promise<void>;
//     handleFullDepositPayment: () => Promise<void>;
//     setCardDetails: (details: CardDetails | null) => void;
//   }

//   interface CreateBookingParams {
//     ticket: Ticket;
//     isReturn: boolean;
//     paymentIntentId: string;
//   }

//   interface BookingPayload {
//     passengers: Passenger[];
//     travel_flex: string;
//     payment_intent_id: string;
//     platform: string;
//     flex_price: number;
//     total_price: number;
//     operator_price: number;
//     departure_station: string;
//     arrival_station: string;
//     departure_station_label: string;
//     arrival_station_label: string;
//     is_using_deposited_money: boolean;
//     deposit_spent: number;
//     stop: Stop;
//     is_return: boolean;
//   }

//   const PaymentContext = createContext<PaymentContextValue | undefined>(undefined);

//   interface PaymentProviderProps {
//     children: React.ReactNode;
//   }

//   export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
//     const stripe = useStripe();
//     const router = useRouter();
//     const [loading, setLoading] = useState<boolean>(false);
//     const [cardDetails, setCardDetails] = useState<CardDetails | null>(null);

//     const {
//       passengers,
//       outboundTicket,
//       returnTicket,
//       selectedFlex,
//       flexPrice,
//       resetCheckout,
//     } = useCheckoutStore();

//     const { depositAmount, useDeposit } = useDepositStore();

//     const calculateTicketTotal = (ticket: Ticket): number => {
//       const adultPrice = ticket.stops[0].other_prices.our_price;
//       const childPrice = ticket.stops[0].other_prices.our_children_price;
//       const adultCount = passengers.filter((p) => p.age > 10).length;
//       const childCount = passengers.filter((p) => p.age <= 10).length;
//       return adultPrice * adultCount + childPrice * childCount;
//     };

//     const calculateOperatorTicketTotal = (ticket: Ticket): number => {
//       const adultPrice = ticket.stops[0].price;
//       const childPrice = ticket.stops[0].children_price;
//       const adultCount = passengers.filter((p) => p.age > 10).length;
//       const childCount = passengers.filter((p) => p.age <= 10).length;
//       return adultPrice * adultCount + childPrice * childCount;
//     };

//     const outboundTotal = outboundTicket ? calculateTicketTotal(outboundTicket) : 0;
//     const returnTotal = returnTicket ? calculateTicketTotal(returnTicket) : 0;
//     const operatorOutboundTotal = outboundTicket ? calculateOperatorTicketTotal(outboundTicket) : 0;
//     const operatorReturnTotal = returnTicket ? calculateOperatorTicketTotal(returnTicket) : 0;
//     const operatorTotalPrice = operatorOutboundTotal + operatorReturnTotal;
//     const totalPrice = outboundTotal + returnTotal + flexPrice;
//     const finalPrice = useDeposit ? Math.max(totalPrice - depositAmount, 0) : totalPrice;

//     const createBooking = async ({ ticket, isReturn, paymentIntentId }: CreateBookingParams) => {
//       const departure_station = ticket.stops[0].from._id;
//       const arrival_station = ticket.stops[0].to._id;
//       const departure_station_label = ticket.stops[0].from.name;
//       const arrival_station_label = ticket.stops[0].to.name;
//       const ticketTotal = isReturn ? returnTotal : outboundTotal;

//       const payload: BookingPayload = {
//         passengers,
//         travel_flex: selectedFlex,
//         payment_intent_id: paymentIntentId,
//         platform: "mobile",
//         flex_price: isReturn ? 0 : flexPrice,
//         total_price: ticketTotal + (isReturn ? 0 : flexPrice),
//         operator_price: operatorTotalPrice,
//         departure_station,
//         arrival_station,
//         departure_station_label,
//         arrival_station_label,
//         is_using_deposited_money: useDeposit,
//         deposit_spent: isReturn ? 0 : depositAmount * 100 || 0,
//         stop: ticket.stops[0],
//         is_return: isReturn,
//       };

//       try {
//         const response = await axios.post<{ data: any }>(
//           `${environment.apiurl}/booking/create/${ticket.operator}/${null}/${ticket._id}`,
//           payload
//         );

//         if (typeof global !== "undefined") {
//           const savedBookings = await AsyncStorage.getItem("noUserBookings");
//           const parsedBookings = savedBookings ? JSON.parse(savedBookings) : [];
//           const newBooking = response.data.data;
//           await AsyncStorage.setItem(
//             "noUserBookings",
//             JSON.stringify([...parsedBookings, newBooking])
//           );
//         }

//         return response.data.data;
//       } catch (error) {
//         throw new Error("Failed to create booking");
//       }
//     };

//     const createBookings = async (paymentIntentId: string) => {
//       const bookings = [];

//       if (outboundTicket) {
//         const outboundBooking = await createBooking({
//           ticket: outboundTicket,
//           isReturn: false,
//           paymentIntentId,
//         });
//         bookings.push(outboundBooking);
//       }

//       if (returnTicket) {
//         const returnBooking = await createBooking({
//           ticket: returnTicket,
//           isReturn: true,
//           paymentIntentId,
//         });
//         bookings.push(returnBooking);
//       }

//       return bookings;
//     };

//     const handlePayment = async (): Promise<void> => {
//       if (!stripe || !cardDetails?.complete) {
//         Alert.alert("Something went wrong, please try again!");
//         return;
//       }

//       setLoading(true);

//       try {
//         const res = await axios.post<{ data: { clientSecret: string } }>(
//           `${environment.apiurl}/payment/create-payment-intent`,
//           { passengers, amount_in_cents: finalPrice * 100 }
//         );

//         const { clientSecret } = res.data.data;
//         const { error: confirmError, paymentIntent } = await stripe.confirmPayment(
//           clientSecret,
//           { paymentMethodType: "Card" }
//         );

//         if (confirmError) {
//           Alert.alert("error", confirmError.message || "Errori gjenerik");
//         } else if (paymentIntent?.status === "Succeeded") {
//           await createBookings(paymentIntent.id);
//           router.push("/checkout/success");
//         }
//       } catch (err: any) {
//         Alert.alert("Errorski", err.response?.data?.message || "Errori gjenerik");
//       } finally {
//         setLoading(false);
//         resetCheckout();
//       }
//     };

//     const handleFullDepositPayment = async (): Promise<void> => {
//       setLoading(true);

//       try {
//         await createBookings("full_deposit_payment");
//         resetCheckout();
//         router.push("/checkout/success");
//       } catch (error: any) {
//         Alert.alert(
//           "Errorski",
//           error.response?.data?.message || "Errori gjenerik"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     return (
//       <PaymentContext.Provider
//         value={{
//           loading,
//           cardDetails,
//           handlePayment,
//           handleFullDepositPayment,
//           setCardDetails,
//         }}
//       >
//         {children}
//       </PaymentContext.Provider>
//     );
//   };

//   export const usePayment = (): PaymentContextValue => {
//     const context = useContext(PaymentContext);
//     if (context === undefined) {
//       throw new Error('usePayment must be used within a PaymentProvider');
//     }
//     return context;
//   };

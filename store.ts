import { create } from 'zustand';
import { Ticket } from './models/ticket';
import { addDays, format } from 'date-fns';
import { createJSONStorage, persist, PersistOptions } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardFieldInput, CardFormView } from '@stripe/stripe-react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export interface PassengerData {
    full_name: string;
    email: string;
    phone: string;
    birthdate: string;
    age: number;
    price: number;
}

export interface Passengers {
    adults: number;
    children: number;
}

interface PaymentSuccessStore {
    isPaymentSuccess: boolean;
    setIsPaymentSuccess: (success: boolean) => void;
}

export const usePaymentSuccessStore = create<PaymentSuccessStore>((set) => ({
    isPaymentSuccess: false,
    setIsPaymentSuccess: (success: boolean) => set({ isPaymentSuccess: success }),
}));

interface CheckoutState {
    selectedTicket: Ticket | null;
    outboundTicket: Ticket | null;
    returnTicket: Ticket | null;
    isSelectingReturn: boolean;
    passengers: any[];
    selectedFlex: any;
    flexPrice: number;
    totalCost: number;
    cardDetails: CardFormView.Details | CardFieldInput.Details | null; // Updated type

    setSelectedTicket: (ticket: any) => void;
    setOutboundTicket: (ticket: any) => void;
    setReturnTicket: (ticket: any) => void;
    setIsSelectingReturn: (isSelecting: boolean) => void;
    setPassengers: (passengers: any[]) => void;
    setSelectedFlex: (flex: any) => void;
    setFlexPrice: (price: number) => void;
    setCardDetails: (details: CardFormView.Details | CardFieldInput.Details | null) => void; // Updated type
    calculateTotalCost: () => void;
    resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
    persist(
        (set, get) => ({
            selectedTicket: null,
            outboundTicket: null,
            returnTicket: null,
            isSelectingReturn: false,
            passengers: [],
            selectedFlex: null,
            flexPrice: 0,
            totalCost: 0,
            cardDetails: null,

            setSelectedTicket: (ticket) => set({ selectedTicket: ticket }),
            setOutboundTicket: (ticket) => set({ outboundTicket: ticket }),
            setReturnTicket: (ticket) => set({ returnTicket: ticket }),
            setIsSelectingReturn: (isSelecting) => {
                set((state) => ({
                    isSelectingReturn: isSelecting,
                    returnTicket: isSelecting ? state.returnTicket : null
                }));
            },
            setPassengers: (passengers) => set({ passengers }),
            setSelectedFlex: (flex) => set({ selectedFlex: flex }),
            setFlexPrice: (price) => set({ flexPrice: price }),
            setCardDetails: (details) => {
                if (details?.complete) {
                  set({ cardDetails: details });
                } else {
                  set({ cardDetails: null }); // Reset if card is incomplete or invalid
                }
              }
,              

            calculateTotalCost: () => {
                const { passengers, flexPrice } = get();
                set({ totalCost: passengers.length * flexPrice });
            },

            resetCheckout: () => set({
                selectedTicket: null,
                outboundTicket: null,
                returnTicket: null,
                isSelectingReturn: false,
                passengers: [],
                selectedFlex: null,
                flexPrice: 0,
                totalCost: 0,
                cardDetails: null,
            }),
        }),
        {
            name: 'checkout-storage',
            storage: createJSONStorage(() => AsyncStorage), 
        } as PersistOptions<CheckoutState>
    )
);

interface SearchState {
    from: string;
    fromCity: string;
    to: string;
    toCity: string;
    route: string;
    passengers: Passengers;
    departureDate: string | null;
    returnDate: string | null;
    tripType: 'one-way' | 'round-trip'; 
    swapLocations: () => void; 
    setFrom: (from: string) => void;
    setTo: (to: string) => void;
    setFromCity: (fromCity: string) => void;
    setToCity: (toCity: string) => void;
    setRoute: (route: string) => void;
    setPassengers: (passengers: Passengers) => void;
    setDepartureDate: (date: string | null) => void;
    setReturnDate: (returnDate: string | null) => void;
    setTripType: (tripType: 'one-way' | 'round-trip') => void; 
    resetSearch: () => void;
}

const initialState: Omit<SearchState,'swapLocations'| 'setFrom' | 'setTo' | 'setFromCity' | 'setToCity' | 'setRoute' | 'setPassengers' | 'setDepartureDate' | 'setReturnDate' | 'setTripType' | 'resetSearch'> = {
    from: '',
    to: '',
    fromCity: '',
    toCity: '',
    route: '',
    passengers: {
        adults: 1,
        children: 0,
    },
    departureDate: format(new Date(), "dd-MM-yyyy"),
    // returnDate: format(addDays(new Date(), 7), "dd-MM-yyyy"),
    returnDate: null,
    tripType: 'one-way', 
};

const useSearchStore = create<SearchState>()(
    persist(
        (set) => ({
            ...initialState,
            setFrom: (from) => set({ from }),
            setTo: (to) => set({ to }),
            setFromCity: (fromCity) => set({ fromCity }),
            setToCity: (toCity) => set({ toCity }),
            setRoute: (route) => set({ route }),
            setPassengers: (passengers) => set({ passengers }),
            setDepartureDate: (departureDate) => set({ departureDate }),
            setReturnDate: (returnDate) => set({ returnDate }),
            setTripType: (tripType) => set({ tripType }),
            swapLocations: () => set((state) => ({
                from: state.to,
                to: state.from,
                fromCity: state.toCity,
                toCity: state.fromCity,
            })),
            resetSearch: () => set((state) => ({
                from: state.from || initialState.from,
                to: state.to || initialState.to,
                fromCity: state.fromCity || initialState.fromCity,
                toCity: state.toCity || initialState.toCity,
                route: state.route || initialState.route,
                passengers: state.passengers || initialState.passengers, 
                departureDate: state.departureDate || initialState.departureDate,
                returnDate: state.returnDate || initialState.returnDate,
                tripType: state.tripType || initialState.tripType, 
            })),
        }),
        {
            name: 'search-store',
            storage: createJSONStorage(() => AsyncStorage), 
        } as PersistOptions<SearchState>
    )
);

interface ILoading {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

export const useLoadingStore = create<ILoading>((set) => ({
    isLoading: true,
    setIsLoading: (isLoading) => set({ isLoading }),
}));



export default useSearchStore;

import { Ticket } from "@/models/ticket";

export interface PassengerData {
    full_name: string;
    email: string;
    phone: string;
    birthdate: string;
    age: number;
    price: number;
  }
  


  export const calculatePassengerPrices = (
    passengers: PassengerData[],
    selectedTicket: Ticket,
    max_child_age: number = 10
  ) => {
    if (!selectedTicket || !selectedTicket.stops || selectedTicket.stops.length === 0) {
      throw new Error("Invalid ticket data.");
    }
  
    const childPrice = selectedTicket.stops[0].other_prices.our_children_price;
    const adultPrice = selectedTicket.stops[0].other_prices.our_price;
  
    return passengers.map(passenger => ({
      ...passenger,
      price: passenger.age <= max_child_age ? childPrice : adultPrice,
    }));
  };
  
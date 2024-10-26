import { Station } from "./station";

export interface Stop {
    _id:string;
    from: Station;
    to: Station;
    time: string;
    departure_date: Date;
    price: number;
    children_price: number;
    other_prices: {
        our_price: number;
        our_children_price: number;
    },
    max_buying_time: string;
    arrival_time: Date;
    days_of_week: string[];
    views: number;
}

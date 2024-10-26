import { Agency } from "./agency";
import { Charge } from "./charge";
import { Operator } from "./operator";
import { Passenger } from "./passenger";
import { Route } from "./route";
import { Station } from "./station";
import { Ticket } from "./ticket";
import { User } from "./user";

export interface Booking {
    _id: string;
    user: User | string;
    ticket: Ticket | string;
    route: Route | string;
    agency: Agency | string;
    departure_date: Date;
    operator:Operator;
    destinations: {
        departure_station: Station | string;
        arrival_station: Station | string;
        departure_station_label: string;
        arrival_station_label: string;
    },
    labels: {
        from_city: string;
        to_city: string;
    },
    passengers: Passenger[];
    location: {
        from: {
            lat: number;
            lng: number;
        },
        to: {
            lat: number;
            lng: number;
        },
    },
    price: number;
    platform: Platforms;
    is_paid: boolean;
    metadata: BookingMetadata;
    charge?: Charge;
}

export interface BookingMetadata {
    transaction_id?: string;
    payment_intent_id: string;
    travel_flex: Flex;
    deposited_money: {
        used: boolean;
        amount_in_cents: number;
    }
}


export enum Platforms {
    IOS = "ios",
    ANDROID = "android",
    WEB = "web",
}

export enum Flex {
    PREMIUM = "premium",
    BASIC = "basic",
    NO_FLEX = "no_flex",
}

export class TravelFlexPermissions {
    static PREMIUM: { CAN_CANCEL: number; CAN_EDIT: number; SUPPORT: number, RESCHEDULE: number } = {
        CAN_CANCEL: 2,
        CAN_EDIT: 1,
        RESCHEDULE: 3,
        SUPPORT: Infinity
    };

    static BASIC: { CAN_CANCEL: number; CAN_EDIT: number; SUPPORT: number, RESCHEDULE: number } = {
        CAN_CANCEL: 5,
        CAN_EDIT: 3,
        RESCHEDULE: 0,
        SUPPORT: Infinity
    };

    static NO_FLEX: { CAN_CANCEL: number; CAN_EDIT: number; SUPPORT: number, RESCHEDULE: number } = {
        CAN_CANCEL: 0,
        CAN_EDIT: 0,
        RESCHEDULE: 0,
        SUPPORT: Infinity
    };
}
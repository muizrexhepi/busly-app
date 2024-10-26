import { Operator } from "./operator";
import { Station } from "./station";

export interface Route {
    _id?: string;
    code: string;
    contact: {
        phone: string;
        email: string;
    },
    destination: {
        from: string,
        to: string,
    },
    stations: {
        from: Station ;
        to: Station ;
    },
    operator: Operator | string;
    luggages: {
        free: number;
        price_for_extra: number;
        size: string;
    },
    is_active: boolean;
    generate_tickets_automatically: boolean;
    metadata: {
        sold: number;
    },
}
import { Otp } from "./operator";

export interface User {
    name: string;
    email: string;
    otp: Otp;
    fcm_token: string;
    points: number;
};
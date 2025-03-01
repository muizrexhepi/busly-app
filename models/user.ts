import { Otp } from "./operator";

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  otp: {
    code: string;
    valid_until: Date;
  };
  fcm_token?: string;
  points?: number;
  balance_in_cents?: number;
  identity_token?: string;
  appwrite_id?: string;
  stripe_customer_id?: string;
  stripe_payment_method_ids: string[];
}

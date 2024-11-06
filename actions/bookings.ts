import { environment } from "@/environment";
import { Booking } from "@/models/booking";
import axios from "axios";


export const getBookingsByOperatorId = async (operator_id: string, select?: string) => {
    try {
        const res = await axios.get(`${environment.apiurl}/booking/operator/${operator_id}`);
        console.log(res.data.data);
        return res?.data?.data as Booking[];
    } catch (error) {
        console.log(error);
        // throw new Error("Error fetching bookings");
    }
};
export const getBookingById = async (booking_id:string|string[]) => {
    try {
        const res = await axios.get(`${environment.apiurl}/booking/client/${booking_id}`);
        console.log({bookingbyid:res.data.data});
        return res?.data?.data as Booking;
    } catch (error) {
        console.log(error);
        // throw new Error("Error fetching bookings");
    }
};

export const getBookingByIdWithChargeData = async (booking_id: string|string[], noCache?: boolean) => {
    try {
        console.log({noCache})
        const url = noCache ? `${environment.apiurl}/booking/operator/with_charge/${booking_id}?cache=false` : `${environment.apiurl}/booking/operator/with_charge/${booking_id}`
        const res = await axios.get(url);
        console.log(res.data.data);
        return res?.data?.data as Booking;
    } catch (error) {
        console.log(error);
    }
};
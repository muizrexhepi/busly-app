import { CompanyMetadata, Operator, Otp } from "./operator";

export interface Agency {
    name: string;
    email: string;
    operator: Operator | string;
    role: string;
    address: {
        city: string;
        country: string;
        street: string;
    },
    contact: {
        phone: string;
        contact_email: string;
    },
    financial_data: AgencyFinancialData;
    is_active: boolean;
    is_applicant: boolean;
    company_metadata: CompanyMetadata;
    otp: Otp;
}

export interface AgencyFinancialData {
    percentage: number;
    total_sales: number;
    profit: number;
    debt: number;
}
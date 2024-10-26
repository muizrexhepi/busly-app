export interface Operator {
    _id:string;
    name: string;
    email: string;
    otp: Otp;
    role: OperatorRoles;
    fcm_token: string;
    max_child_age: number;
    notification_permissions: {
        allow_portal_notifications: boolean;
        not_enough_seats: number;
    },
    confirmation: {
        is_confirmed: boolean;
        message: string;
    },
    company_metadata: CompanyMetadata;
    createdAt:string;
    updatedAt:string;
}



export enum OperatorRoles {
    OPERATOR = "operator",
    EMPLOYEE = "employee",
}

export interface Otp {
    code: string;
    valid_until: Date;
}

export interface CompanyMetadata {
    tax_number: string;
    registration_number: string;
    name: string;
    email: string;
    phone: string;
    country: string;
}

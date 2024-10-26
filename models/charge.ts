export interface Charge {
    id: string;
    amount: number;
    amount_captured: number;
    balance_transaction: string;
    captured: boolean;
    currency: string;
    outcome: {
        network_status: string;
        reason: string | null;
        risk_level: string;
        risk_score: number;
        seller_message: string;
        type: string;
    };
    payment_intent: string;
    payment_method: string;
    payment_method_details: {
        card: {
            amount_authorized: number;
            authorization_code: string | null;
            brand: string;
            checks: {
                address_line1_check: string | null;
                address_postal_code_check: string | null;
                cvc_check: string;
            };
            country: string;
            exp_month: number;
            exp_year: number;
            extended_authorization: {
                status: string;
            };
            fingerprint: string;
            funding: string;
            incremental_authorization: {
                status: string;
            };
            installments: null;
            last4: string;
            mandate: null;
            multicapture: {
                status: string;
            };
            network: string;
            network_token: {
                used: boolean;
            };
            overcapture: {
                maximum_amount_capturable: number;
                status: string;
            };
            three_d_secure: null;
            wallet: null;
        };
        type: string;
    };
    receipt_url: string;
    refunded: boolean;
}


export type PaymentHistory = {
    key: number,
    id: number,
    payment_id: number,
    amount: number;
    payment_method: string;
    payment_proof: string | null;
    payment_received_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export type Payment = {
    key: number,
    id: number,
    amount: number;
    donor_type: string;
    pan_number: string | null;
    payment_history?: PaymentHistory[];
    created_at: string;
    updated_at: string;
}

export type PaymentsDataState = {
    totalPayments: number,
    groups: Record<string, Payment>
}
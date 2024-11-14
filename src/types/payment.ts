
export type Payment = {
    key: number,
    id: number,
    amount: number;
    payment_method: string;
    payment_proof: string | null;
    payment_received_date: string | null;
    pan_number: string | null;
    created_at: string;
    updated_at: string;
}

export type PaymentsDataState = {
    totalPayments: number,
    groups: Record<string, Payment>
}
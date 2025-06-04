
export type PaymentHistory = {
    key: number,
    id: number,
    payment_id: number,
    amount: number;
    payment_method: string;
    payment_proof: string | null;
    payment_date: string;
    amount_received: number;
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
    consent: boolean;
    payment_history?: PaymentHistory[];
    razorpay_history?: RazorpayHistory[];
    order_id: string | null;
    created_at: string;
    updated_at: string;
}

export type RazorpayHistory = {
    transaction_id?: string;
    status: string;
    method: string;
    amount: number;
    fee: number;
    created_at: string;
  };
  

export type PaymentsDataState = {
    totalPayments: number,
    groups: Record<string, Payment>
}
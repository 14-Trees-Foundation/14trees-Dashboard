import { User } from "../../../../../../types/user";
import { Group } from "../../../../../../types/Group";
import { GiftCard } from "../../../../../../types/gift_card";
import { Payment } from "../../../../../../types/payment";

export interface GiftCardsFormProps {
    loading: boolean;
    setLoading: (value: boolean) => void;
    giftCardRequest?: GiftCard;
    step?: number;
    requestId: string | null;
    loggedinUserId?: number;
    open: boolean;
    handleClose: () => void;
    onSubmit: (
        user: User,
        sponsor: User | null,
        createdByUser: User,
        group: Group | null,
        treeCount: number,
        category: string,
        grove: string | null,
        requestType: string,
        users: any[],
        giftedOn: string,
        paymentId?: number,
        logo?: string,
        messages?: any,
        file?: File
    ) => void;
}

export interface GiftCardFormMessages {
    primaryMessage: string;
    eventName: string;
    eventType: string | undefined;
    plantedBy: string;
    logoMessage: string;
}

export interface GiftCardFormState {
    currentStep: number;
    user: User | null;
    sponsor: User | null;
    createdBy: User | null;
    group: Group | null;
    treeCount: number;
    file: File | null;
    users: any[];
    logo: File | null;
    logoString: string | null;
    messages: GiftCardFormMessages;
    giftedOn: string;
    presentationId: string | null;
    slideId: string | null;
    category: string;
    giftRequestType: string;
    grove: string | null;
    consent: boolean;
    payment: Payment | null;
    amount: number;
    donorType: string;
    panNumber: string | null;
}

export interface GiftCardFormStep {
    key: number;
    title: string;
    content: React.ReactNode;
    onClick?: () => void;
    style?: React.CSSProperties;
}
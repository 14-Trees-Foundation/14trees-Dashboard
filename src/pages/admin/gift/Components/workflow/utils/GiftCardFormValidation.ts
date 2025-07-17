import { toast } from "react-toastify";
import { User } from "../../../../../../types/user";

export interface ValidationResult {
    isValid: boolean;
    errorMessage?: string;
    redirectStep?: number;
}

export const validateGiftCardForm = (
    user: User | null,
    sponsor: User | null,
    giftRequestType: string
): ValidationResult => {
    if (!user) {
        toast.error("Please select user to reserve trees");
        return {
            isValid: false,
            errorMessage: "Please select user to reserve trees",
            redirectStep: 3
        };
    }

    if (giftRequestType === 'Gift Cards' && !sponsor) {
        toast.error("Please select sponsor");
        return {
            isValid: false,
            errorMessage: "Please select sponsor",
            redirectStep: 3
        };
    }

    return { isValid: true };
};

export const getDefaultFormState = () => ({
    currentStep: 0,
    user: null,
    sponsor: null,
    createdBy: null,
    group: null,
    treeCount: 1,
    file: null,
    users: [],
    logo: null,
    logoString: null,
    messages: { 
        primaryMessage: "", 
        eventName: "", 
        eventType: undefined as string | undefined, 
        plantedBy: "", 
        logoMessage: "" 
    },
    giftedOn: new Date().toISOString().slice(0, 10),
    presentationId: null,
    slideId: null,
    category: "Public",
    giftRequestType: "Gift Cards",
    grove: null,
    consent: false,
    payment: null,
    amount: 0,
    donorType: "Indian Citizen",
    panNumber: null
});

export const calculateAmount = (
    treeCount: number, 
    category: string, 
    giftRequestType: string
): number => {
    return treeCount * (
        category === 'Foundation' ? 3000 : 
        giftRequestType === 'Normal Assignment' ? 1500 : 
        2000
    );
};
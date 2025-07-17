import { useState, useEffect } from "react";
import { GiftCard } from "../../../../../../types/gift_card";
import { User } from "../../../../../../types/user";
import { Group } from "../../../../../../types/Group";
import { Payment } from "../../../../../../types/payment";
import { GiftCardFormState, GiftCardFormMessages } from "../types/GiftCardFormTypes";
import { GiftCardService } from "../services/GiftCardService";
import { getDefaultFormState, calculateAmount } from "../utils/GiftCardFormValidation";
import { AWSUtils } from "../../../../../../helpers/aws";

export const useGiftCardForm = (
    giftCardRequest?: GiftCard,
    step?: number,
    requestId?: string | null,
    open?: boolean
) => {
    const [formState, setFormState] = useState<GiftCardFormState>(getDefaultFormState());
    const [formSteps, setFormSteps] = useState<any[]>([]);
    const giftCardService = new GiftCardService();

    // Update current step when props change
    useEffect(() => {
        if (giftCardRequest && step) {
            setFormState(prev => ({ ...prev, currentStep: step }));
        }
    }, [step, giftCardRequest]);

    // Calculate amount when relevant fields change
    useEffect(() => {
        const amount = calculateAmount(
            formState.treeCount,
            formState.category,
            formState.giftRequestType
        );
        setFormState(prev => ({ ...prev, amount }));
    }, [formState.giftRequestType, formState.category, formState.treeCount]);

    // Set default plantedBy when group or user changes but only if plantedBy is empty
    useEffect(() => {
        if (!formState.messages.plantedBy && (formState.group?.name || formState.user?.name)) {
            setFormState(prev => ({
                ...prev,
                messages: {
                    ...prev.messages,
                    plantedBy: formState.group?.name || formState.user?.name || ''
                }
            }));
        }
    }, [formState.group, formState.user]);

    // Update plantedBy when group changes (even if plantedBy already has a value)
    useEffect(() => {
        if (formState.group?.name) {
            setFormState(prev => ({
                ...prev,
                messages: {
                    ...prev.messages,
                    plantedBy: formState.group.name
                }
            }));
        }
    }, [formState.group]);

    // Upload logo to S3
    useEffect(() => {
        const uploadFile = async () => {
            if (formState.logo && requestId) {
                const awsUtils = new AWSUtils();
                const location = await awsUtils.uploadFileToS3('gift-request', formState.logo, requestId);
                setFormState(prev => ({ ...prev, logoString: location }));
            } else {
                setFormState(prev => ({ ...prev, logoString: null }));
            }
        };

        uploadFile();
    }, [formState.logo, requestId]);

    // Load gift card request details
    useEffect(() => {
        if (open && giftCardRequest) {
            const fetchData = async () => {
                try {
                    const details = await giftCardService.getGiftCardRequestDetails(giftCardRequest);
                    
                    setFormState(prev => ({
                        ...prev,
                        user: details.user,
                        sponsor: details.sponsor,
                        group: details.group,
                        users: details.users,
                        messages: details.messages,
                        treeCount: details.treeCount,
                        category: details.category,
                        grove: details.grove,
                        logoString: details.logoString,
                        giftedOn: details.giftedOn,
                        giftRequestType: details.giftRequestType,
                        payment: details.payment,
                        panNumber: details.panNumber,
                        consent: details.consent
                    }));

                    // Get creator user
                    if (giftCardRequest.created_by) {
                        const createdBy = await giftCardService.getCreatorUser(giftCardRequest.created_by);
                        setFormState(prev => ({ ...prev, createdBy }));
                    }
                } catch (error) {
                    console.error('Failed to load gift card request details:', error);
                }
            };

            fetchData();
        }
    }, [open, giftCardRequest]);

    // State update functions
    const updateFormState = (updates: Partial<GiftCardFormState>) => {
        setFormState(prev => ({ ...prev, ...updates }));
    };

    const updateMessages = (messages: GiftCardFormMessages) => {
        setFormState(prev => ({ ...prev, messages }));
    };

    const resetForm = () => {
        setFormState(getDefaultFormState());
    };

    const nextStep = () => {
        setFormState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    };

    const prevStep = () => {
        setFormState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    };

    const setCurrentStep = (step: number) => {
        setFormState(prev => ({ ...prev, currentStep: step }));
    };

    return {
        formState,
        formSteps,
        setFormSteps,
        updateFormState,
        updateMessages,
        resetForm,
        nextStep,
        prevStep,
        setCurrentStep,
        giftCardService
    };
};
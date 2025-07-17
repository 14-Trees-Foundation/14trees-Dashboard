import { GiftCardFormState } from "../types/GiftCardFormTypes";
import { GiftCardService } from "../services/GiftCardService";
import { validateGiftCardForm } from "../utils/GiftCardFormValidation";
import { User } from "../../../../../../types/user";
import { Group } from "../../../../../../types/Group";

interface SubmissionParams {
    formState: GiftCardFormState;
    giftCardService: GiftCardService;
    setLoading: (loading: boolean) => void;
    setCurrentStep: (step: number) => void;
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
    handleCloseForm: () => void;
}

export const handleGiftCardFormSubmission = async ({
    formState,
    giftCardService,
    setLoading,
    setCurrentStep,
    onSubmit,
    handleCloseForm
}: SubmissionParams): Promise<void> => {
    // Validate form
    const validation = validateGiftCardForm(
        formState.user,
        formState.sponsor,
        formState.giftRequestType
    );

    if (!validation.isValid) {
        if (validation.redirectStep !== undefined) {
            setCurrentStep(validation.redirectStep);
        }
        return;
    }

    setLoading(true);

    try {
        // Update group logo if changed
        if (formState.logoString && formState.group && formState.group.logo_url !== formState.logoString) {
            await giftCardService.updateGroup({ 
                ...formState.group, 
                logo_url: formState.logoString 
            });
        }

        // Handle payment
        let paymentId = formState.payment ? formState.payment.id : undefined;
        
        if (!formState.payment) {
            const payment = await giftCardService.createPayment(
                formState.amount,
                formState.donorType,
                formState.panNumber,
                formState.consent
            );
            paymentId = payment.id;
        } else {
            const paymentNeedsUpdate = 
                formState.payment.amount !== formState.amount ||
                formState.payment.pan_number !== formState.panNumber ||
                formState.payment.donor_type !== formState.donorType ||
                formState.payment.consent !== formState.consent;

            if (paymentNeedsUpdate) {
                const updatedPayment = {
                    ...formState.payment,
                    ...(formState.payment.amount !== formState.amount && { amount: formState.amount }),
                    ...(formState.payment.pan_number !== formState.panNumber && { pan_number: formState.panNumber }),
                    ...(formState.payment.donor_type !== formState.donorType && { donor_type: formState.donorType }),
                    ...(formState.payment.consent !== formState.consent && { consent: formState.consent })
                };

                await giftCardService.updatePayment(updatedPayment);
            }
        }

        // Prepare logo string
        let logoStr = formState.logoString ? formState.logoString : formState.group?.logo_url ?? undefined;
        if (!formState.group) logoStr = undefined;

        // Submit form
        onSubmit(
            formState.user!,
            formState.sponsor,
            formState.createdBy ?? formState.user!,
            formState.group,
            formState.treeCount,
            formState.category,
            formState.grove,
            formState.giftRequestType,
            formState.users,
            formState.giftedOn,
            paymentId,
            logoStr,
            formState.messages,
            formState.file ?? undefined
        );

        handleCloseForm();
    } catch (error) {
        console.error('Failed to submit gift card form:', error);
        setLoading(false);
    }
};
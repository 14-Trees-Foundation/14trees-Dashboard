import React from "react";
import { GiftCard } from "../../../../../../types/gift_card";
import { GiftCardFormState, GiftCardFormStep } from "../types/GiftCardFormTypes";
import PlantationInfo from "../PlantationInfo";
import PaymentForm from "../../../../../../components/payment/PaymentForm";
import { BulkUserForm } from "../UserDetails";
import SponsorDetailsForm from "../SponsorDetailsForm";
import CardDetails from "../CardDetailsForm";

interface CreateFormStepsProps {
    formState: GiftCardFormState;
    giftCardRequest?: GiftCard;
    requestId: string | null;
    updateFormState: (updates: Partial<GiftCardFormState>) => void;
    updateMessages: (messages: any) => void;
    setCurrentStep: (step: number) => void;
}

export const createFormSteps = ({
    formState,
    giftCardRequest,
    requestId,
    updateFormState,
    updateMessages,
    setCurrentStep
}: CreateFormStepsProps): GiftCardFormStep[] => {
    const steps: GiftCardFormStep[] = [
        {
            key: 0,
            title: "Plantation Info",
            content: (
                <PlantationInfo
                    treeCountDisabled={giftCardRequest !== undefined && giftCardRequest.status !== 'pending_plot_selection'}
                    treeCount={formState.treeCount}
                    onTreeCountChange={(count) => updateFormState({ treeCount: count })}
                    category={formState.category}
                    onCategoryChange={(category) => updateFormState({ category })}
                    messages={formState.messages}
                    onChange={updateMessages}
                    giftedOn={formState.giftedOn}
                    onGiftedOnChange={(date) => updateFormState({ giftedOn: date })}
                    requestType={formState.giftRequestType}
                    onRequestTypeChange={(requestType) => updateFormState({ giftRequestType: requestType })}
                />
            ),
            onClick: () => setCurrentStep(0),
            style: { cursor: 'pointer' }
        },
        {
            key: 1,
            title: "Payment",
            content: (
                <PaymentForm
                    indianDonor={true}
                    payment={formState.payment}
                    amount={formState.amount}
                    onPaymentChange={(payment) => updateFormState({ payment })}
                    onChange={(donorType: string, panNumber: string | null, consent: boolean) => 
                        updateFormState({ donorType, panNumber, consent })
                    }
                />
            ),
            onClick: () => setCurrentStep(1),
            style: { cursor: 'pointer' }
        },
        {
            key: 2,
            title: "Recipient Details",
            content: (
                <BulkUserForm 
                    treeCount={formState.treeCount} 
                    requestId={requestId} 
                    users={formState.users} 
                    onUsersChange={(users) => updateFormState({ users })} 
                    onFileChange={(file) => updateFormState({ file })} 
                    requestType={formState.giftRequestType}
                />
            ),
            onClick: () => setCurrentStep(2),
            style: { cursor: 'pointer' }
        },
        {
            key: 3,
            title: "Sponsor Details",
            content: (
                <SponsorDetailsForm 
                    requestType={formState.giftRequestType}
                    user={formState.user} 
                    onUserSelect={(user) => updateFormState({ user })} 
                    sponsor={formState.sponsor}
                    onSponsorSelect={(sponsor) => updateFormState({ sponsor })}
                    createdBy={formState.createdBy} 
                    onCreatedByUserSelect={(createdBy) => updateFormState({ createdBy })} 
                    logo={formState.logoString} 
                    onLogoChange={(logo) => {
                        updateFormState({ logo });
                        if (logo === null) updateFormState({ logoString: null });
                    }}
                    group={formState.group} 
                    onGroupSelect={(group) => { 
                        updateFormState({ group });
                        if (group?.logo_url) {
                            updateFormState({ logoString: group.logo_url });
                        }
                    }}
                />
            ),
            onClick: () => setCurrentStep(3),
            style: { cursor: 'pointer' }
        },
        {
            key: 4,
            title: "Tree Card Messages",
            content: (
                <CardDetails
                    request_id={requestId || ''}
                    presentationId={formState.presentationId}
                    slideId={formState.slideId}
                    logo_url={formState.logoString ? formState.logoString : giftCardRequest?.logo_url}
                    messages={formState.messages}
                    onChange={updateMessages}
                    onPresentationId={(presentationId: string, slideId: string) => 
                        updateFormState({ presentationId, slideId })
                    }
                    userName={formState.users.length > 0 ? formState.users[0].recipient_name : undefined}
                    assigneeName={formState.users.length > 0 ? formState.users[0].assignee_name : undefined}
                />
            ),
            onClick: () => setCurrentStep(4),
            style: { cursor: 'pointer' }
        }
    ];

    return steps;
};

export const filterStepsForRequestType = (steps: GiftCardFormStep[], giftRequestType: string): GiftCardFormStep[] => {
    const disabled = giftRequestType === 'Normal Assignment' || giftRequestType === 'Visit';
    
    return steps.slice(0, disabled ? -1 : undefined).map(step => {
        return step.key === 1
            ? { ...step, onClick: disabled ? undefined : () => step.onClick?.() }
            : step;
    });
};
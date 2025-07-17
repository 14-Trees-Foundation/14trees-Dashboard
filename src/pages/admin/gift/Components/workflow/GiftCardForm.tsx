import React, { useEffect } from "react";
import { Button, Dialog, DialogTitle } from "@mui/material";
import { Steps } from "antd";
import { LoadingButton } from "@mui/lab";
import { GiftCardsFormProps } from "./types/GiftCardFormTypes";
import { useGiftCardForm } from "./hooks/useGiftCardForm";
import { createFormSteps, filterStepsForRequestType } from "./config/GiftCardFormSteps";
import { handleGiftCardFormSubmission } from "./handlers/GiftCardFormSubmission";
import { getDefaultFormState } from "./utils/GiftCardFormValidation";

const GiftCardsForm: React.FC<GiftCardsFormProps> = ({
    loading,
    setLoading,
    step,
    loggedinUserId,
    giftCardRequest,
    requestId,
    open,
    handleClose,
    onSubmit
}) => {
    const {
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
    } = useGiftCardForm(giftCardRequest, step, requestId, open);

    // Create and filter form steps
    useEffect(() => {
        const steps = createFormSteps({
            formState,
            giftCardRequest,
            requestId,
            updateFormState,
            updateMessages,
            setCurrentStep
        });

        const filteredSteps = filterStepsForRequestType(steps, formState.giftRequestType);
        setFormSteps(filteredSteps);
    }, [
        formState.giftRequestType,
        formState.treeCount,
        formState.category,
        formState.messages,
        formState.giftedOn,
        formState.payment,
        formState.amount,
        formState.users,
        formState.user,
        formState.sponsor,
        formState.createdBy,
        formState.logoString,
        formState.group,
        formState.presentationId,
        formState.slideId,
        giftCardRequest,
        requestId
    ]);

    const handleCloseForm = () => {
        handleClose();
        resetForm();
    };

    const handleSubmit = async () => {
        await handleGiftCardFormSubmission({
            formState,
            giftCardService,
            setLoading,
            setCurrentStep,
            onSubmit,
            handleCloseForm
        });
    };

    const isLastStep = formState.currentStep === formSteps.length - 1;
    const isFirstStep = formState.currentStep === 0;

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="lg"
                PaperProps={{
                    style: {
                        minHeight: '80vh',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                    },
                }}
            >
                <DialogTitle>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Gift Card Request</span>
                        <Button onClick={handleClose} color="inherit">
                            ✕
                        </Button>
                    </div>
                </DialogTitle>

                <div style={{ padding: '20px', overflow: 'auto', maxHeight: 'calc(90vh - 140px)' }}>
                    <Steps current={formState.currentStep} items={formSteps} />

                    <div style={{ marginTop: '20px', minHeight: '400px', overflow: 'hidden' }}>
                        {formSteps[formState.currentStep]?.content}
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            {!isFirstStep && (
                                <Button onClick={prevStep} style={{ marginRight: '8px' }}>
                                    Previous
                                </Button>
                            )}
                        </div>
                        <div>
                            {!isLastStep && (
                                <Button type="primary" onClick={nextStep}>
                                    Next
                                </Button>
                            )}
                            {isLastStep && (
                                <LoadingButton
                                    loading={loading}
                                    variant="contained"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </LoadingButton>
                            )}
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default GiftCardsForm;
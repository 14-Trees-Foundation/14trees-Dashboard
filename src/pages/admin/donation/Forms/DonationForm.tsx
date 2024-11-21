import React, { useEffect, useState } from "react";
import { User } from "../../../../types/user";
import { toast } from "react-toastify";
import { Button, Dialog, DialogTitle } from "@mui/material";
import { Steps } from "antd";
import DonorUserForm from "./DonorUserForm";
import TreePlantationForm from "./TreePlantationForm";
import PaymentForm from "./PaymentForm";

interface DonationFormProps {
    open: boolean
    handleClose: () => void
}

const DonationForm: React.FC<DonationFormProps> = ({ open, handleClose }) => {

    const [currentStep, setCurrentStep] = useState(0);
    const [user, setUser] = useState<User | null>(null);
    const [category, setCategory] = useState<string>('Foundation');
    const [grove, setGrove] = useState<string | null>(null);
    const [pledged, setPledged] = useState<number>(14);
    const [userVisit, setUserVisit] = useState(true);
    const [donorType, setDonorType] = useState<string>("Indian Citizen");
    const [paymentMethod, setPaymentMethod] = useState<string>("UPI");
    const [panNumber, setPanNumber] = useState<string | null>(null);

    const steps = [
        {
            key: 0,
            title: "Donor Details",
            content: <DonorUserForm user={user} onSelect={user => setUser(user)} />,
        },
        {
            key: 1,
            title: "Tree Plantation",
            content: <TreePlantationForm 
                category={category}
                grove={grove}
                pledged={pledged}
                userVisit={userVisit}
                onCategoryChange={category => setCategory(category) }
                onGroveChange={grove => setGrove(grove) }
                onPledgedChange={pledged => setPledged(pledged) }
                onUserVisitChange={userVisit => setUserVisit(userVisit) }
            />,
        },
        {
            key: 2,
            title: "Payment Details",
            content: <PaymentForm 
                donorType={donorType}
                paymentMethod={paymentMethod}
                panNumber={panNumber}
                onDonorTypeChange={donorType => { setDonorType(donorType) }}
                onPaymentMethodChange={paymentMethod => { setPaymentMethod(paymentMethod) }}
                onPanNumberChange={panNumber => { setPanNumber(panNumber) }}
            />,
        },
    ]

    const handleSubmit = () => {

        handleCloseForm();
    }

    const handleCloseForm = () => {
        handleClose();
    }

    const handleNext = () => {
        let nextStep = currentStep;
        switch (currentStep) {
            case 0:
                if (!user) toast.error("Please provide donor details");
                else nextStep = 1;
                break;
            case 1:
                nextStep = 2;
                break;
            case 2:
                nextStep = 3;
                break;
            default:
                break;
        }

        setCurrentStep(nextStep);
    }


    return (
        <div>
            <Dialog
                open={open}
                fullWidth
                maxWidth='xl'
            >
                <DialogTitle style={{ textAlign: "center" }}>Donations</DialogTitle>
                {currentStep < steps.length && (
                    <>
                        <div
                            style={{
                                padding: "0 40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Steps
                                current={currentStep}
                                items={steps}
                                style={{ display: "flex", alignItems: "center" }}
                            />
                        </div>
                    </>
                )}

                {steps.map((step, index) => (
                    <div hidden={currentStep !== index}>
                        <div
                            style={{
                                padding: 10,
                                margin: 10,
                                marginTop: 40,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            {step.content}
                        </div>
                    </div>
                ))}

                <div style={{
                    padding: "10px 40px",
                    margin: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    {currentStep > 0 && <Button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        variant="outlined"
                        color="success"
                    >Previous</Button>}
                    <div style={{ display: 'flex', flexGrow: 1 }}></div>

                    <Button
                        onClick={handleCloseForm}
                        variant="outlined"
                        color="error"
                        style={{ alignSelf: 'right', marginRight: 10 }}
                    >Cancel</Button>
                    {currentStep < steps.length - 1 && <Button
                        onClick={handleNext}
                        variant="contained"
                        color="success"
                        style={{ alignSelf: 'right' }}
                    >Next</Button>}

                    {currentStep === steps.length - 1 && <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="success"
                        style={{ alignSelf: 'right' }}
                    >Finish</Button>}
                </div>
            </Dialog>
        </div>
    );
}

export default DonationForm;
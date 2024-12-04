import React, { useEffect, useState } from "react";
import { User } from "../../../../types/user";
import { toast } from "react-toastify";
import { Button, Dialog, DialogTitle } from "@mui/material";
import { Steps } from "antd";
import DonorUserForm from "./DonorUserForm";
import TreePlantationForm from "./TreePlantationForm";
import DonorGroupForm from "./DonorGroupForm";
import { Group } from "../../../../types/Group";
import PaymentForm from "../../../../components/payment/PaymentForm";
import { Payment } from "../../../../types/payment";
import { BulkUserForm } from "./UserDetails";
import ApiClient from "../../../../api/apiClient/apiClient";
import { AWSUtils } from "../../../../helpers/aws";
import { Donation } from "../../../../types/donation";
import DonorPreferencesFrom from "./DonorPreferencesForm";

interface DonationFormProps {
    donation: Donation | null,
    open: boolean
    requestId: string | null
    handleClose: () => void
    onSubmit: (user: User, group: Group | null, pledged: number | null, pledgedArea: number | null, category: string, grove: string | null, preference: string, eventName: string, alternateEmail: string, users: any[], paymentId?: number, logo?: string | null) => void
}

const DonationForm: React.FC<DonationFormProps> = ({ donation, open, requestId, handleClose, onSubmit }) => {

    const [currentStep, setCurrentStep] = useState(0);
    const [user, setUser] = useState<User | null>(null);
    const [category, setCategory] = useState<string>('Foundation');
    const [grove, setGrove] = useState<string | null>(null);
    const [pledged, setPledged] = useState<number>(14);
    const [pledgedArea, setPledgedArea] = useState<number>(1);
    const [pledgedType, setPledgedType] = useState<"trees" | "acres">("trees");
    const [userVisit, setUserVisit] = useState(true);
    const [donorType, setDonorType] = useState<string>("Indian Citizen");
    const [panNumber, setPanNumber] = useState<string | null>(null);
    const [group, setGroup] = useState<Group | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [logo, setLogo] = useState<File | null>(null);
    const [logoString, setLogoString] = useState<string | null>(null);
    const [payment, setPayment] = useState<Payment | null>(null);
    const [preference, setPreference] = useState<string>('');
    const [eventName, setEventName] = useState<string>('');
    const [alternateEmail, setAlternateEmail] = useState<string>('');

    useEffect(() => {
        const uploadFile = async () => {
            if (logo && requestId) {
                const awsUtils = new AWSUtils();
                const location = await awsUtils.uploadFileToS3('gift-request', logo, requestId);
                setLogoString(location);
            } else {
                setLogoString(null);
            }
        }

        uploadFile();
    }, [logo, requestId])

    const getGiftCardRequestDetails = async () => {
        const apiClient = new ApiClient();
        if (donation) {
            const userResp = await apiClient.getUsers(0, 1, [{ columnField: 'id', operatorValue: 'equals', value: donation.user_id }]);
            if (userResp.results.length === 1) setUser(userResp.results[0]);

            const groupResp = await apiClient.getGroups(0, 1, [{ columnField: 'id', operatorValue: 'equals', value: donation.group_id }]);
            if (groupResp.results.length === 1) setGroup(groupResp.results[0]);

            setCategory(donation.category);
            setGrove(donation.grove);
            setPledged(donation.pledged || 0);
            setPledgedArea(donation.pledged_area || 0);
            setPledgedType(donation.pledged ? "trees" : "acres")

            if (donation.payment_id) {
                const payment = await apiClient.getPayment(donation.payment_id);
                setPayment(payment);

                setPanNumber(payment.pan_number);
            }
        }
    }

    useEffect(() => {
        if (open) getGiftCardRequestDetails();
    }, [open, donation])

    const steps = [
        {
            key: 0,
            title: "Donor Details",
            content: <DonorUserForm user={user} onSelect={user => setUser(user)} />,
        },
        {
            key: 1,
            title: "Corporate Details",
            content: <DonorGroupForm
                group={group}
                onSelect={group => { setGroup(group); }}
                logo={logo ?? logoString}
                onLogoChange={file => { setLogo(file); }}
            />,
        },
        {
            key: 2,
            title: "Tree Plantation",
            content: <TreePlantationForm
                category={category}
                grove={grove}
                pledged={pledged}
                pledgedArea={pledgedArea}
                pledgedType={pledgedType}
                onCategoryChange={category => setCategory(category)}
                onGroveChange={grove => setGrove(grove)}
                onPledgedChange={(type: "trees" | "acres", pledged: number) => {
                    setPledgedType(type);
                    type === "acres" ? setPledgedArea(pledged) : setPledged(pledged);
                }}
            />,
        },
        {
            key: 3,
            title: "Preferences",
            content: <DonorPreferencesFrom
                eventName={eventName}
                alternateEmail={alternateEmail}
                preference={preference}
                onPreferenceChange={preference => { setPreference(preference); }}
                onEventNameChange={eventName => { setEventName(eventName); }}
                onAlternateEmailChange={email => { setAlternateEmail(email); }}
            />,
        },
        {
            key: 4,
            title: "Payment Details",
            content: <PaymentForm
                amount={pledged * (category === "Foundation" ? 3000 : 1500)}
                onChange={(donorType: string, panNumber: string | null) => { setDonorType(donorType); setPanNumber(panNumber); }}
                onPaymentChange={payment => { setPayment(payment) }}
                payment={payment}
            />,
        },
        {
            key: 5,
            title: "Recipient Details",
            content: <BulkUserForm
                users={users}
                onUsersChange={users => { setUsers(users) }}
                requestId={''}
                onFileChange={file => { setFile(file) }}
                treeCount={pledged}
            />,
        },
    ]

    const handleSubmit = async () => {
        if (!user) return;
        handleClose();

        const apiClient = new ApiClient();
        const amount = pledged * (category === "Foundation" ? 3000 : 1500);
        let paymentId = payment ? payment.id : undefined
        if (!payment) {
            const payment = await apiClient.createPayment(amount, donorType, panNumber);
            paymentId = payment.id
        } else {
            const data = {
                ...payment,
            }

            if (payment.amount !== amount || payment.pan_number !== panNumber || payment.donor_type !== donorType) {
                if (payment.amount !== amount) data.amount = amount;
                if (payment.pan_number !== panNumber) data.pan_number = panNumber;
                if (payment.donor_type !== donorType) data.donor_type = donorType;

                await apiClient.updatedPayment(data);
            }
        }

        onSubmit(user, group, pledgedType === "trees" ? pledged : null, pledgedType === "acres" ? pledgedArea : null, category, grove, preference, eventName, alternateEmail, users, paymentId, logoString);

        handleCloseForm();
    }

    const handleCloseForm = () => {
        setCurrentStep(0);
        setUser(null);
        setGroup(null);
        setPanNumber(null);
        setCategory("Foundation");
        setFile(null);
        setLogo(null);
        setLogoString(null);
        setUsers([]);
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
            case 2:
            case 3:
            case 4:
                nextStep += 1;
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
import { Button, Dialog, DialogTitle } from "@mui/material";
import { Steps } from "antd";
import { FC, useEffect, useState } from "react";
import { User } from "../../../../types/user";
import { Group } from "../../../../types/Group";
import PlotSelection from "./CardCount";
import { BulkUserForm } from "./UserDetails";
import { toast } from "react-toastify";
import SponsorUserForm from "./SponsorUser";
import SponsorGroupForm from "./SponsorGroup";
import CardDetails from "./CardDetailsForm";
import { GiftCard } from "../../../../types/gift_card";
import ApiClient from "../../../../api/apiClient/apiClient";
import { AWSUtils } from "../../../../helpers/aws";
import PaymentForm from "../../../../components/payment/PaymentForm";
import { Payment } from "../../../../types/payment";

interface GiftCardsFormProps {
    giftCardRequest?: GiftCard
    requestId: string | null
    open: boolean
    handleClose: () => void
    onSubmit: (user: User, group: Group | null, treeCount: number, users: any[], paymentId?: number, logo?: File, messages?: any, file?: File) => void
}

const GiftCardsForm: FC<GiftCardsFormProps> = ({ giftCardRequest, requestId, open, handleClose, onSubmit }) => {

    const [currentStep, setCurrentStep] = useState(0);
    const [user, setUser] = useState<User | null>(null);
    const [group, setGroup] = useState<Group | null>(null);
    const [treeCount, setTreeCount] = useState<number>(100);
    const [file, setFile] = useState<File | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [logo, setLogo] = useState<File | null>(null);
    const [logoString, setLogoString] = useState<string | null>(null);
    const [messages, setMessages] = useState({ primaryMessage: "", secondaryMessage: "", eventName: "", eventType: undefined as string | undefined, plantedBy: "", logoMessage: "" });
    const [presentationId, setPresentationId] = useState<string | null>(null)
    const [slideId, setSlideId] = useState<string | null>(null)

    // payment details
    const [payment, setPayment] = useState<Payment | null>(null);
    const [donorType, setDonorType] = useState<string>("Indian Citizen");
    const [paymentMethod, setPaymentMethod] = useState<string>("UPI");
    const [panNumber, setPanNumber] = useState<string | null>(null);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [amount, setAmount] = useState<number>(0);

    const getGiftCardRequestDetails = async () => {
        const apiClient = new ApiClient();
        if (giftCardRequest) {
            const userResp = await apiClient.getUsers(0, 1, [{ columnField: 'id', operatorValue: 'equals', value: giftCardRequest.user_id }]);
            if (userResp.results.length === 1) setUser(userResp.results[0]);

            const groupResp = await apiClient.getGroups(0, 1, [{ columnField: 'id', operatorValue: 'equals', value: giftCardRequest.group_id }]);
            if (groupResp.results.length === 1) setGroup(groupResp.results[0]);

            const giftCards = await apiClient.getBookedGiftCards(giftCardRequest.id, 0, -1);
            const usersMap: Record<string, any> = {}
            for (const giftCard of giftCards.results) {
                if (giftCard.gifted_to && giftCard.assigned_to) {
                    const key = giftCard.gifted_to.toString() + "_" + giftCard.assigned_to.toString();
                    if (usersMap[key]) {
                        usersMap[key].count++;
                    } else {
                        usersMap[key] = {
                            key: key,
                            gifted_to_name: giftCard.gifted_to_name,
                            gifted_to_email: giftCard.gifted_to_email,
                            gifted_to_phone: giftCard.gifted_to_phone,
                            assigned_to_name: giftCard.assigned_to_name,
                            assigned_to_email: giftCard.assigned_to_email,
                            assigned_to_phone: giftCard.assigned_to_phone,
                            relation: giftCard.relation,
                            count: 1,
                            image: giftCard.profile_image_url ? true : undefined,
                            image_name: giftCard.profile_image_url ? giftCard.profile_image_url.split("/").slice(-1)[0] : undefined,
                            image_url: giftCard.profile_image_url,
                            editable: giftCard.tree_id ? false : true,
                        }
                    }
                }
            }

            setUsers(Object.values(usersMap));

            setTreeCount(giftCardRequest.no_of_cards);
            setMessages({
                primaryMessage: giftCardRequest.primary_message,
                secondaryMessage: giftCardRequest.secondary_message,
                eventName: giftCardRequest.event_name,
                plantedBy: giftCardRequest.planted_by,
                logoMessage: giftCardRequest.logo_message,
                eventType: giftCardRequest.event_type || undefined
            })

            if (giftCardRequest.payment_id) {
                const payment = await apiClient.getPayment(giftCardRequest.payment_id);
                setPayment(payment);

                setPanNumber(payment.pan_number);
            }
        }
    }

    useEffect(() => {
        if (open) getGiftCardRequestDetails();
    }, [open, giftCardRequest])

    useEffect(() => {
        const uploadFile = async () => {
            if (logo && requestId) {
                const awsUtils = new AWSUtils();
                const location = await awsUtils.uploadFileToS3(requestId, logo, 'gift-request');
                setLogoString(location);
            } else {
                setLogoString(null);
            }
        }

        uploadFile();
    }, [logo, requestId])

    const steps = [
        {
            key: 0,
            title: "Sponsor Details",
            content: <SponsorUserForm user={user} onSelect={user => setUser(user)} />,
        },
        {
            key: 1,
            title: "Corporate Details (Optional)",
            content: <SponsorGroupForm logo={logo ?? giftCardRequest?.logo_url ?? null} onLogoChange={logo => setLogo(logo)} group={group} onSelect={group => { setGroup(group);  setMessages(prev => ({ ...prev, plantedBy: group ? group.name : "" }))}} />,
        },
        {
            key: 2,
            title: "Book Trees",
            content: <PlotSelection disabled={giftCardRequest !== undefined && giftCardRequest.status !== 'pending_plot_selection'} treeCount={treeCount} onTreeCountChange={count => setTreeCount(count)} />,
        },
        {
            key: 3,
            title: "Payment",
            content: <PaymentForm
                treeCount={treeCount}
                donorType={donorType}
                paymentMethod={paymentMethod}
                panNumber={panNumber}
                paymentProof={paymentProof}
                onAmountChange={amount => { setAmount(amount)}}
                onDonorTypeChange={donorType => { setDonorType(donorType)}}
                onPanNumberChange={panNumber => { setPanNumber(panNumber)}}
                onPaymentMethodChange={paymentMethod => { setPaymentMethod(paymentMethod)}}
                onPaymentProofChange={paymentProof => { setPaymentProof(paymentProof)}}
            />,
        },
        {
            key: 4,
            title: "Gift Card Messages",
            content: <CardDetails
                request_id={requestId || ''}
                presentationId={presentationId}
                slideId={slideId}
                logo_url={logoString ? logoString : giftCardRequest?.logo_url}
                messages={{...messages, plantedBy: messages.plantedBy || group?.name || ''}}
                onChange={messages => { setMessages(messages) }}
                onPresentationId={(presentationId: string, slideId: string) => { setPresentationId(presentationId); setSlideId(slideId); }}
            />,
        },
        {
            key: 5,
            title: "User Details",
            content: <BulkUserForm requestId={requestId} users={users} onUsersChange={users => setUsers(users)} onFileChange={file => setFile(file)} />,
        },
    ]

    const handleSubmit = async () => {
        if (!user) {
            toast.error("Please select sponsor");
            setCurrentStep(0);
            return;
        }

        let paymentProofLink: string | null = null;
        if (paymentProof) {
            const awsUtils = new AWSUtils();
            const location = await awsUtils.uploadFileToS3("payment", paymentProof);
            if (location) paymentProofLink = location;
        }

        const apiClient = new ApiClient();
        let paymentId = payment ? payment.id : undefined
        if (!payment) {
            const payment = await apiClient.createPayment(amount, donorType, paymentMethod, panNumber, paymentProofLink);
            paymentId = payment.id
        } else {
            const data = {
                ...payment,
                amount: amount,
                pan_number: panNumber,
                payment_method: paymentMethod,
                payment_proof: paymentProofLink,
            }
            await apiClient.updatedPayment(data);
        }

        onSubmit(user, group, treeCount, users, paymentId, logo ?? undefined, messages, file ?? undefined);

        handleCloseForm();
    }

    const handleCloseForm = () => {
        handleClose();

        setCurrentStep(0);
        setUser(null);
        setGroup(null);
        setTreeCount(100);
        setFile(null);
        setUsers([]);
        setLogo(null);
        setMessages({ primaryMessage: "", secondaryMessage: "", eventName: "", plantedBy: "", logoMessage: "", eventType: undefined });
        setPresentationId(null);
        setSlideId(null);
    }

    const handleNext = () => {
        let nextStep = currentStep;
        switch (currentStep) {
            case 0:
                if (!user) toast.error("Please provide sponsor details");
                else nextStep = 1;
                break;
            case 1:
                nextStep = 2;
                break;
            case 2:
                if (treeCount === 0) toast.error("Please provide number of trees to gift");
                else nextStep = 3;
                break;
            case 3:
                nextStep = 4;
                break;
            case 4:
                if (messages.primaryMessage === "" || messages.secondaryMessage === "") toast.error("Please provide gift card details");
                else nextStep = 5;
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
                <DialogTitle style={{ textAlign: "center" }}>Gift Cards</DialogTitle>
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
};

export default GiftCardsForm;
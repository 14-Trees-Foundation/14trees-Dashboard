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
import DashboardDetails from "./DashboardDetailsForm";

interface GiftCardsFormProps {
    giftCardRequest?: GiftCard
    requestId: string | null
    open: boolean
    handleClose: () => void
    onSubmit: (user: User, group: Group | null, treeCount: number, category: string, grove: string | null, users: any[], paymentId?: number, logo?: File, messages?: any, file?: File) => void
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
    const [category, setCategory] = useState<string>("Foundation");
    const [grove, setGrove] = useState<string | null>(null);
    const [consent, setConsent] = useState(false);

    // payment details
    const [payment, setPayment] = useState<Payment | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [donorType, setDonorType] = useState<string>("Indian Citizen");
    const [panNumber, setPanNumber] = useState<string | null>(null);

    useEffect(() => {
        setAmount(treeCount * (category === "Foundation" ? 3000 : 1500));
    }, [category, treeCount])

    const getGiftCardRequestDetails = async () => {
        const apiClient = new ApiClient();
        if (giftCardRequest) {
            const userResp = await apiClient.getUsers(0, 1, [{ columnField: 'id', operatorValue: 'equals', value: giftCardRequest.user_id }]);
            if (userResp.results.length === 1) setUser(userResp.results[0]);

            const groupResp = await apiClient.getGroups(0, 1, [{ columnField: 'id', operatorValue: 'equals', value: giftCardRequest.group_id }]);
            if (groupResp.results.length === 1) setGroup(groupResp.results[0]);

            const users = await apiClient.getGiftRequestUsers(giftCardRequest.id);
            const usersData: any[] = []
            for (const user of users) {
                usersData.push({
                    ...user,
                    key: user.id,
                    image: user.profile_image_url ? true : undefined,
                    image_name: user.profile_image_url ? user.profile_image_url.split("/").slice(-1)[0] : undefined,
                    image_url: user.profile_image_url,
                    editable: true,
                })
            }

            setUsers(usersData);
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
                const location = await awsUtils.uploadFileToS3('gift-request', logo, requestId);
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
            content: <SponsorGroupForm logo={logo ?? giftCardRequest?.logo_url ?? null} onLogoChange={logo => setLogo(logo)} group={group} onSelect={group => { setGroup(group); setMessages(prev => ({ ...prev, plantedBy: group ? group.name : "" })) }} />,
        },
        {
            key: 2,
            title: "Book Trees",
            content: <PlotSelection
                disabled={giftCardRequest !== undefined && giftCardRequest.status !== 'pending_plot_selection'}
                treeCount={treeCount}
                onTreeCountChange={count => setTreeCount(count)}
                category={category}
                onCategoryChange={category => { setCategory(category) }}
                grove={grove}
                onGroveChange={grove => setGrove(grove)}
            />,
        },
        {
            key: 3,
            title: "Dashboard Details",
            content: <DashboardDetails
                messages={{ ...messages, plantedBy: messages.plantedBy || group?.name || user?.name || '' }}
                onChange={messages => { setMessages(messages) }}
            />,
        },
        {
            key: 4,
            title: "Payment",
            content: <PaymentForm
                payment={payment}
                amount={amount}
                onPaymentChange={payment => setPayment(payment)}
                onChange={(donorType: string, panNumber: string | null, consent: boolean) => { setDonorType(donorType); setPanNumber(panNumber); setConsent(consent) }}
            />,
        },
        {
            key: 5,
            title: "Tree Card Messages",
            content: <CardDetails
                request_id={requestId || ''}
                presentationId={presentationId}
                slideId={slideId}
                logo_url={logoString ? logoString : giftCardRequest?.logo_url}
                messages={{ ...messages, plantedBy: messages.plantedBy || group?.name || user?.name || '' }}
                onChange={messages => { setMessages(messages) }}
                onPresentationId={(presentationId: string, slideId: string) => { setPresentationId(presentationId); setSlideId(slideId); }}
            />,
        },
        {
            key: 6,
            title: "Recipient Details",
            content: <BulkUserForm treeCount={treeCount} requestId={requestId} users={users} onUsersChange={users => setUsers(users)} onFileChange={file => setFile(file)} />,
        },
    ]

    const handleSubmit = async () => {
        if (!user) {
            toast.error("Please select sponsor");
            setCurrentStep(0);
            return;
        }

        const apiClient = new ApiClient();
        let paymentId = payment ? payment.id : undefined
        if (!payment) {
            const payment = await apiClient.createPayment(amount, donorType, panNumber, consent);
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

        onSubmit(user, group, treeCount, category, grove, users, paymentId, logo ?? undefined, messages, file ?? undefined);

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
        setPayment(null);
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
                nextStep = 5;
                break;
            case 5:
                if (messages.primaryMessage === "" || messages.secondaryMessage === "") toast.error("Please provide gift card details");
                else nextStep = 6;
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
                <DialogTitle style={{ textAlign: "center" }}>{giftCardRequest ? "Edit Request" : "New Request"}</DialogTitle>
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
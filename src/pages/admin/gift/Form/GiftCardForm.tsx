import { Button, Dialog, DialogTitle } from "@mui/material";
import { Steps } from "antd";
import { FC, useEffect, useState } from "react";
import { User } from "../../../../types/user";
import { Group } from "../../../../types/Group";
import CardCount from "./CardCount";
import { BulkUserForm } from "./UserDetails";
import { toast } from "react-toastify";
import CardDetails from "./CardDetailsForm";
import { GiftCard } from "../../../../types/gift_card";
import ApiClient from "../../../../api/apiClient/apiClient";
import { AWSUtils } from "../../../../helpers/aws";
import PaymentForm from "../../../../components/payment/PaymentForm";
import { Payment } from "../../../../types/payment";
import DashboardDetails from "./DashboardDetailsForm";
import SponsorDetailsForm from "./SponsorDetailsForm";
import { LoadingButton } from "@mui/lab";

interface GiftCardsFormProps {
    loading: boolean,
    setLoading: (value: boolean) => void,
    giftCardRequest?: GiftCard
    step?: number
    requestId: string | null
    loggedinUserId?: number
    open: boolean
    handleClose: () => void
    onSubmit: (user: User, createdByUser: User, group: Group | null, treeCount: number, category: string, grove: string | null, requestType: string, users: any[], giftedOn: string, paymentId?: number, logo?: string, messages?: any, file?: File) => void
}

const GiftCardsForm: FC<GiftCardsFormProps> = ({ loading, setLoading, step, loggedinUserId, giftCardRequest, requestId, open, handleClose, onSubmit }) => {

    const [currentStep, setCurrentStep] = useState(0);
    const [user, setUser] = useState<User | null>(null);
    const [createdBy, setCreatedBy] = useState<User | null>(null);
    const [group, setGroup] = useState<Group | null>(null);
    const [treeCount, setTreeCount] = useState<number>(100);
    const [file, setFile] = useState<File | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [logo, setLogo] = useState<File | null>(null);
    const [logoString, setLogoString] = useState<string | null>(null);
    const [messages, setMessages] = useState({ primaryMessage: "", secondaryMessage: "", eventName: "", eventType: undefined as string | undefined, plantedBy: "", logoMessage: "" });
    const [giftedOn, setGiftedOn] = useState(new Date().toISOString().slice(0, 10));
    const [presentationId, setPresentationId] = useState<string | null>(null)
    const [slideId, setSlideId] = useState<string | null>(null)
    const [category, setCategory] = useState<string>("Foundation");
    const [giftRequestType, setGiftRequestType] = useState<string>("Cards Request");
    const [grove, setGrove] = useState<string | null>(null);
    const [consent, setConsent] = useState(false);

    // payment details
    const [payment, setPayment] = useState<Payment | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [donorType, setDonorType] = useState<string>("Indian Citizen");
    const [panNumber, setPanNumber] = useState<string | null>(null);

    useEffect(() => {
        if (giftCardRequest && step) setCurrentStep(step);
    }, [step, giftCardRequest])

    useEffect(() => {
        setAmount(treeCount * (category === 'Foundation' ? 3000 : giftRequestType === 'Normal Assignment' ? 1500 : 2000));
    }, [giftRequestType, category, treeCount])

    const getGiftCardRequestDetails = async () => {
        const apiClient = new ApiClient();

   //     if (loggedinUserId) {
   //         const createdByResp = await apiClient.getUsers(0, 1, [{ columnField: 'id', operatorValue: 'equals', value: giftCardRequest?.created_by ? giftCardRequest.created_by : loggedinUserId }]);
   //         if (createdByResp.results.length === 1) setCreatedBy(createdByResp.results[0]);
   //     }

        if (giftCardRequest) {
            const userResp = await apiClient.getUsers(0, 1, [{ columnField: 'id', operatorValue: 'equals', value: giftCardRequest.user_id }]);
            if (userResp.results.length === 1) setUser(userResp.results[0]);

            const groupResp = await apiClient.getGroups(0, 1, [{ columnField: 'id', operatorValue: 'equals', value: giftCardRequest.group_id }]);
            if (groupResp.results.length === 1) {
                setGroup(groupResp.results[0]);
                setLogoString(groupResp.results[0].logo_url);
            }

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
            setCategory(giftCardRequest.category || "Foundation");
            setGrove(giftCardRequest.grove || null);
            setLogoString(giftCardRequest.logo_url);
            setGiftedOn(giftCardRequest.gifted_on);
            if (giftCardRequest.request_type) setGiftRequestType(giftCardRequest.request_type);
            setMessages({
                primaryMessage: giftCardRequest.primary_message,
                secondaryMessage: giftCardRequest.secondary_message,
                eventName: giftCardRequest.event_name || '',
                plantedBy: giftCardRequest.planted_by || '',
                logoMessage: giftCardRequest.logo_message,
                eventType: giftCardRequest.event_type || undefined
            })

            if (giftCardRequest.payment_id) {
                const payment = await apiClient.getPayment(giftCardRequest.payment_id);
                setPayment(payment);

                setPanNumber(payment.pan_number);
                setConsent(payment.consent ? payment.consent : false);
            }
        }
    }

    const getCreatorUser = async () => {
        const apiClient = new ApiClient();    
        if (!giftCardRequest?.created_by) return;
        
        try {
            const createdByResp = await apiClient.getUsers(0, 1, [{
                columnField: 'id',
                operatorValue: 'equals',
                value: giftCardRequest.created_by
            }]);
            
            setCreatedBy(createdByResp.results[0] || null);
        } catch (error) {
            console.error('Failed to fetch creator:', error);
            toast.error('Failed to load creator details');
        }
    };

    useEffect(() => {
        if (open && giftCardRequest) {
            const fetchData = async () => {
                await getGiftCardRequestDetails();
                await getCreatorUser();
            };
            fetchData();
        }
    }, [open, giftCardRequest]);

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
            content: <SponsorDetailsForm 
                user={user} 
                onUserSelect={user => setUser(user)} 
                createdBy={createdBy} 
                onCreatedByUserSelect={user => setCreatedBy(user)} 
                logo={logoString} 
                onLogoChange={logo => {
                    setLogo(logo)
                    if (logo === null) setLogoString(null)
                }}
                group={group} 
                onGroupSelect={group => { 
                    setGroup(group); 
                    setLogoString(prev => group?.logo_url ? group.logo_url : prev); 
                    setMessages(prev => ({ ...prev, plantedBy: group ? group.name : "" }))}
                }/>,
            onClick: () => setCurrentStep(0),
            style: { cursor: 'pointer' },
        },
        {
            key: 1,
            title: "Book Trees",
            onClick: () => setCurrentStep(1),
            style: { cursor: 'pointer' },
            content: <CardCount
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
            key: 2,
            onClick: () => setCurrentStep(2),
            style: { cursor: 'pointer' },
            title: "Dashboard Details",
            content: <DashboardDetails
                messages={{ ...messages, plantedBy: messages.plantedBy || group?.name || user?.name || '' }}
                onChange={messages => { setMessages(messages) }}
                giftedOn={giftedOn}
                onGiftedOnChange={(date) => { setGiftedOn(date) }}
                requestType={giftRequestType}
                onRequestTypeChange={requestType => { setGiftRequestType(requestType); }}
            />,
        },
        {
            key: 3,
            onClick: () => setCurrentStep(3),
            style: { cursor: 'pointer' },
            title: "Payment",
            content: <PaymentForm
                indianDonor={true}
                payment={payment}
                amount={amount}
                onPaymentChange={payment => setPayment(payment)}
                onChange={(donorType: string, panNumber: string | null, consent: boolean) => { setDonorType(donorType); setPanNumber(panNumber); setConsent(consent) }}
            />,
        },
        {
            key: 4,
            onClick: () => setCurrentStep(4),
            style: { cursor: 'pointer' },
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
            key: 5,
            onClick: () => setCurrentStep(5),
            style: { cursor: 'pointer' },
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

        setLoading(true);
        const apiClient = new ApiClient();
        if (logoString && group && group.logo_url !== logoString) {
            await apiClient.updateGroup({ ...group, logo_url: logoString })
        }

        let paymentId = payment ? payment.id : undefined
        if (!payment) {
            const payment = await apiClient.createPayment(amount, donorType, panNumber, consent);
            paymentId = payment.id
        } else {
            const data = {
                ...payment,
            }

            if (payment.amount !== amount || payment.pan_number !== panNumber || payment.donor_type !== donorType || payment.consent !== consent) {
                if (payment.amount !== amount) data.amount = amount;
                if (payment.pan_number !== panNumber) data.pan_number = panNumber;
                if (payment.donor_type !== donorType) data.donor_type = donorType;
                if (payment.consent !== consent) data.consent = consent;

                await apiClient.updatedPayment(data);
            }
        }

        const logoStr = logoString ? logoString : group?.logo_url ?? undefined;
        onSubmit(user, createdBy ?? user, group, treeCount, category, grove, giftRequestType, users, giftedOn, paymentId, logoStr, messages, file ?? undefined);

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
        setConsent(false);
        setGiftedOn(new Date().toISOString().slice(0, 10));
    }

    const handleNext = () => {
        let nextStep = currentStep;
        switch (currentStep) {
            case 0:
                if (!user) toast.error("Please provide sponsor details");
                else nextStep = 1;
                break;
            case 1:
                if (treeCount === 0) toast.error("Please provide number of trees to gift");
                else nextStep = 2;
                break;
            case 2:
            case 3:
                nextStep = currentStep + 1;
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

                    {currentStep === steps.length - 1 && <LoadingButton
                        loading={loading}
                        onClick={handleSubmit}
                        variant="contained"
                        color="success"
                        style={{ alignSelf: 'right' }}
                    >Finish</LoadingButton>}
                </div>
            </Dialog>
        </div>
    );
};

export default GiftCardsForm;
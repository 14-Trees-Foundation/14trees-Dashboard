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

interface GiftCardsFormProps {
    giftCardRequest?: GiftCard
    requestId: string | null
    open: boolean
    handleClose: () => void
    onSubmit: (user: User, group: Group | null, treeCount: number, users: any[], presentationId: string | null, logo?: File, messages?: any, file?: File) => void
}

const GiftCardsForm: FC<GiftCardsFormProps> = ({ giftCardRequest, requestId, open, handleClose, onSubmit }) => {

    const [currentStep, setCurrentStep] = useState(0);
    const [user, setUser] = useState<User | null>(null);
    const [group, setGroup] = useState<Group | null>(null);
    const [treeCount, setTreeCount] = useState<number>(100);
    const [file, setFile] = useState<File | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [logo, setLogo] = useState<File | null>(null);
    const [messages, setMessages] = useState({ primaryMessage: "", secondaryMessage: "", eventName: "", plantedBy: "", logoMessage: "" });
    const [presentationId, setPresentationId] = useState<string | null>(null)
    const [slideId, setSlideId] = useState<string | null>(null)

    const getGiftCardRequestDetails = async () => {
        const apiClient = new ApiClient();
        if (giftCardRequest) {
            const userResp = await apiClient.getUsers(0, 1, [{ columnField: 'id', operatorValue: 'equals', value: giftCardRequest.user_id }]);
            if (userResp.results.length === 1) setUser(userResp.results[0]);

            const groupResp = await apiClient.getGroups(0, 1, [{ columnField: 'id', operatorValue: 'equals', value: giftCardRequest.group_id }]);
            if (groupResp.results.length === 1) setGroup(groupResp.results[0]);

            setTreeCount(giftCardRequest.no_of_cards);
            setMessages({
                primaryMessage: giftCardRequest.primary_message,
                secondaryMessage: giftCardRequest.secondary_message,
                eventName: giftCardRequest.event_name,
                plantedBy: giftCardRequest.planted_by,
                logoMessage: giftCardRequest.logo_message
            })
            setPresentationId(giftCardRequest.presentation_id);
        }
    }

    useEffect(() => {
        getGiftCardRequestDetails();
    }, [giftCardRequest])

    const steps = [
        {
            key: 0,
            title: "Sponsor Details",
            content: <SponsorUserForm user={user} onSelect={user => setUser(user)}/>,
        },
        {
            key: 1,
            title: "Corporate Details (Optional)",
            content: <SponsorGroupForm logo={logo ?? giftCardRequest?.logo_url ?? null} onLogoChange={logo => setLogo(logo)} group={group} onSelect={group => setGroup(group)}/>,
        },
        {
            key: 2,
            title: "Book Trees",
            content: <PlotSelection treeCount={treeCount} onTreeCountChange={count => setTreeCount(count)}/>,
        },
        {
            key: 3,
            title: "Gift Card Messages",
            content: <CardDetails
                request_id={requestId || ''}
                presentationId={presentationId}
                slideId={slideId}
                primaryMessage={messages.primaryMessage}
                secondaryMessage={messages.secondaryMessage}
                eventName={messages.eventName}
                plantedBy={messages.plantedBy || group?.name || ''}
                logoMessage={messages.logoMessage}
                onChange={(primary, secondary, event, planted, logo) => setMessages({ primaryMessage: primary, secondaryMessage: secondary, eventName: event, plantedBy: planted, logoMessage: logo })}
                onPresentationId={(presentationId: string, slideId: string) => { setPresentationId(presentationId); setSlideId(slideId); }}
            />,
        },
        {
            key: 4,
            title: "User Details",
            content: <BulkUserForm requestId={requestId} users={users} onUsersChange={users => setUsers(users)} onFileChange={file => setFile(file)} />,
        },
    ]

    const handleSubmit = () => {
        if (!user) {
            toast.error("Please select sponsor");
            setCurrentStep(0);
            return;
        }

        onSubmit(user, group, treeCount, users, presentationId, logo ?? undefined, messages, file ?? undefined);

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
        setMessages({ primaryMessage: "", secondaryMessage: "", eventName: "", plantedBy: "", logoMessage: "" });
        setPresentationId('null')
        setSlideId('null');
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
                if (messages.primaryMessage === "" || messages.secondaryMessage === "") toast.error("Please provide gift card details");
                else nextStep = 4;
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
                onClose={handleClose}
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

                <div
                    style={{
                        padding: 10,
                        margin: 10,
                        marginTop: 40,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    { steps[currentStep].content }
                </div>
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
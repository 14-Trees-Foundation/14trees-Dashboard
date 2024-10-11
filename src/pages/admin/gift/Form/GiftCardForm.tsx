import { Button, Dialog, DialogTitle } from "@mui/material";
import { Steps } from "antd";
import { FC, useState } from "react";
import { User } from "../../../../types/user";
import { Group } from "../../../../types/Group";
import PlotSelection from "./CardCount";
import { BulkUserForm } from "./UserDetails";
import { toast } from "react-toastify";
import SponsorUserForm from "./SponsorUser";
import ImagePicker from "../../../../components/ImagePicker";
import SponsorGroupForm from "./SponsorGroup";
import CardDetails from "./CardDetailsForm";
import UserImagesForm from "./UserImagesForm";

interface GiftCardsFormProps {
    open: boolean
    handleClose: () => void
    onSubmit: (user: User, group: Group | null, treeCount: number, users: any[], logo?: File, messages?: any, file?: File) => void
}

const GiftCardsForm: FC<GiftCardsFormProps> = ({ open, handleClose, onSubmit }) => {

    const [currentStep, setCurrentStep] = useState(0);
    const [user, setUser] = useState<User | null>(null);
    const [group, setGroup] = useState<Group | null>(null);
    const [treeCount, setTreeCount] = useState<number>(0);
    const [file, setFile] = useState<File | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [logo, setLogo] = useState<File | null>(null);
    const [messages, setMessages] = useState({ primaryMessage: "", secondaryMessage: "", eventName: "", plantedBy: "", logoMessage: "" });

    const steps = [
        {
            key: 0,
            title: "Sponsor Details",
            content: <SponsorUserForm user={user} onSelect={user => setUser(user)}/>,
        },
        {
            key: 1,
            title: "Corporate Details",
            content: <SponsorGroupForm group={group} onSelect={group => setGroup(group)}/>,
        },
        {
            key: 2,
            title: "Company Logo",
            content: <ImagePicker onChange={logo => setLogo(logo)} width={30} height={20}/>,
        },
        {
            key: 3,
            title: "Gift Card Messages",
            content: <CardDetails
                primaryMessage={messages.primaryMessage}
                secondaryMessage={messages.secondaryMessage}
                eventName={messages.eventName}
                plantedBy={messages.plantedBy}
                logoMessage={messages.logoMessage}
                onChange={(primary, secondary, event, planted, logo) => setMessages({ primaryMessage: primary, secondaryMessage: secondary, eventName: event, plantedBy: planted, logoMessage: logo })}
            />,
        },
        {
            key: 4,
            title: "Book Trees",
            content: <PlotSelection treeCount={treeCount} onTreeCountChange={count => setTreeCount(count)}/>,
        },
        {
            key: 5,
            title: "User Images",
            content: <UserImagesForm />,
        },
        {
            key: 6,
            title: "User Details",
            content: <BulkUserForm users={users} onUsersChange={users => setUsers(users)} onFileChange={file => setFile(file)} />,
        },
    ]

    const handleSubmit = () => {
        if (!user) {
            toast.error("Please select sponsor");
            setCurrentStep(0);
            return;
        }

        handleClose();
        onSubmit(user, group, treeCount, users, logo ?? undefined, messages, file ?? undefined);
    }

    const handleNext = () => {
        let nextStep = currentStep;
        switch (currentStep) {
            case 0:
                if (!user) toast.error("Please provide sponsor details");
                else nextStep = 1;
                break;
            case 1:
                if (!group) toast.error("Please provide corporate details");
                else nextStep = 2;
                break;
            case 2:
                if (!logo) toast.error("Please provide company logo to put on gift card");
                else nextStep = 3;
                break;
            case 3:
                if (messages.primaryMessage === "" || messages.secondaryMessage === "") toast.error("Please provide gift card details");
                else nextStep = 4;
                break;
            case 4:
                if (treeCount === 0) toast.error("Please provide number of trees to gift");
                else nextStep = 5;
                break;
            case 5:
                nextStep = 6;
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
                maxWidth='lg'
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
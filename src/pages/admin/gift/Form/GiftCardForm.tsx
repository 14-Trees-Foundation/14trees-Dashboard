import { Button, Dialog, DialogTitle } from "@mui/material";
import { Steps } from "antd";
import { FC, useState } from "react";
import SponsorForm from "./SponsorForm";
import { User } from "../../../../types/user";
import { Group } from "../../../../types/Group";
import PlotSelection from "./CardCount";
import { BulkUserForm } from "./UserDetails";
import { toast } from "react-toastify";

interface GiftCardsFormProps {
    open: boolean
    handleClose: () => void
    onSubmit: (user: User, group: Group | null, treeCount: number, users: any[], logo?: File) => void
}

const GiftCardsForm: FC<GiftCardsFormProps> = ({ open, handleClose, onSubmit }) => {

    const [currentStep, setCurrentStep] = useState(0);
    const [user, setUser] = useState<User | null>(null);
    const [group, setGroup] = useState<Group | null>(null);
    const [treeCount, setTreeCount] = useState<number>(0);
    const [users, setUsers] = useState<any[]>([]);
    const [logo, setLogo] = useState<File | null>(null);

    const steps = [
        {
            key: 0,
            title: "Sponsor Details",
            content: <SponsorForm user={user} group={group} onGroupChange={group => setGroup(group)} onUserChange={user => setUser(user)} onLogoChange={logo => setLogo(logo)}/>,
        },
        {
            key: 1,
            title: "Book Trees",
            content: <PlotSelection treeCount={treeCount} onTreeCountChange={count => setTreeCount(count)}/>,
        },
        {
            key: 2,
            title: "User Details",
            content: <BulkUserForm users={users} onUsersChange={users => setUsers(users)} />,
        },
    ]

    const handleSubmit = () => {
        if (!user) {
            toast.error("Please select sponsor");
            setCurrentStep(0);
            return;
        }

        handleClose();
        onSubmit(user, group, treeCount, users, logo ?? undefined);
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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
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
                        onClick={() => setCurrentStep(currentStep + 1)}
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
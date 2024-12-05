import { useEffect, useState } from "react";
import { Group } from "../../../../types/Group";
import { User } from "../../../../types/user";
import DonorUserForm from "./DonorUserForm";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import DonorGroupForm from "./DonorGroupForm";


interface DonorDetailsFormProps {
    user: User | null;
    onUserSelect: (user: User | null) => void;
    logo: File | string | null,
    onLogoChange: (logo: File | null) => void,
    group: Group | null,
    onGroupSelect: (group: Group | null) => void
}

const DonorDetailsForm: React.FC<DonorDetailsFormProps> = ({ user, logo, group, onUserSelect, onGroupSelect, onLogoChange }) => {

    const [donorType, setDonorType] = useState<"corporate" | "individual">("individual");
    useEffect(() => {
        if (donorType === 'individual' && group) {
            setDonorType("corporate");
        }
    }, [group, donorType])

    return (
        <div>
            <DonorUserForm
                user={user}
                onSelect={onUserSelect}
            />
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px', marginBottom: '30px' }}>
                <Typography variant='body1' mr={5}>
                    Are you making this contribution on the behalf of a corporate/organization?
                </Typography>
                <ToggleButtonGroup
                    color="success"
                    value={donorType}
                    exclusive
                    onChange={(e, value) => { setDonorType(value); }}
                    aria-label="Platform"
                    size="small"
                >
                    <ToggleButton value="corporate">Yes</ToggleButton>
                    <ToggleButton value="individual">No</ToggleButton>
                </ToggleButtonGroup>
            </div>
            {donorType === "corporate" && 
                <DonorGroupForm 
                    group={group}
                    onSelect={onGroupSelect}
                    logo={logo}
                    onLogoChange={onLogoChange}
                />
            }
        </div>
    );
}

export default DonorDetailsForm;
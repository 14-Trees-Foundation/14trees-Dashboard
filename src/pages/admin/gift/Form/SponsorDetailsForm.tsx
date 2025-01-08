import { useEffect, useState } from "react";
import { Group } from "../../../../types/Group";
import { User } from "../../../../types/user";
import SponsorUserForm from "./SponsorUser";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import SponsorGroupForm from "./SponsorGroup";


interface SponsorDetailsFormProps {
    user: User | null;
    onUserSelect: (user: User | null) => void;
    createdBy: User | null;
    onCreatedByUserSelect: (createdBy: User | null) => void;
    logo: File | string | null,
    onLogoChange: (logo: File | null) => void,
    group: Group | null,
    onGroupSelect: (group: Group | null) => void
}

const SponsorDetailsForm: React.FC<SponsorDetailsFormProps> = ({ user, createdBy, logo, group, onUserSelect, onCreatedByUserSelect, onGroupSelect, onLogoChange }) => {

    const [donorType, setSponsorType] = useState<"corporate" | "individual">("individual");
    useEffect(() => {
        if (donorType === 'individual' && group) {
            setSponsorType("corporate");
        }
    }, [group, donorType])

    return (
        <div>
            <SponsorUserForm
                user={user}
                onSelect={onUserSelect}
                createdBy={createdBy}
                onCreatedBySelect={onCreatedByUserSelect}
            />
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px', marginBottom: '30px' }}>
                <Typography variant='body1' mr={5}>
                    Are you making this request on the behalf of a corporate/organization?
                </Typography>
                <ToggleButtonGroup
                    color="success"
                    value={donorType}
                    exclusive
                    onChange={(e, value) => { setSponsorType(value); }}
                    aria-label="Platform"
                    size="small"
                >
                    <ToggleButton value="corporate">Yes</ToggleButton>
                    <ToggleButton value="individual">No</ToggleButton>
                </ToggleButtonGroup>
            </div>
            {donorType === "corporate" && 
                <SponsorGroupForm 
                    group={group}
                    onSelect={onGroupSelect}
                    logo={logo}
                    onLogoChange={onLogoChange}
                />
            }
        </div>
    );
}

export default SponsorDetailsForm;
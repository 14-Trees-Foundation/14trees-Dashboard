import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSponsorProfile } from "../hooks/useSponsorProfile";
import { RequestItem } from "../types/requestItem";
import UserSponsorshipView from "./UserSponsorshipView";
import CorporateGroupView from "./CorporateGroupView";
import AlumniGroupView from "./AlumniGroupView";
import TreesModal from "./TreesModal";

interface MappedTreesProps {
}

const MappedTrees: React.FC<MappedTreesProps> = ({ }) => {
    const { id } = useParams();
    const location = useLocation();
    const isGroupView = location.pathname.includes('/group/');

    // Use shared hook to determine profile type
    const { loading, groupType, name } = useSponsorProfile(id, isGroupView);

    // TreesModal state (shared across all scenarios)
    const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Common handlers
    const handleRequestClick = (request: RequestItem) => {
        setSelectedRequest(request);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedRequest(null);
    };

    // Show loading state while determining profile type
    if (loading && !name) {
        return null; // The child components will handle their own loading states
    }

    // Route to appropriate view based on scenario
    if (isGroupView && groupType?.toUpperCase() === 'ALUMNI') {
        return (
            <>
                <AlumniGroupView
                    groupId={Number(id)}
                    groupName={name}
                />
                {/* Note: TreesModal not needed for Alumni view as users don't click requests */}
            </>
        );
    }

    if (isGroupView) {
        return (
            <>
                <CorporateGroupView
                    groupId={Number(id)}
                    groupName={name}
                    onRequestClick={handleRequestClick}
                />
                <TreesModal
                    open={modalOpen}
                    onClose={handleModalClose}
                    request={selectedRequest}
                    groupId={Number(id)}
                />
            </>
        );
    }

    // Individual user sponsorship view
    return (
        <>
            <UserSponsorshipView
                userId={Number(id)}
                userName={name}
                onRequestClick={handleRequestClick}
            />
            <TreesModal
                open={modalOpen}
                onClose={handleModalClose}
                request={selectedRequest}
                userId={Number(id)}
            />
        </>
    );
}

export default MappedTrees;

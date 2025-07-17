import { GridFilterItem } from '@mui/x-data-grid';
import { Order } from '../../../../types/common';
import { GiftCard } from '../../../../types/gift_card';
import { createTableColumns } from '../config/tableColumns';
import { createActionsMenu } from '../config/actionsMenu';

interface UseTableLogicProps {
    filters: Record<string, GridFilterItem>;
    handleSetFilters: (filters: Record<string, GridFilterItem>) => void;
    orderBy: Order[];
    handleSortingChange: (sorter: any) => void;
    tags: string[];
    setSelectedGiftCard: (card: GiftCard | null) => void;
    setNotesModal: (open: boolean) => void;
    auth: any;
    actionHandlers: any;
}

export const useTableLogic = ({
    filters,
    handleSetFilters,
    orderBy,
    handleSortingChange,
    tags,
    setSelectedGiftCard,
    setNotesModal,
    auth,
    actionHandlers
}: UseTableLogicProps) => {
    const getActionsMenu = (record: GiftCard) => createActionsMenu({ 
        record, 
        auth, 
        handlers: actionHandlers 
    });

    const columns = createTableColumns({
        filters,
        handleSetFilters,
        orderBy,
        handleSortingChange,
        tags,
        getActionsMenu,
        setSelectedGiftCard,
        setNotesModal
    });

    const handleSelectionChanges = (giftRequestIds: number[]) => {
        // This can be moved to a separate state hook if needed
        return giftRequestIds;
    };

    return {
        columns,
        getActionsMenu,
        handleSelectionChanges
    };
};
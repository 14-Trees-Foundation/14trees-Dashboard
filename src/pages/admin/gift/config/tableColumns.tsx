import { Badge, Button, IconButton, Tooltip } from "@mui/material";
import { TableColumnsType } from "antd";
import { Dropdown } from "antd";
import { MenuOutlined, ErrorOutline, NotesOutlined } from "@mui/icons-material";
import { GridFilterItem } from "@mui/x-data-grid";
import { GiftCard } from "../../../../types/gift_card";
import { getHumanReadableDate } from "../../../../helpers/utils";
import getColumnSearchProps, { getColumnDateFilter, getColumnNumericFilter, getColumnSelectedItemFilter, getSortIcon } from "../../../../components/Filter";
import { Order, UserRoles } from "../../../../types/common";

const pendingPlotSelection = 'Pending Plot & Tree(s) Reservation';

const getStatus = (card: GiftCard) => {
    if (card.status === 'pending_plot_selection') {
        return pendingPlotSelection;
    } else if (card.status === 'pending_assignment') {
        return 'Pending assignment';
    } else if (card.status === 'pending_gift_cards') {
        return 'Pending Tree cards creation';
    } else {
        return 'Completed';
    }
}

const getValidationErrors = (errorValues: string[]) => {
    let errors = []
    if (errorValues.includes('MISSING_LOGO')) errors.push('Missing Company Logo');
    if (errorValues.includes('MISSING_USER_DETAILS')) errors.push('Missing user details for assignment');

    return errors;
}

interface TableColumnsProps {
    filters: Record<string, GridFilterItem>;
    handleSetFilters: (filters: Record<string, GridFilterItem>) => void;
    orderBy: Order[];
    handleSortingChange: (sorter: any) => void;
    tags: string[];
    getActionsMenu: (record: GiftCard) => JSX.Element;
    setSelectedGiftCard: (card: GiftCard) => void;
    setNotesModal: (open: boolean) => void;
}

export const createTableColumns = ({
    filters,
    handleSetFilters,
    orderBy,
    handleSortingChange,
    tags,
    getActionsMenu,
    setSelectedGiftCard,
    setNotesModal
}: TableColumnsProps): TableColumnsType<GiftCard> => {

    const getSortableHeader = (header: string, key: string) => {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                {header} {getSortIcon(key, orderBy.find((item) => item.column === key)?.order, handleSortingChange)}
            </div>
        )
    }

    return [
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 100,
            align: "center",
            render: (value, record, index) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Dropdown menu={getActionsMenu(record)} trigger={['click']}>
                        <Button
                            variant='outlined'
                            color='success'
                            style={{ margin: "0 5px" }}
                        >
                            <MenuOutlined />
                        </Button>
                    </Dropdown>
                </div>
            ),
        },
        {
            dataIndex: "id",
            key: "Req. No.",
            title: "Req. No.",
            align: "right",
            width: 130,
            ...getColumnNumericFilter({ dataIndex: 'id', filters, handleSetFilters, label: 'Req. No.' })
        },
        {
            dataIndex: "user_name",
            key: "Sponsor",
            title: "Sponsor",
            align: "center",
            width: 200,
            ...getColumnSearchProps('user_name', filters, handleSetFilters)
        },
        {
            dataIndex: "group_name",
            key: "Sponsorship (Corporate/Personal)",
            title: "Sponsorship (Corporate/Personal)",
            align: "center",
            width: 200,
            render: (value: string) => value ? value : 'Personal',
            ...getColumnSearchProps('group_name', filters, handleSetFilters)
        },
        {
            dataIndex: "no_of_cards",
            key: "# Trees",
            title: getSortableHeader("# Trees", 'no_of_cards'),
            align: "center",
            width: 100,
        },
        {
            dataIndex: "created_by_name",
            key: "Created by",
            title: "Created by",
            align: "center",
            width: 200,
            ...getColumnSearchProps('created_by_name', filters, handleSetFilters)
        },
        {
            dataIndex: "recipient_name",
            key: "Recipient Name",
            title: "Recipient Name",
            align: "center",
            width: 200,
            ...getColumnSearchProps('recipient_name', filters, handleSetFilters)
        },
        {
            dataIndex: "request_type",
            key: "Request Type",
            title: "Request Type",
            align: "center",
            width: 200,
            ...getColumnSelectedItemFilter({ dataIndex: 'request_type', filters, handleSetFilters, options: ['Gift Cards', 'Normal Assignment', 'Test', 'Promotion', 'Visit'] })
        },
        {
            dataIndex: "processed_by_name",
            key: "processed_by",
            title: "Processed By",
            align: "center",
            width: 150,
            render: (value, record) => {
                if (!value) return 'Pending';
                return record.processed_by_name || `User ${value}`;
            },
            ...getColumnSearchProps('processed_by_name', filters, handleSetFilters)
        },
        {
            dataIndex: "tags",
            key: "Tags",
            title: "Tags",
            align: "center",
            width: 200,
            render: value => value?.join(", ") || '',
            ...getColumnSelectedItemFilter({ dataIndex: 'tags', filters, handleSetFilters, options: tags })
        },
        {
            dataIndex: "status",
            key: "Status",
            title: "Status",
            align: "center",
            width: 150,
            render: (value, record, index) => getStatus(record),
            ...getColumnSelectedItemFilter({ dataIndex: 'status', filters, handleSetFilters, options: [pendingPlotSelection, 'Pending assignment', 'Completed'] })
        },
        {
            dataIndex: "mail_sent",
            key: "Email Status",
            title: "Email Status",
            align: "center",
            width: 200,
            render: (value, record: any, index) => {
                const usersCount = parseInt(record.users_count || "0");
                const mailedCount = parseInt(record.mailed_count || "0");
                const mailedAssigneeCount = parseInt(record.mailed_assignee_count || "0");
        
                const statusMessages: string[] = [];
                if (record.mail_sent) {
                    statusMessages.push("Mail Sent to Sponsor");
                }
                if (usersCount > 0 && usersCount === mailedCount) {
                    statusMessages.push("Mail Sent to Recipient");
                }
                if (usersCount > 0 && usersCount === mailedAssigneeCount) {
                    statusMessages.push("Mail Sent to Assignee");
                }

                return statusMessages.join(", ");
            }
        },
        {
            dataIndex: "validation_errors",
            key: "Validation Errors",
            title: "Validation Errors",
            align: "center",
            width: 120,
            render: (value) => value && value.length > 0 ? (
                <Tooltip title={<div>{getValidationErrors(value).map((item, index) => (<p key={index}>{item}</p>))}</div>}>
                    <IconButton>
                        <ErrorOutline color="error" />
                    </IconButton>
                </Tooltip>
            ) : '',
            ...getColumnSelectedItemFilter({ dataIndex: 'validation_errors', filters, handleSetFilters, options: ['Yes', 'No'] }),
        },
        {
            dataIndex: "sponsorship_type",
            key: "Sponosorship Type",
            title: "Sponsorship Type",
            align: "center",
            width: 150,
            ...getColumnSelectedItemFilter({ dataIndex: 'sponsorship_type', filters, handleSetFilters, options: ['Unverified', 'Pledged', 'Promotional', 'Unsponsored Visit', 'Donation Received'] })
        },
        {
            dataIndex: "donation_receipt_number",
            key: "Donation Receipt No.",
            title: "Donation Receipt No.",
            align: "center",
            width: 200,
            ...getColumnSearchProps('donation_receipt_number', filters, handleSetFilters)
        },
        {
            dataIndex: "donation_date",
            key: "Donation Date",
            title: "Donation Date",
            align: "center",
            width: 200,
            ...getColumnDateFilter({ dataIndex: 'donation_date', filters, handleSetFilters, label: 'Received' })
        },
        {
            dataIndex: "total_amount",
            key: "Total Amount",
            title: getSortableHeader("Total Amount", 'total_amount'),
            align: "center",
            width: 150,
        },
        {
            dataIndex: "amount_received",
            key: "Amount Received",
            title: "Amount Received",
            align: "center",
            width: 200,
        },
        {
            dataIndex: "payment_status",
            key: "Payment Status",
            title: "Payment Status",
            align: "center",
            width: 150,
        },
        {
            dataIndex: "notes",
            key: "Notes",
            title: "Notes",
            align: "center",
            width: 100,
            render: (value, record) => (
                <IconButton onClick={() => { setSelectedGiftCard(record); setNotesModal(true); }}>
                    <Badge variant="dot" color="success" invisible={(!value || value.trim() === '') ? true : false}>
                        <NotesOutlined />
                    </Badge>
                </IconButton>
            ),
            ...getColumnSelectedItemFilter({ dataIndex: 'notes', filters, handleSetFilters, options: ['Yes', 'No'] })
        },
        {
            dataIndex: "created_at",
            key: "Created on",
            title: "Created on",
            align: "center",
            width: 200,
            render: getHumanReadableDate,
            ...getColumnDateFilter({ dataIndex: 'created_at', filters, handleSetFilters, label: 'Created' })
        },
    ];
};

export { pendingPlotSelection };
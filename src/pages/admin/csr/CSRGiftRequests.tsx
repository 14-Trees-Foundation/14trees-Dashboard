import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ApiClient from "../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import { GiftCard } from "../../../types/gift_card";
import getColumnSearchProps, { getColumnDateFilter, getColumnSelectedItemFilter, getSortIcon } from "../../../components/Filter";
import { GridFilterItem } from "@mui/x-data-grid";
import * as giftCardActionCreators from "../../../redux/actions/giftCardActions";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import { RootState } from "../../../redux/store/store";
import { TableColumnsType } from "antd";
import { getHumanReadableDate } from "../../../helpers/utils";
import { Order } from "../../../types/common";
import GeneralTable from "../../../components/GenTable";
import PurchaseTreesForm from "./form/PurchaseTreesForm";
import { Group } from "../../../types/Group";
import PaymentIcon from '@mui/icons-material/Payment';
import PaymentDialog from "./components/PaymentDialog";


interface CSRGiftRequestsProps {
    groupId: number
    selectedGroup: Group
}

const CSRGiftRequests: React.FC<CSRGiftRequestsProps> = ({ groupId, selectedGroup }) => {
    const dispatch = useAppDispatch();
    const { getGiftCards } = bindActionCreators(giftCardActionCreators, dispatch);

    const userName = localStorage.getItem("userName") || "Guest";
    const userEmail = localStorage.getItem("userEmail") || "local@test.com";

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [orderBy, setOrderBy] = useState<Order[]>([]);
    const [tableRows, setTableRows] = useState<GiftCard[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);

    const giftCardsData = useAppSelector((state: RootState) => state.giftCardsData);

    useEffect(() => {
        const getTags = async () => {
            try {
                const apiClient = new ApiClient();
                const tagsResp = await apiClient.getGiftRequestTags();
                setTags(tagsResp.results);
            } catch (error: any) {
                toast.error(error.message);
            }
        }
        getTags();
    }, []);

    useEffect(() => {

        if (giftCardsData.loading) return;
        
        const handler = setTimeout(() => {
            const records: GiftCard[] = [];
            const maxLength = Math.min((page + 1) * pageSize, giftCardsData.totalGiftCards);
            for (let i = page * pageSize; i < maxLength; i++) {
                if (Object.hasOwn(giftCardsData.paginationMapping, i)) {
                    const id = giftCardsData.paginationMapping[i];
                    const record = giftCardsData.giftCards[id];
                    if (record) {
                        records.push(record);
                    }
                } else {
                    getGiftCardData();
                    break;
                }
            }

            setTableRows(records);
        }, 300)

        return () => { clearTimeout(handler) };
    }, [pageSize, page, giftCardsData]);

    const getFilters = (filters: any, groupId: number) => {
        let filtersData = JSON.parse(JSON.stringify(Object.values(filters))) as GridFilterItem[];
        
        // Handle status filter
        const statusFilterIndex = filtersData.findIndex(item => item.columnField === 'status');
        if (statusFilterIndex !== -1) {
            const statusFilter = filtersData[statusFilterIndex];
            const statuses: string[] = [];
            
            if ((statusFilter.value as string[]).includes('Pending Tree Allocation')) {
                statuses.push('pending_plot_selection');
            }
            
            if ((statusFilter.value as string[]).includes('Trees Allocated')) {
                statuses.push( 'pending_assignment', 'completed');
            }

            filtersData[statusFilterIndex].value = statuses;
        }

        // Handle payment status filter
        const paymentStatusFilterIndex = filtersData.findIndex(item => item.columnField === 'payment_status_new');
        if (paymentStatusFilterIndex !== -1) {
            const paymentStatusFilter = filtersData[paymentStatusFilterIndex];
            const paymentTags: string[] = [];
            
            if ((paymentStatusFilter.value as string[]).includes('Payment Completed')) {
                paymentTags.push('PaymentCompleted');
            }
            
            if ((paymentStatusFilter.value as string[]).includes('Payment Failed')) {
                paymentTags.push('PaymentFailed');
            }
            
            if ((paymentStatusFilter.value as string[]).includes('Incomplete Payment')) {
                paymentTags.push('IncompletePayment');
            }

            // Replace the payment status filter with a tags filter
            filtersData[paymentStatusFilterIndex] = {
                columnField: 'tags',
                operatorValue: 'contains',
                value: paymentTags
            };
        }
    
        return [
            ...filtersData, 
            {columnField: 'group_id', operatorValue: 'equals', value: groupId, },
            { columnField: 'tags', operatorValue: 'contains', value: ['PrePurchaseMethod'], }
        ];
    };


    const getGiftCardData = async () => {
        const filtersData = getFilters(filters, groupId);
    
        getGiftCards(page * pageSize, pageSize, filtersData, orderBy);
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            getGiftCardData();
        }, 500);

        return () => clearTimeout(handler);
    }, [filters, orderBy, groupId, page, pageSize]);

    useEffect(() => {
        const handler = setTimeout(() => {
            const records: GiftCard[] = [];
            const maxLength = Math.min((page + 1) * pageSize, giftCardsData.totalGiftCards);
            for (let i = page * pageSize; i < maxLength; i++) {
                if (Object.hasOwn(giftCardsData.paginationMapping, i)) {
                    const id = giftCardsData.paginationMapping[i];
                    const record = giftCardsData.giftCards[id];
                    if (record) records.push(record);
                } else {
                    getGiftCardData();
                    return;
                }
            }
            setTableRows(records);
        }, 300);

        return () => clearTimeout(handler);
    }, [giftCardsData, page, pageSize]);

    const handleFormSuccess = () => {
        setFormOpen(false);
        setPage(0);
        getGiftCardData();
    };

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    };

    const getStatus = (card: GiftCard) => {
        return card.status === 'pending_plot_selection' ? 'Pending Tree Allocation' : 'Trees Allocated';
    };

    const getPaymentStatus = (card: GiftCard) => {
        if (card.tags?.includes('PaymentCompleted')) {
            return 'Payment Completed';
        } else if (card.tags?.includes('PaymentFailed')) {
            return 'Payment Failed';
        } else if (card.tags?.includes('IncompletePayment')) {
            return 'Incomplete Payment';
        }
        return 'Unknown';
    };

    const handleSortingChange = (sorter: any) => {
        let newOrder = [...orderBy];
        const updateOrder = () => {
            const index = newOrder.findIndex((item) => item.column === sorter.field);
            if (index > -1) {
                if (sorter.order) newOrder[index].order = sorter.order;
                else newOrder = newOrder.filter((item) => item.column !== sorter.field);
            } else if (sorter.order) {
                newOrder.push({ column: sorter.field, order: sorter.order });
            }
        };

        if (sorter.field) {
            setPage(0);
            updateOrder();
            setOrderBy(newOrder);
        }
    };

    const getSortableHeader = (header: string, key: string) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
            {header} {getSortIcon(key, orderBy.find((item) => item.column === key)?.order, handleSortingChange)}
        </div>
    );

    const getAllGiftCardsData = async () => {
        const filtersData = getFilters(filters, groupId);
        const apiClient = new ApiClient();
        const resp = await apiClient.getGiftCards(0, -1, filtersData, orderBy);
        return resp.results;
    };

    const handlePaymentSuccess = () => {
        setPaymentDialogOpen(false);
        getGiftCardData();
        toast.success('Payment successful!');
    };

    const columns: TableColumnsType<GiftCard> = [
        {
            dataIndex: "id",
            key: "Req. No.",
            title: "Req. No.",
            align: "right",
            width: 100,
            fixed: 'left',
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
            dataIndex: "status",
            key: "Status",
            title: "Status",
            align: "center",
            width: 150,
            render: (value, record, index) => getStatus(record),
            ...getColumnSelectedItemFilter({ dataIndex: 'status', filters, handleSetFilters, options: ['Pending Tree Allocation', 'Trees Allocated'] })
        },
        {
            dataIndex: "total_amount",
            key: "Total Amount",
            title: getSortableHeader("Total Amount", 'total_amount'),
            align: "center",
            width: 150,
            render: (value: number) => new Intl.NumberFormat('en-IN').format(value)
        },
        {
            dataIndex: "amount_received",
            key: "Amount Received",
            title: "Amount Received",
            align: "center",
            width: 200,
            hidden: true,
            render: (value: number) => new Intl.NumberFormat('en-IN').format(value)
        },
        {
            dataIndex: "payment_status",
            key: "Payment Status (Old)",
            title: "Payment Status (Old)",
            align: "center",
            width: 150,
            hidden: true,
        },
        {
            dataIndex: "tags",
            key: "Payment Status",
            title: "Payment Status",
            align: "center",
            width: 150,
            render: (value, record, index) => getPaymentStatus(record),
            ...getColumnSelectedItemFilter({ 
                dataIndex: 'payment_status_new', 
                filters, 
                handleSetFilters, 
                options: ['Payment Completed', 'Payment Failed', 'Incomplete Payment'] 
            })
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
    ]

    return (
        <Box p={2} id="green-gift-contributions">
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
            }}>
                <Typography variant="h4" ml={1}>Pre-Purchase History</Typography>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => setFormOpen(true)}
                    style={{ marginLeft: 10, textTransform: 'none' }}
                >
                    Pre-Purchase Trees
                </Button>
            </Box>
            <Box sx={{ height: 840, width: "100%" }}>
                <GeneralTable
                    loading={giftCardsData.loading}
                    rows={tableRows}
                    columns={columns}
                    totalRecords={giftCardsData.totalGiftCards}
                    page={page}
                    pageSize={pageSize}
                    onPaginationChange={(page: number, pageSize: number) => { setPage(page - 1); setPageSize(pageSize); }}
                    onDownload={getAllGiftCardsData}
                    footer
                    tableName="Orders"
                />
            </Box>

            {selectedGroup && formOpen && (
                <PurchaseTreesForm
                    open={formOpen}
                    onClose={() => setFormOpen(false)}
                    onSuccess={handleFormSuccess}
                    corporateName={selectedGroup.name}
                    corporateLogo={selectedGroup.logo_url ?? undefined}
                    groupId={selectedGroup.id}
                    userName={userName}
                    userEmail={userEmail}
                />
            )}

            {selectedGiftCard && (
                <PaymentDialog
                    open={paymentDialogOpen}
                    onClose={() => {
                        setPaymentDialogOpen(false);
                        setSelectedGiftCard(null);
                    }}
                    type="gift"
                    paymentId={selectedGiftCard.payment_id!}
                    giftRequestId={selectedGiftCard.id}
                    requestId={selectedGiftCard.request_id}
                    totalAmount={selectedGiftCard.total_amount}
                    userName={userName}
                    userEmail={userEmail}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}
        </Box>
    );
};

export default CSRGiftRequests;

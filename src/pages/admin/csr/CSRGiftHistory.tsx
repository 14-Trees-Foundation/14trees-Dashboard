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
import { Group } from "../../../types/Group";
import PaymentIcon from '@mui/icons-material/Payment';
import PaymentDialog from "./components/PaymentDialog";

interface CSRGiftHistoryProps {
    groupId: number;
    selectedGroup: Group;
}

const CSRGiftHistory: React.FC<CSRGiftHistoryProps> = ({ groupId, selectedGroup }) => {
    const dispatch = useAppDispatch();
    const { getGiftCards } = bindActionCreators(giftCardActionCreators, dispatch);

    const userName = localStorage.getItem("userName") || "Guest";
    const userEmail = localStorage.getItem("userEmail");

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [orderBy, setOrderBy] = useState<Order[]>([]);
    const [tableRowsPrePaid, setTableRowsPrePaid] = useState<GiftCard[]>([]);
    const [tableRowsPayLater, setTableRowsPayLater] = useState<GiftCard[]>([]);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);

    const giftCardsData = useAppSelector((state: RootState) => state.giftCardsData);

    const getFilters = (filters: any, groupId: number, tags: string[]) => {
        const filtersData = JSON.parse(JSON.stringify(Object.values(filters))) as GridFilterItem[];
        filtersData.forEach((item) => {
            if (item.columnField === 'status') {
                const items: string[] = [];
                if ((item.value as string[]).includes('Pending Fulfillment')) {
                    items.push('pending_plot_selection');
                }
                if ((item.value as string[]).includes('Completed')) {
                    items.push('completed');
                }
                item.value = items;
            } else if (item.columnField === 'validation_errors' || item.columnField === 'notes') {
                item.operatorValue = (item.value as string[]).includes('Yes') ? 'isNotEmpty' : 'isEmpty';
            }
        });

        filtersData.push({
            columnField: 'group_id',
            operatorValue: 'equals',
            value: groupId,
        });

        filtersData.push({
            columnField: 'tags',
            operatorValue: 'contains',
            value: tags,
        });

        return filtersData;
    };

    const getGiftCardData = async (type: 'prepaid' | 'paylater') => {
        const tags = type === 'prepaid' ? ['GiftAndPay'] : ['PayLater'];
        const filtersData = getFilters(filters, groupId, tags);
        
        const apiClient = new ApiClient();
        const response = await apiClient.getGiftCards(page * pageSize, pageSize, filtersData, orderBy);
        
        if (type === 'prepaid') {
            setTableRowsPrePaid(response.results);
        } else {
            setTableRowsPayLater(response.results);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            getGiftCardData('prepaid');
            getGiftCardData('paylater');
        }, 300)

        return () => { clearTimeout(handler) };
    }, [filters, orderBy, groupId, page, pageSize]);

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    };

    const getStatus = (card: GiftCard) => {
        return card.status === 'completed' ? 'Completed' : 'Pending Fulfillment';
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

    const getAllGiftCardsData = async (type: 'prepaid' | 'paylater') => {
        const tags = type === 'prepaid' ? ['Pre-Paid'] : ['Pay-Later'];
        const filtersData = getFilters(filters, groupId, tags);
        const apiClient = new ApiClient();
        const resp = await apiClient.getGiftCards(0, -1, filtersData, orderBy);
        return resp.results;
    };

    const handlePaymentSuccess = () => {
        setPaymentDialogOpen(false);
        getGiftCardData('prepaid');
        getGiftCardData('paylater');
        toast.success('Payment successful!');
    };

    const getCommonColumns = (): TableColumnsType<GiftCard> => [
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
            ...getColumnSelectedItemFilter({ 
                dataIndex: 'status', 
                filters, 
                handleSetFilters, 
                options: ['Pending Fulfillment', 'Completed'] 
            })
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
            key: "Payment Status",
            title: "Payment Status",
            align: "center",
            width: 150,
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

    const getPayLaterColumns = (): TableColumnsType<GiftCard> => {
        const commonColumns = getCommonColumns();
        return [
            ...commonColumns,
            {
                key: "action",
                title: "Action",
                align: "center",
                width: 120,
                fixed: 'right',
                render: (_, record) => (
                    record.amount_received !== record.total_amount && (
                        <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<PaymentIcon />}
                            onClick={() => {
                                setSelectedGiftCard(record);
                                setPaymentDialogOpen(true);
                            }}
                        >
                            Pay
                        </Button>
                    )
                ),
            },
        ];
    };

    return (
        <Box p={2} id="green-gift-history">
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
            }}>
            </Box>

            {/* Pre-Paid Table */}
            <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Pre-Paid Orders</Typography>
            <Box sx={{ height: 400, width: "100%", mb: 4 }}>
                <GeneralTable
                    loading={giftCardsData.loading}
                    rows={tableRowsPrePaid}
                    columns={getCommonColumns()}
                    totalRecords={tableRowsPrePaid.length} 
                    page={page + 1}
                    pageSize={pageSize}
                    onPaginationChange={(page: number, pageSize: number) => { setPage(page - 1); setPageSize(pageSize); }}
                    onDownload={() => getAllGiftCardsData('prepaid')}
                    footer
                    tableName="Pre-Paid Orders"
                />
            </Box>

            {/* Pay-Later Table */}
            <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Pay-Later Orders</Typography>
            <Box sx={{ height: 400, width: "100%", mb: 4 }}>
                <GeneralTable
                    loading={giftCardsData.loading}
                    rows={tableRowsPayLater}
                    columns={getPayLaterColumns()}
                    totalRecords={tableRowsPayLater.length}
                    page={page + 1}
                    pageSize={pageSize}
                    onPaginationChange={(page: number, pageSize: number) => { setPage(page - 1); setPageSize(pageSize); }}
                    onDownload={() => getAllGiftCardsData('paylater')}
                    footer
                    tableName="Pay-Later Orders"
                />
            </Box>

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
                    userEmail={userEmail || ""}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}
        </Box>
    );
};

export default CSRGiftHistory;
import { Box, Button, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useEffect, useState } from "react";
import ApiClient from "../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import { GiftCard } from "../../../types/gift_card";
import getColumnSearchProps, { getColumnDateFilter, getColumnSelectedItemFilter, getSortIcon } from "../../../components/Filter";
import { GridFilterItem } from "@mui/x-data-grid";
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

type OrderType = 'all' | 'prepaid' | 'paylater';

const CSRGiftHistory: React.FC<CSRGiftHistoryProps> = ({ groupId, selectedGroup }) => {

    const userName = localStorage.getItem("userName") || "Guest";
    const userEmail = localStorage.getItem("userEmail");

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [orderBy, setOrderBy] = useState<Order[]>([]);
    const [tableRows, setTableRows] = useState<GiftCard[]>([]);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
    const [orderType, setOrderType] = useState<OrderType>('all');


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

        if (tags.length > 0) {
            filtersData.push({
                columnField: 'tags',
                operatorValue: 'contains',
                value: tags,
            });
        }

        return filtersData;
    };

    const getGiftCardData = async () => {
        let tags: string[] = [];
        if (orderType === 'prepaid') {
            tags = ['GiftAndPay'];
        } else if (orderType === 'paylater') {
            tags = ['PayLater'];
        }

        const filtersData = getFilters(filters, groupId, tags);
        
        const apiClient = new ApiClient();
        const response = await apiClient.getGiftCards(page * pageSize, pageSize, filtersData, orderBy);
        setTableRows(response.results);
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            getGiftCardData();
        }, 300)

        return () => { clearTimeout(handler) };
    }, [filters, orderBy, groupId, page, pageSize, orderType]);

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

    const getAllGiftCardsData = async () => {
        let tags: string[] = [];
        if (orderType === 'prepaid') {
            tags = ['Pre-Paid'];
        } else if (orderType === 'paylater') {
            tags = ['Pay-Later'];
        }
        const filtersData = getFilters(filters, groupId, tags);
        const apiClient = new ApiClient();
        const resp = await apiClient.getGiftCards(0, -1, filtersData, orderBy);
        return resp.results;
    };

    const handlePaymentSuccess = () => {
        setPaymentDialogOpen(false);
        getGiftCardData();
        toast.success('Payment successful!');
    };

    const getColumns = (): TableColumnsType<GiftCard> => {
        const baseColumns: TableColumnsType<GiftCard> = [
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

        // Only add the actions column for Pay-Later or All views
        if (orderType !== 'prepaid') {
            baseColumns.push({
                key: "action",
                title: "Action",
                align: "center",
                width: 120,
                fixed: 'right',
                render: (_, record) => (
                    record.amount_received !== record.total_amount && record.tags?.includes('PayLater') && (
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
            });
        }

        return baseColumns;
    };

    return (
        <Box p={2} id="green-gift-history">
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
            }}>
                <Typography variant="h5">Gift Orders</Typography>
                <RadioGroup
                    row
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as OrderType)}
                >
                    <FormControlLabel value="prepaid" control={<Radio />} label="On The Go" />
                    <FormControlLabel value="paylater" control={<Radio />} label="Pay Later" />
                    <FormControlLabel value="all" control={<Radio />} label="All" />
                </RadioGroup>
            </Box>

            <Box sx={{ height: 400, width: "100%", mb: 4 }}>
                <GeneralTable
                    rows={tableRows}
                    columns={getColumns()}
                    totalRecords={tableRows.length}
                    page={page + 1}
                    pageSize={pageSize}
                    onPaginationChange={(page: number, pageSize: number) => { setPage(page - 1); setPageSize(pageSize); }}
                    onDownload={getAllGiftCardsData}
                    footer
                    tableName="Gift Orders"
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
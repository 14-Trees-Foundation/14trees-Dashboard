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


interface CSRGiftRequestsProps {
    groupId: number
    selectedGroup: Group
}

const CSRGiftRequests: React.FC<CSRGiftRequestsProps> = ({ groupId, selectedGroup }) => {

    const dispatch = useAppDispatch();
    const { getGiftCards } =
        bindActionCreators(giftCardActionCreators, dispatch);

    const userName = JSON.parse(localStorage.getItem("user") || "")
    const userEmail = localStorage.getItem("userEmail")

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [orderBy, setOrderBy] = useState<Order[]>([]);
    const [tableRows, setTableRows] = useState<GiftCard[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [formOpen, setFormOpen] = useState(false);

    let giftCards: GiftCard[] = [];
    const giftCardsData = useAppSelector((state: RootState) => state.giftCardsData);
    if (giftCardsData) {
        giftCards = Object.values(giftCardsData.giftCards);
        giftCards = giftCards.sort((a, b) => b.id - a.id);
    }

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
        const handler = setTimeout(() => {
            getGiftCardData();
        }, 300)

        return () => { clearTimeout(handler) };
    }, [filters, orderBy, groupId]);

    useEffect(() => {

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
        const filtersData = JSON.parse(JSON.stringify(Object.values(filters))) as GridFilterItem[];
        filtersData.forEach((item) => {
            if (item.columnField === 'status') {
                const items: string[] = [];
                if ((item.value as string[]).includes('Pending')) {
                    items.push('pending_plot_selection')
                }

                if ((item.value as string[]).includes('Completed')) {
                    items.push('pending_assignment')
                    items.push('completed')
                }

                item.value = items;
            } else if (item.columnField === 'validation_errors' || item.columnField === 'notes') {
                if ((item.value as string[]).includes('Yes')) {
                    item.operatorValue = 'isNotEmpty';
                } else {
                    item.operatorValue = 'isEmpty'
                }
            }
        })

        filtersData.push({
            columnField: 'group_id',
            operatorValue: 'equals',
            value: groupId,
        })

        return filtersData;
    }

    const getGiftCardData = async () => {

        const filtersData = getFilters(filters, groupId);

        getGiftCards(page * pageSize, pageSize, filtersData, orderBy);
    };

    const getAllGiftCardsData = async () => {
        let filtersData = getFilters(filters, groupId);
        const apiClient = new ApiClient();
        const resp = await apiClient.getGiftCards(0, -1, filtersData, orderBy);
        return resp.results;
    };


    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const getStatus = (card: GiftCard) => {
        if (card.status === 'pending_plot_selection') {
            return "Pending";
        }

        return 'Completed';
    }

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
        }

        if (sorter.field) {
            setPage(0);
            updateOrder();
            setOrderBy(newOrder);
        }
    }

    const getSortableHeader = (header: string, key: string) => {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                {header} {getSortIcon(key, orderBy.find((item) => item.column === key)?.order, handleSortingChange)}
            </div>
        )
    }

    const columns: TableColumnsType<GiftCard> = [
        {
            dataIndex: "id",
            key: "Req. No.",
            title: "Req. No.",
            align: "right",
            width: 50,
        },
        {
            dataIndex: "no_of_cards",
            key: "# Trees",
            title: getSortableHeader("# Cards", 'no_of_cards'),
            align: "center",
            width: 100,
        },
        {
            dataIndex: "created_by_name",
            key: "Created by",
            title: "Created by",
            align: "center",
            width: 200,
            hidden: true,
            ...getColumnSearchProps('created_by_name', filters, handleSetFilters)
        },
        {
            dataIndex: "tags",
            key: "Tags",
            title: "Tags",
            align: "center",
            width: 200,
            hidden: true,
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
            ...getColumnSelectedItemFilter({ dataIndex: 'status', filters, handleSetFilters, options: ['Pending', 'Completed'] })
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
            hidden: true,
        },
        {
            dataIndex: "payment_status",
            key: "Payment Status",
            title: "Payment Status",
            align: "center",
            width: 150,
            hidden: true,
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
                <Typography variant="h4" ml={1}>Orders</Typography>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => setFormOpen(true)}
                    style={{ marginLeft: 10 }}
                >
                    Purchase Gifts
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

            {selectedGroup && formOpen && <PurchaseTreesForm
                open={formOpen}
                onClose={() => { setFormOpen(false) }}
                corporateName={selectedGroup.name}
                corporateLogo={selectedGroup.logo_url ?? undefined}
                groupId={selectedGroup.id}
                userName={userName}
                userEmail={userEmail || ""}
            />}
        </Box>
    );
}

export default CSRGiftRequests;
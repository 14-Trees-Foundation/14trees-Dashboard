import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ApiClient from "../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import { GiftCard } from "../../../types/gift_card";
import getColumnSearchProps, { getColumnDateFilter, getColumnSelectedItemFilter, getSortIcon } from "../../../components/Filter";
import { GridFilterItem } from "@mui/x-data-grid";
import * as giftCardActionCreators from "../../../redux/actions/giftCardActions";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import { RootState } from "../../../redux/store/store";
import { Dropdown, Menu, TableColumnsType } from "antd";
import { Download, ErrorOutline, MenuOutlined, Slideshow, Wysiwyg } from "@mui/icons-material";
import { getHumanReadableDate } from "../../../helpers/utils";
import { useAuth } from "../auth/auth";
import { Order, UserRoles } from "../../../types/common";
import GeneralTable from "../../../components/GenTable";
import GiftCardRequestInfo from "../gift/GiftCardRequestInfo";

const pendingPlotSelection = 'Pending Plot & Tree(s) Reservation';

interface CSRGiftRequestsProps {
    groupId: number
}

const CSRGiftRequests: React.FC<CSRGiftRequestsProps> = ({ groupId }) => {

    const dispatch = useAppDispatch();
    const { getGiftCards } =
        bindActionCreators(giftCardActionCreators, dispatch);

    let auth = useAuth();
    const authRef = useRef<any>(null);


    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [orderBy, setOrderBy] = useState<Order[]>([]);
    const [tableRows, setTableRows] = useState<GiftCard[]>([]);
    const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [infoModal, setInfoModal] = useState(false);

    let giftCards: GiftCard[] = [];
    const giftCardsData = useAppSelector((state: RootState) => state.giftCardsData);
    if (giftCardsData) {
        giftCards = Object.values(giftCardsData.giftCards);
        giftCards = giftCards.sort((a, b) => b.id - a.id);
    }

    useEffect(() => {
        authRef.current = auth;
    }, [auth])

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
        authRef.current = auth;
    }, [auth])

    useEffect(() => {
        const handler = setTimeout(() => {
            getGiftCardData();
        }, 300)

        return () => { clearTimeout(handler) };
    }, [filters, orderBy, auth, groupId]);

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
                item.value = (item.value as string[]).map(value => {
                    if (value === pendingPlotSelection) return 'pending_plot_selection';
                    else if (value === 'Pending assignment') return 'pending_assignment';
                    else return 'completed'
                })
            } else if (item.columnField === 'validation_errors' || item.columnField === 'notes') {
                if ((item.value as string[]).includes('Yes')) {
                    item.operatorValue = 'isNotEmpty';
                } else {
                    item.operatorValue = 'isEmpty'
                }
            }
        })

        // if normal user the fetch user specific data
        if (authRef.current?.roles?.includes(UserRoles.User) && authRef.current?.userId) {
            filtersData.push({
                columnField: 'user_id',
                operatorValue: 'equals',
                value: authRef.current.userId
            })
        }

        filtersData.push({
            columnField: 'group_id',
            operatorValue: 'equals',
            value: groupId,
        })

        return filtersData;
    }

    const getGiftCardData = async () => {

        // check if user logged in
        if (!authRef.current?.signedin) return;

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

    const handleDownloadCards = async (id: number, name: string, type: 'pdf' | 'ppt' | 'zip') => {
        try {
            const apiClient = new ApiClient();
            const data = await apiClient.downloadGiftCards(id, type);

            const blob = new Blob([data], { type: 'application/zip' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = name + '.' + type;
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the file:', error);
        }

    }

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

    const getActionsMenu = (record: GiftCard) => (
        <Menu>
            <Menu.ItemGroup>
                <Menu.Item key="00" onClick={() => { setSelectedGiftCard(record); setInfoModal(true); }} icon={<Wysiwyg />}>
                    View Summary
                </Menu.Item>
            </Menu.ItemGroup>
            {(record.presentation_id || record.presentation_ids.length > 0) && <Menu.Divider style={{ backgroundColor: '#ccc' }} />}
            {(record.presentation_id || record.presentation_ids.length > 0) && <Menu.ItemGroup>
                {record.presentation_id && <Menu.Item key="30" onClick={() => { handleDownloadCards(record.id, record.user_name + '_' + record.no_of_cards, 'zip') }} icon={<Download />}>
                    Download Tree Cards
                </Menu.Item>}
                <Menu.Item key="31" onClick={() => { window.open('https://docs.google.com/presentation/d/' + (record.presentation_id ? record.presentation_id : record.presentation_ids[0])); }} icon={<Slideshow />}>
                    Tree Cards Slide
                </Menu.Item>
            </Menu.ItemGroup>}
        </Menu>
    );

    const columns: TableColumnsType<GiftCard> = [
        {
            dataIndex: "id",
            key: "Req. No.",
            title: "Req. No.",
            align: "right",
            width: 100,
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
            key: "# Cards",
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
            ...getColumnSelectedItemFilter({ dataIndex: 'status', filters, handleSetFilters, options: [pendingPlotSelection, 'Pending assignment', 'Completed'] })
        },
        {
            dataIndex: "validation_errors",
            key: "Validation Errors",
            title: "Validation Errors",
            align: "center",
            width: 120,
            hidden: true,
            render: (value) => value && value.length > 0 ? (
                <Tooltip title={<div>{getValidationErrors(value).map(item => (<p>{item}</p>))}</div>}>
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
            hidden: true,
            ...getColumnSelectedItemFilter({ dataIndex: 'sponsorship_type', filters, handleSetFilters, options: ['Unverified', 'Pledged', 'Promotional', 'Unsponsored Visit', 'Donation Received'] })
        },
        {
            dataIndex: "donation_receipt_number",
            key: "Donation Receipt No.",
            title: "Donation Receipt No.",
            align: "center",
            width: 200,
            hidden: true,
            ...getColumnSearchProps('donation_receipt_number', filters, handleSetFilters)
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
                    <Dropdown overlay={getActionsMenu(record)} trigger={['click']}>
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
    ]

    return (
        <Box mt={10} id="green-gift-contributions">
            <Typography variant="h4" ml={1}>Green Gift Contributions</Typography>
            <Typography variant="subtitle1" ml={1} mb={1}>Track tree gifting activities initiated by your organization and the impact of these eco-friendly gifts.</Typography>
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
                    tableName="Green Gift Contributions"
                />
            </Box>

            <GiftCardRequestInfo
                open={infoModal}
                onClose={() => { setInfoModal(false) }}
                data={selectedGiftCard}
            />
        </Box>
    );
}

export default CSRGiftRequests;
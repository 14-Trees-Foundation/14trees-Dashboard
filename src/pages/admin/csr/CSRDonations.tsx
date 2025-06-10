import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ApiClient from "../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import { Donation } from "../../../types/donation";
import getColumnSearchProps, { getColumnDateFilter, getColumnSelectedItemFilter, getSortIcon } from "../../../components/Filter";
import { GridFilterItem } from "@mui/x-data-grid";
import * as donationActionCreators from "../../../redux/actions/donationActions";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import { RootState } from "../../../redux/store/store";
import { TableColumnsType } from "antd";
import { getHumanReadableDate } from "../../../helpers/utils";
import { Order } from "../../../types/common";
import { Group } from "../../../types/Group";
import DonationTreesForm from "./form/DonateTreesForm";
import GeneralTable from "../../../components/GenTable";
import PaymentIcon from '@mui/icons-material/Payment';
import PaymentDialog from "./components/PaymentDialog";

interface CSRDonationsProps {
    selectedGroup: Group
}

const CSRDonations: React.FC<CSRDonationsProps> = ({ selectedGroup }) => {
    const dispatch = useAppDispatch();
    const { getDonations } = bindActionCreators(donationActionCreators, dispatch);

    const userName = localStorage.getItem("userName") || "Guest";
    const userEmail = localStorage.getItem("userEmail");

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [orderBy, setOrderBy] = useState<Order[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [tableRows, setTableRows] = useState<Donation[]>([]);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

    const donationsData = useAppSelector((state: RootState) => state.donationsData);

    useEffect(() => {
        const handler = setTimeout(() => {
            getDonationData();
        }, 300)

        return () => { clearTimeout(handler) };
    }, [filters, orderBy, selectedGroup.id]);

    useEffect(() => {
        if (donationsData.loading) return;
        
        const handler = setTimeout(() => {
            const records: Donation[] = [];
            const maxLength = Math.min((page + 1) * pageSize, donationsData.totalDonations);
            for (let i = page * pageSize; i < maxLength; i++) {
                if (Object.hasOwn(donationsData.paginationMapping, i)) {
                    const id = donationsData.paginationMapping[i];
                    const record = donationsData.donations[id];
                    if (record) {
                        records.push(record);
                    }
                } else {
                    getDonationData();
                    break;
                }
            }

            setTableRows(records);
        }, 300)

        return () => { clearTimeout(handler) };
    }, [pageSize, page, donationsData]);

    const getFilters = (filters: any, groupId: number) => {
        const filtersData = JSON.parse(JSON.stringify(Object.values(filters))) as GridFilterItem[];
        filtersData.forEach((item) => {
            if (item.columnField === 'status') {
                const items: string[] = [];
                if ((item.value as string[]).includes('Pending')) {
                    items.push('pending_plot_selection');
                }
                if ((item.value as string[]).includes('Completed')) {
                    items.push('pending_assignment');
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

        return filtersData;
    };

    const getDonationData = async () => {
        const filtersData = getFilters(filters, selectedGroup.id);
        getDonations(page * pageSize, pageSize, filtersData, orderBy);
    };

    const handleFormSuccess = () => {
        setFormOpen(false);
        setPage(0);
        getDonationData();
    };

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
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

    const getAllDonationsData = async () => {
        const filtersData = getFilters(filters, selectedGroup.id);
        const apiClient = new ApiClient();
        const resp = await apiClient.getDonations(0, -1, filtersData, orderBy);
        return resp.results;
    };

    const handlePaymentSuccess = () => {
        setPaymentDialogOpen(false);
        getDonationData();
        toast.success('Payment successful!');
    };

    const columns: TableColumnsType<Donation> = [
        {
            dataIndex: "id",
            key: "Don. Id",
            title: "Don. Id",
            align: "center",
            width: 100,
          },
          {
            dataIndex: "user_name",
            key: "Donor Name",
            title: "Donor Name",
            align: "center",
            width: 200,
            ...getColumnSearchProps('user_name', filters, handleSetFilters)
        },
          {
            dataIndex: "amount_donated",
            key: "Donation Amount",
            title: getSortableHeader("Donation Amount", 'amount_donated'),
            align: "center",
            width: 120,
          },
 /*       {
            dataIndex: "payment_status",
            key: "Payment Status",
            title: "Payment Status",
            align: "center",
            width: 150,
        }, */
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
            key: "action",
            title: "Action",
            align: "center",
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                record.amount_donated && (
                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<PaymentIcon />}
                        onClick={() => {
                            setSelectedDonation(record);
                            setPaymentDialogOpen(true);
                        }}
                    >
                        Pay
                    </Button>
                )
            ),
        },
    ];

    return (
        <Box p={2} id="csr-donations">
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
            }}>
                <Typography variant="h4" ml={1}>Donations</Typography>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => setFormOpen(true)}
                    style={{ marginLeft: 10 }}
                >
                    Donate Trees
                </Button>
            </Box>
            <Box sx={{ height: 840, width: "100%" }}>
                <GeneralTable
                    loading={donationsData.loading}
                    rows={tableRows}
                    columns={columns}
                    totalRecords={donationsData.totalDonations}
                    page={page}
                    pageSize={pageSize}
                    onPaginationChange={(page: number, pageSize: number) => { setPage(page - 1); setPageSize(pageSize); }}
                    onDownload={getAllDonationsData}
                    footer
                    tableName="Donations"
                />
            </Box>

            {formOpen && (
                <DonationTreesForm
                    open={formOpen}
                    onClose={() => setFormOpen(false)}
                    onSuccess={handleFormSuccess}
                    corporateName={selectedGroup.name}
                    corporateLogo={selectedGroup.logo_url ?? undefined}
                    groupId={selectedGroup.id}
                    userName={userName}
                    userEmail={userEmail || ""}
                />
            )}

            {selectedDonation && (
                <PaymentDialog
                    open={paymentDialogOpen}
                    onClose={() => {
                        setPaymentDialogOpen(false);
                        setSelectedDonation(null);
                    }}
                    paymentId={selectedDonation.payment_id!}
                    donationId={selectedDonation.id}
                    requestId={selectedDonation.request_id}
                    totalAmount={selectedDonation.amount_donated}
                    userName={userName}
                    userEmail={userEmail || ""}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}
        </Box>
    );
};

export default CSRDonations;
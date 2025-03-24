import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
    Box,
    Link,
} from '@mui/material';
import { format } from 'date-fns';
import { GridFilterItem } from '@mui/x-data-grid';
import GeneralTable from '../../../components/GenTable';
import ApiClient from '../../../api/apiClient/apiClient';
import { GiftCardUser } from '../../../types/gift_card';
import getColumnSearchProps from '../../../components/Filter';
import { toast } from 'react-toastify';

interface GiftCardRequestInfoProps {
    open: boolean
    onClose: () => void
    data: any
}

const GiftCardRequestInfo: React.FC<GiftCardRequestInfoProps> = ({ open, onClose, data }) => {

    const [users, setUsers] = useState<GiftCardUser[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!data?.id) return;
            setLoading(true);
            try {
                const apiClient = new ApiClient();
                const filtersArray = Object.entries(filters).map(([key, value]) => ({
                    columnField: key,
                    operatorValue: value.operatorValue,
                    value: value.value
                }));
    
                const response = await apiClient.getBookedGiftTrees(
                    data.id,
                    page,
                    pageSize,
                    filtersArray 
                );
                setUsers(response.results);
                setTotalRecords(response.total);
            } catch (error: unknown) {
                // Proper error handling
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [data?.id, page, pageSize, filters]);

    const columns: any[] = [
        {
            dataIndex: "sapling_id",
            key: "sapling_id",
            title: "Sapling ID",
            align: "center",
            width: 100,
        },
        {
            dataIndex: "plant_type",
            key: "plant_type",
            title: "Tree Name",
            align: "center",
            width: 200,
        },
        {
            dataIndex: "scientific_name",
            key: "scientific_name",
            title: "Scientific Name",
            align: "center",
            width: 200,
        },
        {
            title: 'Recipient',
            dataIndex: 'recipient_name',
            key: 'recipient_name',
            width: 200,
            ...getColumnSearchProps('recipient_name', filters, setFilters),
        },
        {
            title: 'Assigned To',
            dataIndex: 'assignee_name',
            key: 'assignee_name',
            width: 200,
            ...getColumnSearchProps('assignee_name', filters, setFilters),
        },
        {
            dataIndex: "dashboard_link",
            key: "dashboard_link",
            title: " ",
            align: "center",
            width: 200,
            render: (value: any, record: any) => (<div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Button
                    variant="outlined"
                    color="success"
                    style={{ margin: "0 5px" }}
                    onClick={() => {
                        const { hostname, host } = window.location;
                        if (hostname === "localhost" || hostname === "127.0.0.1") {
                            window.open("http://" + host + "/profile/" + record.sapling_id);
                        } else {
                            window.open("https://" + hostname + "/profile/" + record.sapling_id);
                        }
                    }}
                >
                    {record.assigned ? "Dashboard" : "Redeem"}
                </Button>
            </div>)
        },
    ]


    const getStatus = (status: string) => {
        if (status === 'pending_plot_selection') {
            return 'Pending Plot Selection';
        } else if (status === 'pending_assignment') {
            return 'Pending assignment';
        } else if (status === 'pending_gift_cards') {
            return 'Pending tree cards creation';
        } else {
            return 'Completed';
        }
    }

    if (!data) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                Request summary
            </DialogTitle>
            <DialogContent dividers>
                {/* User Details */}
                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>Sponsor Details</Typography>
                    <Typography><strong>Name:</strong> {data.user_name || 'N/A'}</Typography>
                    <Typography><strong>Email:</strong> {data.user_email || 'N/A'}</Typography>
                    <Typography><strong>Phone:</strong> {data.user_phone || 'N/A'}</Typography>
                </Box>

                <Divider />

                {/* Group Information */}
                {data.group_name && <Box mt={2} mb={2}>
                    <Typography variant="h6" gutterBottom>Corporate/Organization Details</Typography>
                    <Typography><strong>Corporate:</strong> {data.group_name || 'N/A'}</Typography>
                    <Box display="flex" >
                        <Typography><strong>Logo:</strong></Typography>
                        <img
                            src={data.logo_url}
                            alt={data.group_name}
                            style={{ marginLeft: 10, maxHeight: 50, width: 'auto' }}
                        />
                    </Box>
                </Box>}

                <Divider />

                {/* Messages */}
                <Box mt={2} mb={2}>
                    <Typography variant="h6" gutterBottom>Messages</Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Primary Message:</strong> {data.primary_message || 'N/A'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Secondary Message:</strong> {data.secondary_message || 'N/A'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Logo Message:</strong> {data.logo_message || 'N/A'}
                    </Typography>
                </Box>

                <Divider />

                {/* Additional Information */}
                <Box mt={2} mb={2}>
                    <Typography variant="h6" gutterBottom>Additional Information</Typography>
                    <Typography><strong>Event Name:</strong> {data.event_name || 'N/A'}</Typography>
                    <Typography><strong>Planted By:</strong> {data.planted_by || 'N/A'}</Typography>
                    <Typography><strong>Total No. of Cards Requested:</strong> {data.no_of_cards}</Typography>
                    <Typography>
                        <strong>Status:</strong> {getStatus(data.status)}
                    </Typography>
                </Box>

                <Divider />

                {/* Links */}
                <Box mt={2} mb={2}>
                    <Typography variant="h6" gutterBottom>Links</Typography>
                    {data.users_csv_file_url ? (
                        <Typography>
                            <Link href={data.users_csv_file_url} target="_blank" rel="noopener">
                                Download Recipients CSV
                            </Link>
                        </Typography>
                    ) : (
                        <Typography>
                            <strong>Recipient details:</strong> N/A
                        </Typography>
                    )}
                    {data.presentation_id &&
                        <Typography>
                            <Link href={'https://docs.google.com/presentation/d/' + data.presentation_id} target="_blank" rel="noopener">
                                Tree Card Slides
                            </Link>
                        </Typography>}
                    {data.presentation_ids.length > 0 &&
                        <Typography>
                            <Link href={'https://docs.google.com/presentation/d/' + data.presentation_ids[0]} target="_blank" rel="noopener">
                                Tree Card Slides
                            </Link>
                        </Typography>}
                    {(!data.presentation_id && !data.presentation_ids?.length) &&
                        <Typography>
                            <strong>Tree Card Slides:</strong> N/A
                        </Typography>}
                </Box>

                <Divider />
                
                {users.length > 0 && <div>
                    <Box mt={2} mb={2}>
                        <Typography>Total trees assigned: {data.assigned}</Typography>
                        <GeneralTable
                            loading={loading}
                            columns={columns}
                            rows={users} 
                            totalRecords={totalRecords}
                            page={page}
                            pageSize={pageSize}
                            onPaginationChange={(newPage: number, newPageSize: number) => { 
                                setPage(newPage - 1); 
                                setPageSize(newPageSize); 
                            }}
                            onDownload={async () => users}
                            footer
                            tableName='Gift Request Users'
                        />
                    </Box>
                    <Divider />
                </div>}

                {/* Extra */}
                <Box mt={2} mb={2}>
                    <Typography variant="body2" color="textSecondary">
                        <strong>Created At:</strong> {format(new Date(data.created_at), 'yyyy-MM-dd HH:mm:ss')}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        <strong>Updated At:</strong> {format(new Date(data.updated_at), 'yyyy-MM-dd HH:mm:ss')}
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GiftCardRequestInfo;

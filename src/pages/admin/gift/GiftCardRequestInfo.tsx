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
import GeneralTable from '../../../components/GenTable';
import ApiClient from '../../../api/apiClient/apiClient';
import { GiftCardUser } from '../../../types/gift_card';
import { LinkOutlined } from '@mui/icons-material';

interface GiftCardRequestInfoProps {
    open: boolean
    onClose: () => void
    data: any
}

const GiftCardRequestInfo: React.FC<GiftCardRequestInfoProps> = ({ open, onClose, data }) => {

    const [users, setUsers] = useState<GiftCardUser[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        const getGiftCards = async () => {
            const apiClient = new ApiClient();
            const resp = await apiClient.getBookedGiftCards(data.id, 0, -1);
            setUsers(resp.results.filter((item: any) => item.assigned));
        }

        if (open) getGiftCards();
    }, [open, data])

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
            dataIndex: "assigned_to_name",
            key: "assigned_to",
            title: "Assigned to",
            align: "center",
            width: 200,
        },
        {
            dataIndex: "dashboard_link",
            key: "dashboard_link",
            title: "Dashboard Link",
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
                    <LinkOutlined />
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
            return 'Pending Gift cards creation';
        } else {
            return 'Completed';
        }
    }

    if (!data) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                Event Information
            </DialogTitle>
            <DialogContent dividers>
                {/* User Details */}
                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>User Details</Typography>
                    <Typography><strong>Name:</strong> {data.user_name || 'N/A'}</Typography>
                    <Typography><strong>Email:</strong> {data.user_email || 'N/A'}</Typography>
                    <Typography><strong>Phone:</strong> {data.user_phone || 'N/A'}</Typography>
                </Box>

                <Divider />

                {/* Group Information */}
                <Box mt={2} mb={2}>
                    <Typography variant="h6" gutterBottom>Group Information</Typography>
                    <Typography><strong>Corporate:</strong> {data.group_name || 'N/A'}</Typography>
                    <Box display="flex" >
                        <Typography><strong>Logo:</strong></Typography>
                        <img
                            src={data.logo_url}
                            alt={data.group_name}
                            style={{ marginLeft: 10, maxHeight: 50, width: 'auto' }}
                        />
                    </Box>
                </Box>

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
                                Download Users CSV
                            </Link>
                        </Typography>
                    ) : (
                        <Typography>
                            <strong>User details:</strong> N/A
                        </Typography>
                    )}
                    {data.presentation_id ? (
                        <Typography>
                            <Link href={'https://docs.google.com/presentation/d/' + data.presentation_id} target="_blank" rel="noopener">
                                Gift Card Slides
                            </Link>
                        </Typography>
                    ) : (
                        <Typography>
                            <strong>Gift Card Slides:</strong> N/A
                        </Typography>
                    )}
                </Box>

                <Divider />
                
                {users.length > 0 && <div>
                    <Box mt={2} mb={2}>
                        <GeneralTable
                            loading={false}
                            columns={columns}
                            rows={users}
                            totalRecords={users.length}
                            page={page}
                            pageSize={pageSize}
                            onPaginationChange={(page: number, pageSize: number) => { setPage(page - 1); setPageSize(pageSize); }}
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

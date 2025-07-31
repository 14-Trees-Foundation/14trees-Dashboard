import { Box, Chip, ToggleButton, ToggleButtonGroup, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { User } from "../../../../types/user";
import { AutocompleteWithPagination } from "../../../../components/AutoComplete";
import * as userActionCreators from "../../../../redux/actions/userActions"
import ApiClient from "../../../../api/apiClient/apiClient";
import { toast } from "react-toastify";

interface CombineUserFormProps {
    primaryUser: User | null
    secondaryUser: User | null
    onPrimaryUserChange: (user: User | null) => void
    onSecondaryUserChange: (user: User | null) => void
    deleteSecondary: boolean
    onDeleteSecondaryChange: (value: boolean) => void
}

const CombineUserForm: React.FC<CombineUserFormProps> = ({ primaryUser, secondaryUser, deleteSecondary, onDeleteSecondaryChange, onPrimaryUserChange, onSecondaryUserChange }) => {

    const dispatch = useAppDispatch();
    const { searchUsers } = bindActionCreators(userActionCreators, dispatch);

    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [userSearchQuery2, setUserSearchQuery2] = useState('');
    const [treesCount1, setTreesCount1] = useState<any>(null)
    const [treesCount2, setTreesCount2] = useState<any>(null)

    let users: User[] = [];
    const usersData = useAppSelector((state) => state.searchUsersData);
    if (usersData) {
        users = Object.values(usersData.users);
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            if (userSearchQuery.length >= 3) searchUsers(userSearchQuery);
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [userSearchQuery]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (userSearchQuery2.length >= 3) searchUsers(userSearchQuery2);
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [userSearchQuery2]);

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (primaryUser) {
                const data = await getTreeCountForUser(primaryUser.id);
                setTreesCount1(data);
            } else {
                setTreesCount1(null);
            }
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [primaryUser]);

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (secondaryUser) {
                const data = await getTreeCountForUser(secondaryUser.id);
                setTreesCount2(data);
            } else {
                setTreesCount2(null);
            }
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [secondaryUser]);

    const getTreeCountForUser = async (userId: number) => {
        try {
            const apiClient = new ApiClient();
            const resp = apiClient.getTreesCountForUser(userId);
            return resp;
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const renderUserComparison = () => {
        if (!treesCount1 || !treesCount2) return null;

        const metrics = [
            // Trees
            { category: 'Trees', label: 'Reserved Trees', key: 'trees.mapped_trees' },
            { category: 'Trees', label: 'Assigned Trees', key: 'trees.assigned_trees' },
            { category: 'Trees', label: 'Sponsored Trees', key: 'trees.sponsored_trees' },
            { category: 'Trees', label: 'Gifted Trees', key: 'trees.gifted_trees' },
            { category: 'Trees', label: 'Received Gift Trees', key: 'trees.received_gift_trees' },
            
            // Donations
            { category: 'Donations', label: 'As Donor', key: 'donations.as_donor' },
            { category: 'Donations', label: 'As Processor', key: 'donations.as_processor' },
            { category: 'Donations', label: 'As Creator', key: 'donations.as_creator' },
            
            // Donation Users
            { category: 'Donation Users', label: 'As Assignee', key: 'donation_users.as_assignee' },
            { category: 'Donation Users', label: 'As Recipient', key: 'donation_users.as_recipient' },
            
            // Gift Cards
            { category: 'Gift Cards', label: 'Gifted To', key: 'gift_cards.gifted_to' },
            { category: 'Gift Cards', label: 'Assigned To', key: 'gift_cards.assigned_to' },
            
            // Gift Card Requests
            { category: 'Gift Card Requests', label: 'As User', key: 'gift_card_requests.as_user' },
            { category: 'Gift Card Requests', label: 'As Sponsor', key: 'gift_card_requests.as_sponsor' },
            { category: 'Gift Card Requests', label: 'As Creator', key: 'gift_card_requests.as_creator' },
            { category: 'Gift Card Requests', label: 'As Processor', key: 'gift_card_requests.as_processor' },
            
            // Gift Request Users
            { category: 'Gift Request Users', label: 'As Recipient', key: 'gift_request_users.as_recipient' },
            { category: 'Gift Request Users', label: 'As Assignee', key: 'gift_request_users.as_assignee' },
            
            // Gift Redeem Transactions
            { category: 'Gift Redeem Transactions', label: 'As Recipient', key: 'gift_redeem_transactions.as_recipient' },
            { category: 'Gift Redeem Transactions', label: 'As Creator', key: 'gift_redeem_transactions.as_creator' },
            
            // User Relations
            { category: 'User Relations', label: 'As Primary', key: 'user_relations.as_primary' },
            { category: 'User Relations', label: 'As Secondary', key: 'user_relations.as_secondary' },
            
            // Other
            { category: 'Membership', label: 'User Groups', key: 'user_groups' },
            { category: 'Visits', label: 'Visit Users', key: 'visit_users' },
            { category: 'Other', label: 'Albums', key: 'albums' },
            { category: 'Other', label: 'Events Assigned By', key: 'events_assigned_by' },
            { category: 'Self-Serve Portal', label: 'View Permissions', key: 'view_permissions' },
            { category: 'Summary', label: 'Total Relationships', key: 'total_relationships' },
        ];

        const getValue = (obj: any, path: string) => {
            return path.split('.').reduce((o, p) => o && o[p], obj) || 0;
        };

        return (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Category</strong></TableCell>
                            <TableCell><strong>Metric</strong></TableCell>
                            <TableCell align="center"><strong>Primary User</strong></TableCell>
                            <TableCell align="center"><strong>Secondary User</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {metrics.map((metric, index) => {
                            const secondaryValue = getValue(treesCount2, metric.key);
                            const hasSecondaryData = secondaryValue > 0;
                            
                            return (
                                <TableRow 
                                    key={index} 
                                    sx={{ 
                                        // Default alternating row colors (only when no secondary data)
                                        ...(!hasSecondaryData && {
                                            '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }
                                        }),
                                        // Highlight rows with secondary user data
                                        ...(hasSecondaryData && {
                                            backgroundColor: 'warning.light',
                                            '&:hover': { backgroundColor: 'warning.main' },
                                            '& .MuiTableCell-root': { fontWeight: 'bold' }
                                        })
                                    }}
                                >
                                    <TableCell>{metric.category}</TableCell>
                                    <TableCell>{metric.label}</TableCell>
                                    <TableCell align="center">{getValue(treesCount1, metric.key)}</TableCell>
                                    <TableCell align="center">{secondaryValue}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Box
            sx={{
                padding: 2,
                display: "flex",
                flexDirection: 'column',
            }}
        >
            <Box mt={2}>
                <Typography>Select primary user</Typography>
                <AutocompleteWithPagination
                    label="Enter your name or email to search"
                    value={primaryUser}
                    options={users}
                    getOptionLabel={(user) => `${user.name} (${user.email})`}
                    onChange={(event, value: User) => onPrimaryUserChange(value)}
                    onInputChange={(event) => { setUserSearchQuery(event.target.value); }}
                    fullWidth
                    size="medium"
                />
            </Box>
            <Box mt={2}>
                <Typography>Select secondary user</Typography>
                <AutocompleteWithPagination
                    label="Enter your name or email to search"
                    value={secondaryUser}
                    options={users}
                    getOptionLabel={(user) => `${user.name} (${user.email})`}
                    onChange={(event, value: User) => onSecondaryUserChange(value)}
                    onInputChange={(event) => { setUserSearchQuery2(event.target.value); }}
                    fullWidth
                    size="medium"
                />
            </Box>
            
            {/* Render user comparison table */}
            {renderUserComparison()}

            <Box
                mt={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography mr={5}>Do you want to delete secondary user?</Typography>
                <ToggleButtonGroup
                    color="success"
                    value={deleteSecondary ? "yes" : "no"}
                    exclusive
                    onChange={(e, value) => { onDeleteSecondaryChange(value === "yes" ? true : false); }}
                    aria-label="Platform"
                    size="small"
                >
                    <ToggleButton value="yes">Yes</ToggleButton>
                    <ToggleButton value="no">No</ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Box>
    )
}

export default CombineUserForm;
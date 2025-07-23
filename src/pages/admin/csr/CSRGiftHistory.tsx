import { Box, Typography, RadioGroup, FormControlLabel, Radio, Chip, Card, CardContent, Grid } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import ApiClient from "../../../api/apiClient/apiClient";
import { GiftRedeemTransaction } from "../../../types/gift_redeem_transaction";
import getColumnSearchProps, { getColumnDateFilter, getSortIcon } from "../../../components/Filter";
import { GridFilterItem } from "@mui/x-data-grid";
import { TableColumnsType } from "antd";
import { getHumanReadableDate } from "../../../helpers/utils";
import { Order } from "../../../types/common";
import GeneralTable from "../../../components/GenTable";
import { Group } from "../../../types/Group";

const useStyles = makeStyles((theme) =>
    createStyles({
        analyticsCard: {
            width: "100%",
            maxWidth: "300px",
            minHeight: "120px",
            borderRadius: "15px",
            textAlign: "center",
            padding: "16px",
            margin: "8px",
            background: "linear-gradient(145deg, #9faca3, #bdccc2)",
            boxShadow: "7px 7px 14px #9eaaa1,-7px -7px 14px #c4d4c9",
        },
    })
);

interface CSRGiftHistoryProps {
    groupId: number;
    selectedGroup: Group;
}

type SourceTypeFilter = 'all' | 'fresh_request' | 'pre_purchased';

const CSRGiftHistory: React.FC<CSRGiftHistoryProps> = ({ groupId, selectedGroup }) => {
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [orderBy, setOrderBy] = useState<Order[]>([]);
    const [tableRows, setTableRows] = useState<GiftRedeemTransaction[]>([]);
    const [sourceTypeFilter, setSourceTypeFilter] = useState<SourceTypeFilter>('all');
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [allTransactions, setAllTransactions] = useState<GiftRedeemTransaction[]>([]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setPage(0);
            getTransactionData();
        }, 300);

        return () => { clearTimeout(handler) };
    }, [filters, orderBy, sourceTypeFilter, groupId]);

    useEffect(() => {
        getTransactionData();
    }, [page, pageSize]);

    const getTransactionData = async () => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            
            // Always fetch all transactions to enable proper filtering
            let transactionsToUse = allTransactions;
            if (allTransactions.length === 0) {
                const allResponse = await apiClient.getGiftTransactions(0, -1, 'group', groupId);
                setAllTransactions(allResponse.results);
                transactionsToUse = allResponse.results;
            }
            
            // Filter by source type first
            let filteredTransactions = transactionsToUse;
            if (sourceTypeFilter !== 'all') {
                filteredTransactions = transactionsToUse.filter(transaction => 
                    transaction.gift_source_type === sourceTypeFilter
                );
            }
            
            // Apply pagination to filtered results
            const startIndex = page * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
            
            setTableRows(paginatedTransactions);
            setTotalRecords(filteredTransactions.length);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTableRows([]);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
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

    const getAllTransactionData = async () => {
        // Use the already fetched transactions if available
        let transactionsToUse = allTransactions;
        if (allTransactions.length === 0) {
            const apiClient = new ApiClient();
            const response = await apiClient.getGiftTransactions(0, -1, 'group', groupId);
            transactionsToUse = response.results;
        }
        
        // Filter by source type if not 'all'
        if (sourceTypeFilter !== 'all') {
            return transactionsToUse.filter(transaction => 
                transaction.gift_source_type === sourceTypeFilter
            );
        }
        
        return transactionsToUse;
    };

    const getStatistics = () => {
        const freshRequestCount = allTransactions.filter(t => t.gift_source_type === 'fresh_request').length;
        const prePurchasedCount = allTransactions.filter(t => t.gift_source_type === 'pre_purchased').length;
        const totalCount = allTransactions.length;
        
        // Fix: Convert to number explicitly to avoid string concatenation
        const totalTrees = allTransactions.reduce((sum, t) => sum + Number(t.trees_count || 1), 0);
        const freshRequestTrees = allTransactions
            .filter(t => t.gift_source_type === 'fresh_request')
            .reduce((sum, t) => sum + Number(t.trees_count || 1), 0);
        const prePurchasedTrees = allTransactions
            .filter(t => t.gift_source_type === 'pre_purchased')
            .reduce((sum, t) => sum + Number(t.trees_count || 1), 0);

        return {
            totalCount,
            freshRequestCount,
            prePurchasedCount,
            totalTrees,
            freshRequestTrees,
            prePurchasedTrees,
            freshRequestPercentage: totalCount > 0 ? Math.round((freshRequestCount / totalCount) * 100) : 0,
            prePurchasedPercentage: totalCount > 0 ? Math.round((prePurchasedCount / totalCount) * 100) : 0,
        };
    };

    const getSourceTypeChip = (transaction: GiftRedeemTransaction) => {
        if (transaction.gift_source_type === 'fresh_request') {
            return (
                <Chip
                    label="🎁 Direct Request"
                    size="small"
                    sx={{
                        backgroundColor: '#e8f5e8',
                        color: '#2e7d32',
                        border: '1px solid #4caf50',
                        fontWeight: 500
                    }}
                />
            );
        } else if (transaction.gift_source_type === 'pre_purchased') {
            return (
                <Chip
                    label="🌳 Pre-Purchased"
                    size="small"
                    sx={{
                        backgroundColor: '#e3f2fd',
                        color: '#1565c0',
                        border: '1px solid #2196f3',
                        fontWeight: 500
                    }}
                />
            );
        } else {
            // For transactions without source type, show a neutral chip
            return (
                <Chip
                    label="📋 Other"
                    size="small"
                    sx={{
                        backgroundColor: '#f5f5f5',
                        color: '#616161',
                        border: '1px solid #9e9e9e',
                        fontWeight: 500
                    }}
                />
            );
        }
    };

    const getColumns = (): TableColumnsType<GiftRedeemTransaction> => {
        const columns: TableColumnsType<GiftRedeemTransaction> = [
            {
                dataIndex: "id",
                key: "Transaction ID",
                title: "Transaction ID",
                align: "right",
                width: 120,
                fixed: 'left',
            },
            {
                dataIndex: "gift_source_type",
                key: "Source Type",
                title: "Source Type",
                align: "center",
                width: 160,
                render: (value, record) => getSourceTypeChip(record),
            },
            {
                dataIndex: "recipient_name",
                key: "Recipient",
                title: "Recipient",
                align: "left",
                width: 200,
                ...getColumnSearchProps('recipient_name', filters, handleSetFilters)
            },
            {
                dataIndex: "trees_count",
                key: "# Trees",
                title: getSortableHeader("# Trees", 'trees_count'),
                align: "center",
                width: 100,
                render: (value: number) => Number(value) || 1,
            },
            {
                dataIndex: "occasion_name",
                key: "Occasion",
                title: "Occasion",
                align: "left",
                width: 200,
                render: (value: string) => value || '-',
                ...getColumnSearchProps('occasion_name', filters, handleSetFilters)
            },
            {
                dataIndex: "gifted_by",
                key: "Gifted By",
                title: "Gifted By",
                align: "left",
                width: 200,
                render: (value: string) => value || '-',
                ...getColumnSearchProps('gifted_by', filters, handleSetFilters)
            },
            {
                dataIndex: "source_request_identifier",
                key: "Source Request",
                title: "Source Request",
                align: "center",
                width: 150,
                render: (value: string) => value || '-',
            },
            {
                dataIndex: "gifted_on",
                key: "Gifted On",
                title: getSortableHeader("Gifted On", 'gifted_on'),
                align: "center",
                width: 150,
                render: (value: string) => getHumanReadableDate(value),
                ...getColumnDateFilter({ dataIndex: 'gifted_on', filters, handleSetFilters, label: 'Gifted' })
            },
            {
                dataIndex: "created_at",
                key: "Created On",
                title: getSortableHeader("Created On", 'created_at'),
                align: "center",
                width: 150,
                render: getHumanReadableDate,
                ...getColumnDateFilter({ dataIndex: 'created_at', filters, handleSetFilters, label: 'Created' })
            },
        ];

        return columns;
    };

    const stats = getStatistics();

    return (
        <Box p={2} id="gift-transaction-history">
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
            }}>
                <Typography variant="h5">Gift Transaction History</Typography>
                <RadioGroup
                    row
                    value={sourceTypeFilter}
                    onChange={(e) => setSourceTypeFilter(e.target.value as SourceTypeFilter)}
                >
                    <FormControlLabel value="fresh_request" control={<Radio />} label="Direct Request" />
                    <FormControlLabel value="pre_purchased" control={<Radio />} label="Pre-Purchase" />
                    <FormControlLabel value="all" control={<Radio />} label="All" />
                </RadioGroup>
            </Box>

            {/* Summary Statistics */}
            <Box style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                padding: '0 8px',
                overflow: 'auto',
                marginBottom: '24px'
            }}>
                <div className={classes.analyticsCard}>
                    <Box sx={{ paddingTop: "10px" }}>
                        <Typography variant="subtitle2" color="#1f3625" sx={{ mb: 1 }}>
                            Total Transactions
                        </Typography>
                        <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                            {stats.totalCount}
                        </Typography>
                        <Typography variant="caption" color="#1f3625">
                            {stats.totalTrees} trees gifted
                        </Typography>
                    </Box>
                </div>
                
                <div className={classes.analyticsCard}>
                    <Box sx={{ paddingTop: "10px" }}>
                        <Typography variant="subtitle2" color="#1f3625" sx={{ mb: 1 }}>
                            🎁 Direct Request
                        </Typography>
                        <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                            {stats.freshRequestCount}
                        </Typography>
                        <Typography variant="caption" color="#1f3625">
                            {stats.freshRequestPercentage}% • {stats.freshRequestTrees} trees
                        </Typography>
                    </Box>
                </div>
                
                <div className={classes.analyticsCard}>
                    <Box sx={{ paddingTop: "10px" }}>
                        <Typography variant="subtitle2" color="#1f3625" sx={{ mb: 1 }}>
                            🌳 Pre-Purchased
                        </Typography>
                        <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                            {stats.prePurchasedCount}
                        </Typography>
                        <Typography variant="caption" color="#1f3625">
                            {stats.prePurchasedPercentage}% • {stats.prePurchasedTrees} trees
                        </Typography>
                    </Box>
                </div>
            </Box>

            <Box sx={{ height: 600, width: "100%", mb: 4 }}>
                <GeneralTable
                    loading={loading}
                    rows={tableRows}
                    columns={getColumns()}
                    totalRecords={totalRecords}
                    page={page}
                    pageSize={pageSize}
                    onPaginationChange={(page: number, pageSize: number) => { setPage(page - 1); setPageSize(pageSize); }}
                    onDownload={getAllTransactionData}
                    footer
                    tableName="Gift Transactions"
                />
            </Box>
        </Box>
    );
};

export default CSRGiftHistory;
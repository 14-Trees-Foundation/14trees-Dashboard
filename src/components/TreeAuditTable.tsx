import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { format } from 'date-fns';
import GeneralTable from './GenTable';
import ApiClient from '../api/apiClient/apiClient';
import { TreeImage, TreeSnapshot } from '../types/tree_snapshots';

interface TreeAuditTableProps {
    saplingId: string;
}

const TreeAuditTable: React.FC<TreeAuditTableProps> = ({ saplingId }) => {
    const [loading, setLoading] = useState(false);
    const [auditData, setAuditData] = useState<TreeSnapshot[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    const columns = [
        {
            title: 'Date',
            dataIndex: 'image_date',
            key: 'image_date',
            width: 150,
            render: (date: string) => format(new Date(date), 'dd/MM/yyyy HH:mm:ss')
        },
        {
            title: 'Health Status',
            dataIndex: 'tree_status',
            key: 'tree_status',
            width: 150
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            width: 150,
            render: (image: string) => image ? (
                <img 
                    src={image} 
                    alt="Tree" 
                    style={{ 
                        width: 100, 
                        height: 100, 
                        objectFit: 'cover',
                        cursor: 'pointer' 
                    }}
                    onClick={() => window.open(image, '_blank')}
                />
            ) : 'No Image'
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            width: 100,
            render: (isActive: boolean) => isActive ? 'Active' : 'Inactive'
        }
    ];

    useEffect(() => {
        const fetchAuditData = async () => {
            if (!saplingId) return;

            setLoading(true);
            try {
                const apiClient = new ApiClient();
                const response = await apiClient.getTreeAuditDetails(saplingId, page, pageSize);
                // Convert TreeImage to TreeSnapshot
                const convertedData: TreeSnapshot[] = response.results.map(item => ({
                    id: item.id,
                    user_id: item.user_id,
                    sapling_id: item.sapling_id,
                    image: item.image,
                    is_active: true, // Default value since TreeImage doesn't have this
                    created_at: item.created_at.toString(),
                    image_date: item.image_date.toString(),
                    tree_status: item.tree_status
                }));
                setAuditData(convertedData);
                setTotalRecords(response.total);
            } catch (error) {
                console.error('Error fetching audit data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuditData();
    }, [saplingId, page, pageSize]);
    return (
        <Box>
            <Typography variant="h6" gutterBottom>Tree Audit History</Typography>
            <GeneralTable
                loading={loading}
                columns={columns}
                rows={auditData}
                totalRecords={totalRecords}
                page={page + 1}
                pageSize={pageSize}
                onPaginationChange={(newPage: number, newPageSize: number) => {
                    setPage(newPage - 1);
                    setPageSize(newPageSize);
                }}
                onDownload={async () => auditData}
                footer
                tableName='Tree Audit History'
            />
        </Box>
    );
};

export default TreeAuditTable;
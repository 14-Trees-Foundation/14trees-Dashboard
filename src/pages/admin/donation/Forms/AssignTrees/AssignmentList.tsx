import { useState, useEffect } from 'react';
import { Button, Typography, Box, TextField, InputAdornment } from '@mui/material';
import { TableColumnsType } from 'antd';
import GeneralTable from '../../../../../components/GenTable';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';

interface AssignmentItem {
    tree_id: number;
    du_id: number;
    sapling_id: string;
    plant_type: string;
    recipient_name: string;
    assignee_name: string;
}

interface AssignmentListProps {
    assignments: AssignmentItem[];
    onRemoveAssignment: (treeId: number) => void;
}

const AssignmentList: React.FC<AssignmentListProps> = ({
    assignments,
    onRemoveAssignment,
}) => {
    // Client-side pagination and filtering
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState('');
    const [filteredAssignments, setFilteredAssignments] = useState<AssignmentItem[]>([]);

    // Handle pagination change
    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    };

    // Filter assignments based on search text
    useEffect(() => {
        if (!searchText.trim()) {
            setFilteredAssignments(assignments);
            return;
        }

        const lowercasedSearch = searchText.toLowerCase();
        const filtered = assignments.filter(assignment =>
            assignment.sapling_id.toLowerCase().includes(lowercasedSearch) ||
            assignment.plant_type.toLowerCase().includes(lowercasedSearch) ||
            assignment.recipient_name.toLowerCase().includes(lowercasedSearch) ||
            assignment.assignee_name.toLowerCase().includes(lowercasedSearch)
        );

        setFilteredAssignments(filtered);
    }, [searchText, assignments]);

    // Get paginated data
    const getPaginatedData = () => {
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredAssignments.slice(startIndex, endIndex);
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        setPage(0); // Reset to first page when searching
    };

    // Handle download
    const handleDownload = async () => {
        return Promise.resolve(filteredAssignments);
    };

    // Table columns
    const columns: TableColumnsType<any> = [
        {
            dataIndex: 'sapling_id',
            key: 'Sapling Id',
            title: 'Sapling Id',
            align: 'center',
            width: 120,
        },
        {
            dataIndex: 'plant_type',
            key: 'Plant Type',
            title: 'Plant Type',
            align: 'center',
            width: 120,
        },
        {
            dataIndex: 'recipient_name',
            key: 'Recipient Name',
            title: 'Recipient Name',
            align: 'center',
            width: 150,
        },
        {
            dataIndex: 'assignee_name',
            key: 'Assignee Name',
            title: 'Assignee Name',
            align: 'center',
            width: 150,
        },
        {
            dataIndex: 'actions',
            key: 'Actions',
            title: 'Actions',
            align: 'center',
            width: 100,
            render: (_, record) => (
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => onRemoveAssignment(record.tree_id)}
                >
                    <DeleteOutlined />
                </Button>
            ),
        },
    ];

    return (
        <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
                {assignments.length} tree(s) assigned to donation users
            </Typography>

            <Box sx={{ mb: 2 }}>
                <TextField
                    sx={{ width: 400 }}
                    size="small"
                    placeholder="Search by sapling ID, plant type, recipient, or assignee"
                    value={searchText}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchOutlined />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <GeneralTable
                rows={getPaginatedData()}
                columns={columns}
                totalRecords={filteredAssignments.length}
                onPaginationChange={handlePaginationChange}
                onDownload={handleDownload}
                page={page}
                pageSize={pageSize}
                loading={false}
            />
        </Box>
    );
};

export default AssignmentList;

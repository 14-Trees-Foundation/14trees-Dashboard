import React, { useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { AccountCircleOutlined } from '@mui/icons-material';
import GeneralTable from '../../../../components/GenTable';


interface UserTreeMappingModalProps {
    trees: any[]
    onTreesChange: (trees: any[]) => void
    users: any[]
}

const UserTreeMappingModal: React.FC<UserTreeMappingModalProps> = ({ trees, onTreesChange, users }) => {
    const [selectedTree, setSelectedTree] = useState<any>(null);
    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [page2, setPage2] = useState(0);
    const [pageSize2, setPageSize2] = useState(10);

    const handleSelectUser = (user: any) => {
        if (selectedTree) {
            const updatedTrees = trees.map((tree) =>
                tree === selectedTree ? { ...selectedTree, user_id: user.user_id, user_name: user.user_name, user_email: user.user_email } : tree
            );

            onTreesChange(updatedTrees);
            setSelectedTree(null);
        }
        setUserModalOpen(false);
    };

    const openUserModal = (tree: any) => {
        setSelectedTree(tree);
        setUserModalOpen(true);
    };

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    const handlePaginationChange2 = (page: number, pageSize: number) => {
        setPage2(page - 1);
        setPageSize2(pageSize);
    }

    const columns: any[] = [
        {
            dataIndex: "sapling_id",
            key: "sapling_id",
            title: "Sapling Id",
            align: "center",
            width: 100,
        },
        {
            dataIndex: "plant_type",
            key: "plant_type",
            title: "Plant Type",
            align: "center",
            width: 200,
        },
        {
            dataIndex: "user_name",
            key: "user_name",
            title: "Assignee Name",
            align: "center",
            width: 200,
        },
        {
            dataIndex: "user_email",
            key: "user_email",
            title: "Assignee Email",
            align: "center",
            width: 200,
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 100,
            align: "center",
            render: (value: any, record: any, index: number) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        variant='outlined'
                        color='success'
                        style={{ margin: "0 5px" }}
                        onClick={() => { openUserModal(record); }}
                    >
                        <AccountCircleOutlined />
                    </Button>
                </div>
            ),
        },
    ]

    const userColumns: any[] = [
        {
            dataIndex: "user_name",
            key: "user_name",
            title: "Assignee Name",
            align: "center",
            width: 200,
        },
        {
            dataIndex: "user_email",
            key: "user_email",
            title: "Assignee Email",
            align: "center",
            width: 200,
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 100,
            align: "center",
            render: (value: any, record: any, index: number) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        variant='outlined'
                        color='success'
                        style={{ margin: "0 5px" }}
                        onClick={() => { handleSelectUser(record) }}
                    >
                        Select
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <>
            <Box mt={10}>
                <Typography variant="h6">List of selected trees.</Typography>
                <GeneralTable
                    rows={trees}
                    columns={columns}
                    totalRecords={trees.length}
                    page={page}
                    pageSize={pageSize}
                    onPaginationChange={handlePaginationChange}
                    onDownload={async () => { return Object.values(trees) }}
                    tableName="Selected Trees"
                />
            </Box>

            <Modal open={isUserModalOpen} aria-labelledby="tree-select-modal-title">
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%', // Responsive width
                        maxWidth: '80vw',
                        maxHeight: '90vh',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        overflow: 'auto',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <GeneralTable
                        rows={users.filter(user => user.gifted_trees > trees.filter(tree => tree.user_id === user.user_id).length)}
                        columns={userColumns}
                        totalRecords={users.filter(user => user.gifted_trees < trees.filter(tree => tree.user_id === user.user_id).length).length}
                        page={page2}
                        pageSize={pageSize2}
                        onPaginationChange={handlePaginationChange2}
                        onDownload={async () => { return Object.values(users) }}
                        tableName="Users"
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => { setUserModalOpen(false) }} variant="outlined" color='error' sx={{ mr: 1 }}>Cancel</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default UserTreeMappingModal;

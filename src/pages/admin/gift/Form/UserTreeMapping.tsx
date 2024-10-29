import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ApiClient from '../../../../api/apiClient/apiClient';
import { ForestOutlined } from '@mui/icons-material';

interface TreeSelectModalProps {
    trees: any[];
    hasMore: boolean
    open: boolean;
    handleClose: () => void;
    onSelectTree: (tree: any) => void;
    onLoadMore: () => void;
}

const TreeSelectModal: React.FC<TreeSelectModalProps> = ({ trees, hasMore, open, handleClose, onSelectTree, onLoadMore }) => {
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="tree-select-modal-title">
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%', // Responsive width
                    maxWidth: 600,
                    maxHeight: '80vh',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Typography id="tree-select-modal-title" variant="h6" sx={{ mb: 2 }}>
                    Select a Tree
                </Typography>
                
                <List sx={{ maxHeight: '60vh', overflowY: 'auto', flexGrow: 1, mb: 2, pr: 1 }}>
                    {trees.map((tree) => (
                        <ListItem key={tree.id} button onClick={() => onSelectTree(tree)}>
                            <ListItemText primary={`${tree.sapling_id} (${tree.plant_type})`} secondary={tree.plot} />
                        </ListItem>
                    ))}
                </List>
                {!hasMore && <Typography variant="body1" sx={{ mb: 2 }}>
                    No More trees in selected plot. Please select more or different plots.
                </Typography>}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleClose} variant="outlined" color='error' sx={{ mr: 1 }}>Cancel</Button>
                    <Button disabled={!hasMore} onClick={onLoadMore} variant="contained" color='success'>Load More</Button>
                </Box>
            </Box>
        </Modal>
    );
};


interface UserTreeMappingModalProps {
    users: any[]
    onUsersChange: (users: any[]) => void
    plotIds: number[]
}

const UserTreeMappingModal: React.FC<UserTreeMappingModalProps> = ({ users, onUsersChange, plotIds }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isTreeModalOpen, setTreeModalOpen] = useState(false);
    const [treesData, setTreesData] = useState<Record<number, any>>({})
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const getTrees = async (plotIds: number[]) => {
        const apiClient = new ApiClient();

        if (plotIds.length > 0) {
            const filters = [{
                columnField: 'plot_id',
                operatorValue: 'isAnyOf',
                value: plotIds
            }]
            const treesResp = await apiClient.getGiftAbleTrees(page * pageSize, pageSize, filters);
            setTotal(Number(treesResp.total));

            setTreesData(prev => {
    
                const newTrees = { ...prev };
                for (let i = 0; i < treesResp.results.length; i++) {
                    newTrees[treesResp.offset + i + 1] = treesResp.results[i];
                }
    
                return newTrees;
            });
        }
    }

    useEffect(() => {
        getTrees(plotIds);
    }, [plotIds, page, pageSize])

    const handleSelectTree = (tree: any) => {
        if (selectedUser) {
            const updatedUsers = users.map((user) =>
                user === selectedUser ? { ...user, tree_id: tree.id, sapling_id: tree.sapling_id, plant_type: tree.plant_type } : user
            );

            onUsersChange(updatedUsers);
            setSelectedUser(null);
        }
        setTreeModalOpen(false);
    };

    const openTreeModal = (user: any) => {
        setSelectedUser(user);
        setTreeModalOpen(true);
    };

    return (
        <>
            <Typography id="user-list-modal-title" variant="h6" sx={{ mb: 1, mt: 2 }}>
                Users List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Tree ID</TableCell>
                            <TableCell>Plant Type</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={index}>
                                <TableCell>{user.user_name}</TableCell>
                                <TableCell>{user.user_email}</TableCell>
                                <TableCell>{user.sapling_id || 'N/A'}</TableCell>
                                <TableCell>{user.plant_type || 'N/A'}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => openTreeModal(user)}>
                                        <ForestOutlined />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TreeSelectModal
                trees={Object.values(treesData).filter(tree => users.findIndex(user => user.tree_id === tree.id) == -1).sort((a, b) => b.id - a.id)}
                hasMore={total > Object.values(treesData).length}
                open={isTreeModalOpen}
                handleClose={() => setTreeModalOpen(false)}
                onSelectTree={handleSelectTree}
                onLoadMore={() => { setPage(page + 1) }}
            />
        </>
    );
};

export default UserTreeMappingModal;

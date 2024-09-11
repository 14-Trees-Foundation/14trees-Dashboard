import React, { FC, useState } from 'react';
import { Card, CardContent, Typography, Box, Modal, IconButton } from '@mui/material';
import { Tree } from '../../../types/tree';
import { Close } from '@mui/icons-material';

interface UserTreeInfoProps {
    tree: Tree
}

const UserTreeInfo: FC<UserTreeInfoProps> = ({ tree }) => {
    const [open, setOpen] = useState(false);
    const getName = () => {
        return tree.assigned_to_name?.split(' ')[0];
    }

    return (
        <Card sx={{ display: 'flex', margin: '0 auto', padding: 2, borderRadius: 4, boxShadow: 3 }}>
            <Box sx={{ flex: '0 0 auto', padding: 2 }} onClick={() => setOpen(true)}>
                <img src={tree.user_tree_image || tree.image} alt={`${tree.assigned_to_name}`} style={{ width: '210px', height: '280px', borderRadius: 8 }} />
            </Box>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" component="p">
                    Every leaf that unfurls is a promise of a greener tomorrow. <strong>{getName()}</strong>'s dedication and care in planting this tree are invaluable contributions to our mission of a healthier planet. As you visit this page, take a moment to appreciate the life and beauty this tree brings to our world.
                </Typography>
            </CardContent>

            <Modal open={open} onClose={() => setOpen(false)} sx={{ display: 'flex', padding: 2, alignSelf: 'center', justifySelf: 'center' }}>
                <img src={tree.user_tree_image || tree.image} alt={`${tree.plant_type} tree`} style={{ maxWidth: '90vw', height: '90vh', borderRadius: 8 }} />
            </Modal>
        </Card>
    );
};

export default UserTreeInfo;

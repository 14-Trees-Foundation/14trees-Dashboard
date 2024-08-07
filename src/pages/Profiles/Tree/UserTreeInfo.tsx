import React, { FC } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Tree } from '../../../types/tree';
import { getHumanReadableDate } from '../../../helpers/utils';

interface UserTreeInfoProps {
    tree: Tree
}

const UserTreeInfo: FC<UserTreeInfoProps> = ({ tree }) => {
    const getName = () => {
        return tree.assigned_to_name?.split(' ')[0];
    }
    
    return (
        <Card sx={{ display: 'flex', margin: '0 auto', padding: 2, borderRadius: 4, boxShadow: 3 }}>
            <Box sx={{ flex: '0 0 auto', padding: 2 }}>
                <img src={tree.user_tree_image} alt={`${tree.assigned_to_name}`} style={{ width: '210px', height: '280px', borderRadius: 8 }} />
            </Box>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" component="p">
                    Every leaf that unfurls is a promise of a greener tomorrow. <strong>{getName()}</strong>'s dedication and care in planting this tree are invaluable contributions to our mission of a healthier planet. As you visit this page, take a moment to appreciate the life and beauty this tree brings to our world.
                </Typography>
            </CardContent>
        </Card>
    );
};

export default UserTreeInfo;

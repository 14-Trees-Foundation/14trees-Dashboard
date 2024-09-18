import React from 'react';
import { Card, CardContent, Typography, Grid, Tooltip } from '@mui/material';
import { Forest, Person } from '@mui/icons-material';

interface UserCardProps {
    name: string;
    mapped_trees: number | string;
    assigned_trees: number | string;
}

const UserCard: React.FC<UserCardProps> = ({ name, mapped_trees, assigned_trees }) => {
    
    return (
        <Card style={{ backgroundColor: 'rgba(207, 255, 235, 0.3)', borderRadius: 4, width: '100%' }}>
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6} container alignItems="center">
                        <Person />
                        <Typography variant="body1" style={{ marginLeft: 8 }}>
                            {name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3} container alignItems="center" justifyContent="center">
                        <Tooltip title="Mapped Trees" arrow>
                            <Grid container alignItems="center" justifyContent="center">
                                <Forest />
                                <Typography variant="body1" style={{ marginLeft: 8 }}>
                                    {mapped_trees}
                                </Typography>
                            </Grid>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={3} container alignItems="center" justifyContent="center">
                        <Tooltip title="Assigned Trees" arrow>
                            <Grid container alignItems="center" justifyContent="center">
                                <Forest />
                                <Typography variant="body1" style={{ marginLeft: 8 }}>
                                    {assigned_trees}
                                </Typography>
                            </Grid>
                        </Tooltip>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default UserCard;

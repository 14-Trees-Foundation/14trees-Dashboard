import React, { FC } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Tree } from '../../../types/tree';
import { getHumanReadableDate } from '../../../helpers/utils';

interface TreeInfoProps {
  tree: Tree
}

const TreeInfo: FC<TreeInfoProps> = ({ tree }) => {
  return (
    <Card sx={{ display: 'flex', margin: '0 auto', padding: 2, borderRadius: 4, boxShadow: 3 }}>
      <CardContent sx={{ flex: '1 1 auto' }}>
        <Typography variant="h6" style={{ marginBottom: 10 }}>
          Tree: {tree.sapling_id}
        </Typography>
        <Typography variant="body1" component="p">
          Planting a tree is more than just adding greenery to our planet—it's a gift to future generations. This <strong>{tree.plant_type}</strong> tree stands as a symbol of hope and sustainability. Planted on <strong>{getHumanReadableDate(tree.created_at as any)}</strong> by <strong>{tree.plant_type}</strong> in <strong>{tree.plot}</strong>, it has been growing strong, providing shade, clean air, and a home for wildlife.
        </Typography>
      </CardContent>
      <Box sx={{ flex: '0 0 auto', padding: 2 }}>
        <img src={tree.image} alt={`${tree.plant_type} tree`} style={{ width: '210px', height: '280px', borderRadius: 8 }} />
      </Box>
    </Card>
  );
};

export default TreeInfo;

import { FC, useState } from 'react';
import { Card, CardContent, Typography, Box, Modal } from '@mui/material';
import { Tree } from '../../../types/tree';
import { getHumanReadableDate } from '../../../helpers/utils';

interface TreeInfoProps {
  tree: Tree
}

const TreeInfo: FC<TreeInfoProps> = ({ tree }) => {
  const [open, setOpen] = useState(false);

  return (
    <Card sx={{ display: 'flex', margin: '0 auto', padding: 2, borderRadius: 4, boxShadow: 3 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" component="p">
          Planting a tree is more than just adding greenery to our planet. It's a gift to future generations. This <strong>{tree.plant_type}</strong> tree stands as a symbol of hope and sustainability. Planted on {getHumanReadableDate(tree.created_at as any)} by <strong>{tree.planted_by || tree.assigned_to_name}</strong> in {tree.plot}, it has been growing strong, providing shade, clean air, and a home for wildlife.
        </Typography>
      </CardContent>
      <Box sx={{ flex: '0 0 auto', padding: 2 }} onClick={() => setOpen(true)}>
        <img src={tree.image} alt={`${tree.plant_type} tree`} style={{ width: '240px', height: '320px', borderRadius: 8 }} />
      </Box>

      <Modal open={open} onClose={() => setOpen(false)} sx={{ display: 'flex', padding: 2, alignSelf: 'center', justifySelf: 'center' }} >
          <img src={tree.image} alt={`${tree.plant_type} tree`} style={{ maxWidth: '90vw', height: '90vh', borderRadius: 8 }} />
      </Modal>
    </Card>
  );
};

export default TreeInfo;

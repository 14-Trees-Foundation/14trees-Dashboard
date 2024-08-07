import { FC } from "react";
import { Tree } from "../../../types/tree";
import React from 'react';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #ccc',
      borderRadius: '8px',
      overflow: 'hidden',
      width: '300px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    image: {
      width: '100%',
      height: 'auto',
      aspectRatio: '4 / 3',
      objectFit: 'cover',
    },
    content: {
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    title: {
      margin: 0,
      fontSize: '1.25em',
    },
    description: {
      margin: 0,
      color: '#666',
      flexGrow: 1,
    },
    footer: {
      marginTop: '8px',
      fontSize: '0.875em',
      color: '#999',
    },
  })
);

interface TreeInfoProps {
    tree: Tree
}

const TreeInfo: FC<TreeInfoProps> = ({ tree }) => {
    const classes = useStyles();

  return (
    <div className={classes.box}>
      <img src={tree.image} alt={tree.sapling_id} className={classes.image} />
      <div className={classes.content}>
        <h2 className={classes.title}>{tree.sapling_id}</h2>
        <p className={classes.description}>{tree.plant_type}</p>
        <div className={classes.footer}>{tree.plot}</div>
      </div>
    </div>
  );
}

export default TreeInfo;

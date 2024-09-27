import { FC, useEffect, useState } from "react";
import { TextField, Typography } from "@mui/material";

interface CardCountProps {
    treeCount: number
    onTreeCountChange: (count: number) => void
}

const CardCount: FC<CardCountProps> = ({ treeCount, onTreeCountChange }) => {

    const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const number = parseInt(event.target.value);

        if (isNaN(number) || number < 0) onTreeCountChange(0);
        else onTreeCountChange(Number(number));
    }

    return (
        <div style={{ padding: '10px 40px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='h6'>Please enter the number of gift cards: </Typography>
                <TextField 
                    value={treeCount}
                    onChange={handleCountChange}
                    type='number'
                    size="small"
                />
            </div>
        </div>
    )
}

export default CardCount;
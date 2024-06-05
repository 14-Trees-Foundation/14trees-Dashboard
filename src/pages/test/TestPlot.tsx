import React, { useEffect, useState } from 'react';
import * as plotActionCreators from '../../redux/actions/plotActions';
import { bindActionCreators } from 'redux';
import { useAppDispatch, useAppSelector } from '../../redux/store/hooks';
import { Button } from '@mui/material';
import { Plot } from '../../types/plot';

export const TestPlot = () => {

    const dispatch = useAppDispatch();
    const { getPlots, createPlot, updatePlot, deletePlot, searchPlots }
        = bindActionCreators(plotActionCreators, dispatch);

    const [jsonData, setJsonData] = useState<string>('');
    const handleButtonClickSearch = () => {
        try {
          searchPlots(jsonData);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
    const handleButtonClickCreate = () => {
        try {
            const parsedData = JSON.parse(jsonData) as Plot;
            createPlot(parsedData)
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    };
    const handleButtonClickGet = () => {
        try {
            getPlots()
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    };
    const handleButtonClickUpdate = () => {
        try {
            const parsedData = JSON.parse(jsonData) as Plot;
            updatePlot(parsedData)
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    };
    const handleButtonClickDelete = () => {
        try {
            const parsedData = JSON.parse(jsonData) as Plot;
            deletePlot(parsedData)
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setJsonData(event.target.value);
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Button variant="contained" onClick={handleButtonClickGet}>Get</Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <textarea
                    placeholder="search string"
                    value={jsonData}
                    onChange={handleInputChange}
                    style={{ width: '100%', minHeight: '100px' }}
                />
                <Button variant="contained" onClick={handleButtonClickSearch}>Search</Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <textarea
                    placeholder="Enter JSON data..."
                    value={jsonData}
                    onChange={handleInputChange}
                    style={{ width: '100%', minHeight: '100px' }}
                />
                <Button variant="contained" onClick={handleButtonClickCreate}>Add</Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <textarea
                    placeholder="Enter JSON data..."
                    value={jsonData}
                    onChange={handleInputChange}
                    style={{ width: '100%', minHeight: '100px' }}
                />
                <Button variant="contained" onClick={handleButtonClickUpdate}>Update</Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <textarea
                    placeholder="Enter JSON data..."
                    value={jsonData}
                    onChange={handleInputChange}
                    style={{ width: '100%', minHeight: '100px' }}
                />
                <Button variant="contained" onClick={handleButtonClickDelete}>Delete</Button>
            </div>
        </>
    );
}

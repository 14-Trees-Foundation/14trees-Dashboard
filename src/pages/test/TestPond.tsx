import React, { useEffect, useState } from 'react';
import * as pondActionCreators from '../../redux/actions/pondActions';
import {bindActionCreators} from 'redux';
import {useAppDispatch, useAppSelector} from '../../redux/store/hooks';
import { Button, Input } from '@mui/material';
import { Pond } from '../../types/pond';

export const TestPond = () => {

    const dispatch = useAppDispatch();
	const {getPonds, createPond, updatePond, deletePond}
        = bindActionCreators(pondActionCreators, dispatch);

	const [jsonData, setJsonData] = useState<string>('');

    const handleButtonClickCreate = () => {
        try {
          const parsedData = JSON.parse(jsonData) as Pond;
          createPond(parsedData)
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
    const handleButtonClickGet = () => {
        getPonds()
      };
    const handleButtonClickUpdate = () => {
        try {
          const parsedData = JSON.parse(jsonData) as Pond;
          updatePond(parsedData)
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
    const handleButtonClickDelete = () => {
        try {
          const parsedData = JSON.parse(jsonData) as Pond;
          deletePond(parsedData)
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

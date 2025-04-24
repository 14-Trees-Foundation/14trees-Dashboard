import React, { useEffect, useState } from 'react';
import * as userActionCreators from '../../redux/actions/userActions';
import {bindActionCreators} from 'redux';
import {useAppDispatch} from '../../redux/store/hooks';
import { User } from '../../types/user';
import { Button } from '@mui/material';

export const TestUser = () => {

    const dispatch = useAppDispatch();
	const {getUsers, createUser, createBulkUsers, updateUser, deleteUser, searchUsers}
        = bindActionCreators(userActionCreators, dispatch);

	const [jsonData, setJsonData] = useState<string>('');

    const handleButtonClickCreate = () => {
        try {
          const parsedData = JSON.parse(jsonData) as User;
          createUser(parsedData)
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
    const handleButtonClickSearch = () => {
        try {
          searchUsers(jsonData);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
    const handleButtonClickGet = () => {
      const offset = 0;
      const limit = 20; 
      getUsers(offset, limit);
    };
    const handleButtonClickUpdate = () => {
        try {
          const parsedData = JSON.parse(jsonData) as User;
          updateUser(parsedData)
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
    const handleButtonClickDelete = () => {
        try {
          const parsedData = JSON.parse(jsonData) as User;
          deleteUser(parsedData)
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
                placeholder="email"
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

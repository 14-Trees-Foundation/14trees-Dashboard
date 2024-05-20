import React, { useEffect, useState } from 'react';
import * as pondActionCreators from '../../redux/actions/pondActions';
import { bindActionCreators } from 'redux';
import { useAppDispatch, useAppSelector } from '../../redux/store/hooks';
import { Button, Input } from '@mui/material';
import { Pond } from '../../types/pond';

export const TestPond = () => {

  const dispatch = useAppDispatch();
  const { getPonds, createPond, updatePond, deletePond, updatePondWaterLevel, searchPonds }
    = bindActionCreators(pondActionCreators, dispatch);

  const [file, setFile] = useState<File>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setFile(file);
      }
    }
  };

  const [jsonData, setJsonData] = useState<string>('');

  const handleButtonClickSearch = () => {
    try {
      searchPonds(jsonData);
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  };
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
  const handleButtonClickUpdateWater = () => {
    try {
      const parsedData = JSON.parse(jsonData) as any;
      updatePondWaterLevel(parsedData.pond_name, parsedData.levelFt, parsedData.user_id, file);
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
          placeholder='{ "pond_name": string, "levelFt": number, "user_id": string }.'
          value={jsonData}
          onChange={handleInputChange}
          style={{ width: '100%', minHeight: '100px' }}
        />
        <Input type="file" onChange={handleFileChange} />
        <Button variant="contained" onClick={handleButtonClickUpdateWater}>Update Water Level</Button>
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

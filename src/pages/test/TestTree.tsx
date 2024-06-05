import React, { useEffect, useState } from 'react';
import * as treeActionCreators from '../../redux/actions/treeActions';
import { bindActionCreators } from 'redux';
import { useAppDispatch, useAppSelector } from '../../redux/store/hooks';
import { Button, Input } from '@mui/material';
import { Tree } from '../../types/tree';

export const TestTree = () => {

    const dispatch = useAppDispatch();
    const { createBulkTrees, createTree, updateTree, deleteTree, getTrees }
        = bindActionCreators(treeActionCreators, dispatch);

    const [jsonData, setJsonData] = useState<string>('');
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

    const handleButtonClickCreate = () => {
        try {
            const parsedData = JSON.parse(jsonData) as Tree;
            createTree(parsedData, file)
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    };
    const handleButtonClickGet = () => {
        try {
            getTrees()
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    };
    const handleButtonClickUpdate = () => {
        try {
            const parsedData = JSON.parse(jsonData) as Tree;
            updateTree(parsedData, file)
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    };
    const handleButtonClickDelete = () => {
        try {
            const parsedData = JSON.parse(jsonData) as Tree;
            deleteTree(parsedData)
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
                <Input type="file" onChange={handleFileChange} />
                <Button variant="contained" onClick={handleButtonClickCreate}>Add</Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <textarea
                    placeholder="Enter JSON data..."
                    value={jsonData}
                    onChange={handleInputChange}
                    style={{ width: '100%', minHeight: '100px' }}
                />
                <Input type="file" onChange={handleFileChange} />
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

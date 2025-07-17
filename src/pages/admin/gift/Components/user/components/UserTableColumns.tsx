import React from 'react';
import { Button } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { TableColumnType } from 'antd';
import { GiftRequestUser } from '../../../../../types/gift_card';

interface UserTableColumnsProps {
  onEditUser: (user: GiftRequestUser) => void;
}

export const createUserTableColumns = ({ onEditUser }: UserTableColumnsProps): TableColumnType<GiftRequestUser>[] => [
  {
    title: 'Recipient Name',
    dataIndex: 'recipient_name',
    width: '250',
  },
  {
    title: 'Recipient Email',
    dataIndex: 'recipient_email',
    width: '250',
    render: (value: string) => value?.endsWith("@14trees") ? "Not Provided" : value,
  },
  {
    title: 'Recipient Phone',
    dataIndex: 'recipient_phone',
    width: '200',
    render: value => value ? value : ''
  },
  {
    title: 'Assignee Name',
    dataIndex: 'assignee_name',
    width: '250',
  },
  {
    title: 'Assignee Email',
    dataIndex: 'assignee_email',
    width: '250',
    render: (value: string) => value?.endsWith("@14trees") ? "Not Provided" : value,
  },
  {
    title: 'Assignee Phone',
    dataIndex: 'assignee_phone',
    width: '200',
    render: value => value ? value : ''
  },
  {
    title: 'Image',
    dataIndex: 'profile_image_url',
    render: value => value ? <img src={value} alt="User" style={{ width: 50, height: 50 }} /> : 'Image Not Provided'
  },
  {
    dataIndex: "action",
    key: "action",
    title: "Actions",
    width: 100,
    align: "center",
    render: (value, record, index) => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Button
          variant='outlined'
          color='success'
          style={{ margin: "0 5px" }}
          onClick={() => onEditUser(record)}
        >
          <EditOutlined />
        </Button>
      </div>
    ),
  },
];
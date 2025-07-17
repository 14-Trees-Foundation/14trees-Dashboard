import React, { FC, useState, useEffect } from 'react';
import { Button, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ColumnType } from "antd/es/table";
import { DeleteOutline, EditOutlined, ImageOutlined } from "@mui/icons-material";
import GeneralTable from "../../../../../../components/GenTable";
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../../../../components/Filter";
import { GridFilterItem } from "@mui/x-data-grid";
import SingleUserForm from "../SingleUserForm";
import ImageMapping from "../../ImageMapping";
import { isValidEmail, isValidPhone } from './ValidationUtils';

interface User {
  key: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_email: string;
  recipient_communication_email: string;
  assignee_name: string;
  assignee_phone: string;
  assignee_email: string;
  assignee_communication_email: string;
  image?: boolean;
  image_name?: string;
  image_url?: string;
  relation?: string;
  gifted_trees: number;
  error?: boolean;
  editable?: boolean;
}

interface BulkUserTableProps {
  users: User[];
  imageUrls: string[];
  treeCount: number;
  showAllCols: boolean;
  onUsersChange: (users: User[]) => void;
  onDeleteUser: (user: User) => void;
  onUserAdd: (user: User) => void;
  onImageSelection: (imageUrl: string) => void;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
}

const BulkUserTable: FC<BulkUserTableProps> = ({
  users,
  imageUrls,
  treeCount,
  showAllCols,
  onUsersChange,
  onDeleteUser,
  onUserAdd,
  onImageSelection,
  selectedUser,
  setSelectedUser
}) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [openImageSelection, setOpenImageSelection] = useState(false);
  const [manualUserModal, setManualUserModal] = useState(false);

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  };

  useEffect(() => {
    const filterList = Object.values(filters);
    let filteredUsers = users;
    
    for (const filter of filterList) {
      if ((filter.columnField === 'recipient_name') && filter.value) {
        filteredUsers = filteredUsers.filter(item => item.recipient_name.includes(filter.value));
      } else if ((filter.columnField === 'recipient_email') && filter.value) {
        filteredUsers = filteredUsers.filter(item => item.recipient_email.includes(filter.value));
      } else if ((filter.columnField === 'assignee_name') && filter.value) {
        filteredUsers = filteredUsers.filter(item => item.assignee_name.includes(filter.value));
      } else if ((filter.columnField === 'assignee_email') && filter.value) {
        filteredUsers = filteredUsers.filter(item => item.assignee_email.includes(filter.value));
      } else if (filter.columnField === 'image' && filter.value && filter.value.length > 0) {
        filteredUsers = filteredUsers.filter(item => {
          if (item.image === undefined && filter.value.includes('Image Not Provided')) return true;
          else if (item.image === false && filter.value.includes('Image Not Found')) return true;
          return false;
        });
      } else if (filter.columnField === 'error' && filter.value && filter.value.length > 0) {
        filteredUsers = filteredUsers.filter(item => filter.value.includes(item.error ? 'Yes' : 'No'));
      }
    }

    setFilteredUsers(filteredUsers);
  }, [filters, users]);

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page - 1);
    setPageSize(pageSize);
  };

  const columns: ColumnType<User>[] = [
    {
      dataIndex: "recipient_name",
      key: "recipient_name",
      title: "Recipient Name",
      width: 180,
      align: "center",
      ...getColumnSearchProps('recipient_name', filters, handleSetFilters),
    },
    {
      dataIndex: "recipient_email",
      key: "recipient_email",
      title: "Recipient Email",
      width: 180,
      align: "center",
      render: (value: string) => value.endsWith("@14trees") ? 'Not Provided' : value,
      ...getColumnSearchProps('recipient_email', filters, handleSetFilters),
    },
    {
      dataIndex: "recipient_communication_email",
      key: "recipient_communication_email",
      title: "Recipient Communication Email",
      width: 180,
      align: "center",
      render: (value: string) => value ? value : 'Not Provided',
      ...getColumnSearchProps('recipient_communication_email', filters, handleSetFilters),
    },
    {
      dataIndex: "recipient_phone",
      key: "recipient_phone",
      title: "Recipient Phone",
      width: 180,
      align: "center",
    },
    {
      dataIndex: "assignee_name",
      key: "assignee_name",
      title: "Assignee Name",
      width: 180,
      align: "center",
      ...getColumnSearchProps('assignee_name', filters, handleSetFilters),
    },
    {
      dataIndex: "assignee_email",
      key: "assignee_email",
      title: "Assignee Email",
      width: 180,
      align: "center",
      render: (value: string) => value.endsWith("@14trees") ? 'Not Provided' : value,
      ...getColumnSearchProps('assignee_email', filters, handleSetFilters),
    },
    {
      dataIndex: "assignee_communication_email",
      key: "assignee_communication_email",
      title: "Assignee Communication Email",
      width: 180,
      align: "center",
      render: (value: string) => value ? value : 'Not Provided',
      ...getColumnSearchProps('assignee_communication_email', filters, handleSetFilters),
    },
    {
      dataIndex: "assignee_phone",
      key: "assignee_phone",
      title: "Assignee Phone",
      width: 180,
      align: "center",
    },
    {
      dataIndex: "relation",
      key: "relation",
      title: "Relation with person",
      width: 180,
      align: "center",
    },
    {
      dataIndex: "image",
      key: "image",
      title: "Profile Pic",
      width: 180,
      align: "center",
      render: (value, record) => value === undefined
        ? 'Image Not Provided'
        : value
          ? <img src={record.image_url} alt={record.image_name} style={{ width: 50, height: 50 }} />
          : record.image_name + '\n(Not Found)',
      ...getColumnSelectedItemFilter({ 
        dataIndex: 'image', 
        filters, 
        handleSetFilters, 
        options: ['Image Not Provided', 'Image Not Found'] 
      })
    },
    {
      dataIndex: "gifted_trees",
      key: "gifted_trees",
      title: "Number of Trees to assign",
      width: 180,
      align: "center",
    },
    {
      dataIndex: "error",
      key: "error",
      title: "Validation Error",
      width: 180,
      align: "center",
      render: (value) => value ? 'Yes' : 'No',
      ...getColumnSelectedItemFilter({ 
        dataIndex: 'error', 
        filters, 
        handleSetFilters, 
        options: ['Yes', 'No'] 
      })
    },
    {
      dataIndex: "action",
      key: "action",
      title: "Actions",
      width: 150,
      align: "center",
      render: (value, record, index) => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button
            variant="outlined"
            color="success"
            style={{ margin: "0 5px" }}
            onClick={() => {
              setSelectedUser(record);
              setOpenImageSelection(true);
            }}
          >
            <ImageOutlined />
          </Button>
          <Button
            variant="outlined"
            style={{ margin: "0 5px" }}
            onClick={() => {
              setManualUserModal(true);
              setSelectedUser(record);
            }}
          >
            <EditOutlined />
          </Button>
          <Button
            variant="outlined"
            color="error"
            style={{ margin: "0 5px" }}
            onClick={() => onDeleteUser(record)}
          >
            <DeleteOutline />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ margin: '20px', width: '100%' }}>
      {(treeCount - users.map(user => user.gifted_trees).reduce((prev, curr) => prev + curr, 0)) > 0 && (
        <Typography variant="h6" style={{ color: 'red' }}>
          Number of trees left to allocate: {treeCount - users.map(user => user.gifted_trees).reduce((prev, curr) => prev + curr, 0)}
        </Typography>
      )}
      
      <Grid container style={{ marginTop: '10px' }} width={'100%'}>
        <GeneralTable
          columns={showAllCols ? columns : columns.filter(item => 
            !item.key?.toString().startsWith("assigned") && item.key?.toString() !== 'relation'
          )}
          page={page}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
          totalRecords={filteredUsers.length}
          rows={filteredUsers.sort((a, b) => {
            if (a.error) return -1;
            if (b.error) return 1;
            return 0;
          }).slice(page * pageSize, page * pageSize + pageSize)}
          onDownload={async () => filteredUsers}
          rowClassName={(record, index) => record.error ? 'pending-item' : ''}
        />
      </Grid>

      <ImageMapping 
        name={selectedUser?.recipient_name || ''} 
        open={openImageSelection} 
        images={imageUrls} 
        onClose={() => setOpenImageSelection(false)} 
        onSelect={onImageSelection} 
      />

      <Dialog open={manualUserModal} fullWidth maxWidth="md">
        <DialogTitle>Recipient Details</DialogTitle>
        <DialogContent dividers>
          <SingleUserForm 
            maxTrees={treeCount - users.map(u => u.gifted_trees).reduce((prev, curr) => prev + curr, 0)}  
            imageUrls={imageUrls} 
            value={selectedUser} 
            onSubmit={(user: any) => onUserAdd(user)} 
            onCancel={() => setSelectedUser(null)} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setManualUserModal(false)} variant="outlined" color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BulkUserTable;
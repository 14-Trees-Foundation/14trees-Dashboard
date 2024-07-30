import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { GridFilterItem } from "@mui/x-data-grid";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    TextField,
} from "@mui/material";
import * as visitUserActionCreators from "../../../redux/actions/visitUserActions";
import * as userActionCreators from "../../../redux/actions/userActions";


import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store";
import type { TableColumnsType } from 'antd';
import getColumnSearchProps from "../../../components/Filter";
import UserModal from "../../../components/UserModal";
import { Visit } from "../../../types/visits";
import { User } from "../../../types/user";

import TableComponent from "../../../components/Table";


interface VisitUsersInputProps {
  selectedVisit: Visit
}


export const VisitUsers = ( { selectedVisit }: VisitUsersInputProps) => {
  
const dispatch = useAppDispatch();
const { createVisitUser  , removeVisitUsers, getVisitUsers, createVisitUsersBulk} = bindActionCreators(visitUserActionCreators , dispatch)
const { searchUsers } = bindActionCreators(userActionCreators , dispatch)


const [selectedVisitForUser, setSelectedVisitForUser] = useState<Visit | null>(null);
const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
const [page, setPage] = useState(0);
const [addUserModal, setAddUserModal] = useState(false);
const [openDeleteUserGroups, setOpenDeleteUserGroups] = useState(false);
const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    
 const targetRef = useRef<any>(null);

 const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
  setPage(0);
  setFilters(filters);
}


 useEffect(() => {
  if (selectedVisit !== null) {
    setSelectedVisitForUser(selectedVisit);
      targetRef.current && targetRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [selectedVisit])

useEffect(() => {
  if (selectedVisit) {
    console.log("Selected Visit : ", selectedVisit)
      getVisitUsersData();
  }
}, [page, filters, selectedVisit]);

const getVisitUsersData = async () => {
  setTimeout(async () => {
      await getVisitUsers(selectedVisit.id, page * 10, 10);
  }, 1000);
};

const getAllUsersData = async () => {
  setTimeout(async () => {
      await getVisitUsers(selectedVisit.id, page * 10, 10);
  }, 1000);
};

const handleAddUserToVisit = (formData: any) => {
    if (selectedVisit) {
        let reqBody = { ...formData, visit_id: selectedVisit.id };
        if (reqBody.id) reqBody = { ...reqBody};
        createVisitUser(reqBody);
    }
    setAddUserModal(false);
    getVisitUsersData();
}

const handleRemoveGroupUsers = () => {
    removeVisitUsers(selectedVisit.id, selectedUserIds);
    setOpenDeleteUserGroups(false);
    getVisitUsersData();
}

const handleSelectionChanges = (selectedIds: number[]) => {
    setSelectedUserIds(selectedIds);
}




const columns: TableColumnsType<User> = [
  {
      dataIndex: "name",
      key: "name",
      title: "Name",
      align: "center",
      width: 150,
      ...getColumnSearchProps('name', filters, handleSetFilters)
  },
  {
      dataIndex: "email",
      key: "email",
      title: "Email",
      align: "center",
      width: 200,
      ...getColumnSearchProps('email', filters, handleSetFilters)
  },
  {
      dataIndex: "phone",
      key: "phone",
      title: "Phone",
      align: "center",
      width: 100,
      render: (value: string) => {
          if (!value || value === "0") return "-";
          if (value.endsWith('.0')) return value.slice(0, -2);
          else return value;
      },
      ...getColumnSearchProps('phone', filters, handleSetFilters)
  }
 
];

let usersList: User[] = [];
const visitUsersData = useAppSelector((state: RootState) => state.visitUserData);
if (visitUsersData) {
    usersList = Object.values(visitUsersData.users);
    console.log("Visit Users list : " , usersList);
}

    return (
      <div ref={targetRef}>
         <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button 
                    variant="contained"
                    color="success"
                    onClick={() => { setAddUserModal(true) }} 
                    style={{ marginLeft: 16, width: 150 }}
                    disabled={!selectedVisitForUser}
                >
                    Add User
                </Button>
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={() => { setOpenDeleteUserGroups(true) }} 
                    disabled={!selectedVisitForUser}
                    style={{ marginLeft: 16, width: 190 }}
                >
                    Remove Users
                </Button>
         </div>
         <div style={{ marginTop: 26 }}>
         <h1>{selectedVisit ? selectedVisit.visit_name : ''} Users</h1>
         <Divider />
         <Box sx={{ height: 540, marginTop: 2, width: "100%", justifyContent: "center", display: "flex" }}>
                    {selectedVisit && (
                        <TableComponent
                            dataSource={usersList}
                            columns={columns}
                            totalRecords={visitUsersData.totalUsers}
                            fetchAllData={getAllUsersData}
                            setPage={setPage}
                            handleSelectionChanges={handleSelectionChanges}
                            
                        />
                    )}
                </Box>

         </div>
         
         {addUserModal && (
                <UserModal
                    open={addUserModal}
                    handleClose={() => setAddUserModal(false)}
                    onSubmit={handleAddUserToVisit}
                    searchUser={searchUsers}
                />
            )}

        <Dialog open={openDeleteUserGroups} onClose={() => setOpenDeleteUserGroups(false)}>
                <DialogTitle>Confirm Remove</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to remove selected users from group {selectedVisitForUser?.visit_name}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setOpenDeleteUserGroups(false)} 
                        color="primary"
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRemoveGroupUsers}
                        color="error"
                        variant="contained"
                        autoFocus
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
      </div>
      
    )
   

}
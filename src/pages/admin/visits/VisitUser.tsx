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
  selectedVisit: Visit | null
}


export const VisitUsers = ( { selectedVisit }: VisitUsersInputProps) => {
  
  const dispatch = useAppDispatch();
  const { getUsers } =
        bindActionCreators(userActionCreators, dispatch);
const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
 const [page, setPage] = useState(0);
 const targetRef = useRef<any>(null);

 const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
  setPage(0);
  setFilters(filters);
}

 useEffect(() => {
  if (selectedVisit !== null) {
      // setSelectedGroup(selectedVisit);
      targetRef.current && targetRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [selectedVisit])

useEffect(() => {
  if (selectedVisit) {
      getUserData();
  }
}, [page, filters, selectedVisit]);

const getUserData = async () => {
  let filterWithGroup = { ...filters }
  if (selectedVisit) {
      filterWithGroup['group_id'] = {
          columnField: 'group_id',
          value: selectedVisit.id,
          operatorValue: 'equals'
      }
  }
  let filtersData = Object.values(filterWithGroup);
  setTimeout(async () => {
      await getUsers(page * 10, 10, filtersData);
  }, 1000);
};

const getAllUsersData = async () => {
  setTimeout(async () => {
      let filterWithGroup = { ...filters }
      if (selectedVisit) {
          filterWithGroup['group_id'] = {
              columnField: 'group_id',
              value: selectedVisit.id,
              operatorValue: 'equals'
          }
      }
      let filtersData = Object.values(filterWithGroup);
      await getUsers(0, usersData.totalUsers, filtersData);
  }, 1000);
};

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
const usersData = useAppSelector((state: RootState) => state.usersData);
if (usersData) {
    usersList = Object.values(usersData.users);
}

    return (
      <div ref={targetRef}>
         <div style={{ display: 'flex', alignItems: 'center' }}>
         <Button 
                    variant="contained"
                    color="success"
                    // onClick={() => { setAddUserModal(true) }} 
                    style={{ marginLeft: 16, width: 150 }}
                    disabled={!selectedVisit}
                >
                    Add User
                </Button>
                <Button 
                    variant="contained" 
                    color="error" 
                    // onClick={() => { setOpenDeleteUserGroups(true) }} 
                    disabled={!selectedVisit}
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
                            totalRecords={usersData.totalUsers}
                            fetchAllData={getAllUsersData}
                            setPage={setPage}
                            
                        />
                    )}
                </Box>

         </div>
      </div>
    )
   

}
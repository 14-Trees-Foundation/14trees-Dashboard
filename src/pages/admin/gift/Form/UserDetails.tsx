import { Button, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { FC, useRef, useState } from "react";
import Papa from 'papaparse';
import { Table } from "antd";
import { ColumnType } from "antd/es/table";
import DeleteIcon from "@mui/icons-material/Delete";
import { UserForm } from "../../donation/components/UserForm";
import { toast } from "react-toastify";

interface User {
  name: string;
  phone: string;
  email: string;
}

interface BulkUserFormProps {
  users: User[];
  onUsersChange: (users: User[]) => void;
}

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // International phone number validation
  return phoneRegex.test(phone);
};

export const BulkUserForm: FC<BulkUserFormProps> = ({ users, onUsersChange }) => {
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userAddOption, setUserAddOption] = useState<'bulk' | 'single'>('bulk');

  const handleFileChange = (e: any) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        Papa.parse(file, {
          header: true,
          complete: (results: any) => {
            const parsedUsers: User[] = results.data.map((user: any) => ({
              name: user['Name'],
              phone: user['Phone'],
              email: user['Email ID'],
            }));

            const validUsers = parsedUsers.filter(user => isValidEmail(user.email) && isValidPhone(user.phone));
            if (validUsers.length !== parsedUsers.length) {
              setFileError("Some rows in the CSV file have invalid phone or email values.");
            } else {
              setFileError(null);
            }

            onUsersChange(validUsers);
          },
          error: () => {
            setFileError("Failed to parse CSV file. Please ensure it is formatted correctly.");
          },
        });
      }
    }
  };

  const handleUserAdd = (user: User) => {
    const idx = users.findIndex((u) => u.email === user.email);
    if (idx === -1) {
      onUsersChange([...users, user]);
    } else {
      toast.warning("User with same email already exists");
    }
  }

  const handleRemoveUser = (email: string) => {
    const idx = users.find((user) => user.email === email);
    if (idx) {
      onUsersChange(users.filter((user) => user.email !== email));
    }
  }

  const columns: ColumnType<User>[] = [
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      width: 180,
      align: "center",
    },
    {
      dataIndex: "email",
      key: "email",
      title: "Email",
      width: 180,
      align: "center",
    },
    {
      dataIndex: "phone",
      key: "phone",
      title: "Phone",
      width: 180,
      align: "center",
    },
    {
      dataIndex: "action",
      key: "action",
      title: "Action",
      width: 150,
      align: "center",
      render: (value, record, index) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Button
            variant="outlined"
            color="error"
            style={{ margin: "0 5px" }}
            onClick={() => {
              handleRemoveUser(record.email)
            }}
          >
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '20px' }}>
      <Grid container rowSpacing={2} columnSpacing={1}>
        <Grid item xs={12}>
          <RadioGroup
            row
            aria-label="enable"
            name="enable"
            value={userAddOption}
            onChange={(e) => { setUserAddOption(e.target.value as 'single' | 'bulk') }}
          >
            <FormControlLabel
              value="single"
              control={<Radio />}
              label="Manually"
            />
            <FormControlLabel
              value="bulk"
              control={<Radio />}
              label="CSV Upload"
            />
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          {userAddOption === 'single' && (
            <UserForm onSubmit={(user) => { handleUserAdd(user) }} />
          )}

          {userAddOption === 'bulk' && (
            <Grid item xs={12}>
              <Typography variant='body1' marginBottom={2}>Upload the CSV file containing user details of the users who will be receiving the gift.</Typography>
              <Typography>Download sample file from <a href="https://docs.google.com/spreadsheets/d/1ypVdbR44nQXuaHAEOrwywY3k-lfJdsRZ9iKp0Jpq7Kw/gviz/tq?tqx=out:csv&sheet=Sheet1">here</a> and fill the details.</Typography>
              <TextField
                type="file"
                inputProps={{ accept: '.csv' }}
                onChange={handleFileChange}
                fullWidth
                margin="normal"
                error={!!fileError}
                helperText={fileError}
                inputRef={fileInputRef}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        style={{ marginLeft: '20px' }}
      >
        <Table
          columns={columns}
          dataSource={users}
          pagination={{ pageSize: 5 }}
        />
      </Grid>
    </div>
  );
};

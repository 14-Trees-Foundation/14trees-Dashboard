import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, ToggleButton, Typography, colors } from "@mui/material";
import { FC, useEffect, useState } from "react";
import Papa from 'papaparse';
import { ColumnType } from "antd/es/table";
import { toast } from "react-toastify";
import { AWSUtils } from "../../../../helpers/aws";
import ApiClient from "../../../../api/apiClient/apiClient";
import ImageMapping from "./ImageMapping";
import { CloudSync, DeleteOutline, EditOutlined, ImageOutlined, Web } from "@mui/icons-material";
import GeneralTable from "../../../../components/GenTable";
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../../components/Filter";
import { GridFilterItem } from "@mui/x-data-grid";
import SingleUserForm from "./SingleUserForm";
import { getUniqueRequestId } from "../../../../helpers/utils";
import { LoadingButton } from "@mui/lab";
import UserImagesForm from "./UserImagesForm";

interface User {
  key: string;
  gifted_to_name: string;
  gifted_to_phone: string;
  gifted_to_email: string;
  gifted_to_dob?: string;
  assigned_to_name?: string;
  assigned_to_phone?: string;
  assigned_to_email?: string;
  assigned_to_dob?: string;
  image?: boolean;
  image_name?: string;
  image_url?: string;
  relation?: string;
  count: number;
  error?: boolean;
  editable?: boolean;
}

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string) => {
  if (!phone || phone.trim() === '') return true;

  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // International phone number validation
  return phoneRegex.test(phone);
};

const dummyData: User[] = [
  {
    key: '1',
    gifted_to_name: "John Doe",
    gifted_to_phone: "1234567890",
    gifted_to_email: "kN3qK@example.com",
    gifted_to_dob: "01/01/2000",
    image: false,
    image_name: "John_Doe.png",
    count: 1,
    editable: false,
  },
  {
    key: '2',
    gifted_to_name: "Sam Smith",
    gifted_to_phone: "1234567890",
    gifted_to_email: "jI5w3@example.com",
    gifted_to_dob: "01/01/2000",
    image: true,
    image_name: "Sam_Smith.png",
    count: 2,
    editable: false,
  },
  {
    key: '3',
    gifted_to_name: "Rita White",
    gifted_to_phone: "1234567890",
    gifted_to_email: "jI5x2@example.com",
    gifted_to_dob: "01/01/2000",
    count: 2,
    editable: false,
  },
]

const giftNameField = 'Recipient Name'
const giftEmailField = 'Recipient Email'
const giftPhoneField = 'Recipient Phone (optional)'
const assignNameField = 'Assignee Name'
const assignEmailField = 'Assignee Email (optional)'
const assignPhoneField = 'Assignee Phone (optional)'
const countField = 'Number of trees to assign'
const imageNameField = 'Image Name (optional)'

interface CSVUploadProps {
  requestId: string | null
  onFileChange: (file: File) => void
}

const CSVUploadForm: FC<CSVUploadProps> = ({ requestId, onFileChange }) => {

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  const downloadGoogleSheet = () => {
    const url = "https://docs.google.com/spreadsheets/d/1DDM5nyrvP9YZ09B60cwWICa_AvbgThUx-yeDVzT4Kw4/gviz/tq?tqx=out:csv&sheet=Sheet1";
    const fileName = "UserDetails.csv";  // Set your desired file name here

    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => console.error("Download failed:", error));
  }

  return (
    <Box>
      <Typography>You can upload recipient details by using a CSV file. To get started, download the sample CSV file from <a style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={downloadGoogleSheet}>this</a> link, fill in the required recipient details, and then upload the completed CSV file.</Typography>
      <Typography mt={2}>You can optionally upload recipient or assignee images below to personalize the dashboard. If you upload images, ensure that the exact file name of each image is specified in the 'Image Name' column in the CSV file. If no image is uploaded, leave the 'Image Name' column blank.</Typography>
      <Box mt={3} display="flex" alignItems="flex-start" justifyContent='space-evenly'>
        <UserImagesForm requestId={requestId}/>
        <Box>
          <Typography>Upload completed csv file below: </Typography>
          <Button
            variant="contained"
            component="label"
            color="success"
            sx={{ mt: 1 }}
          >
            Select CSV File
            <input
              value=''
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileChange}
            />
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

interface BulkUserFormProps {
  requestId: string | null;
  treeCount: number,
  users: User[];
  onUsersChange: (users: User[]) => void;
  onFileChange: (file: File | null) => void;
}

export const BulkUserForm: FC<BulkUserFormProps> = ({ requestId, treeCount, users, onUsersChange, onFileChange }) => {
  const [pageUrl, setPageUrl] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [openImageSelection, setOpenImageSelection] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5)
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({})
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [showAllCols, setShowAllCols] = useState(false);
  const [csvModal, setCsvModal] = useState(false);
  const [manualUserModal, setManualUserModal] = useState(false);
  const [webScrapModal, setWebScrapModal] = useState(false);
  const [webScraping, setWebScraping] = useState(false);

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters)
  }

  const getFilteredUrls = (images: string[], str: string) => {

    const filteredUrls: string[] = [];
    for (const image of images) {
      const parts = str.split(' ')
      let count = 0;
      for (const part of parts) {
        if (image.toLocaleLowerCase().includes(part.toLocaleLowerCase())) count++;
      }

      if (count / parts.length > 0.5) filteredUrls.push(image)
    }

    return filteredUrls;
  }

  useEffect(() => {
    const newUsers: User[] = []
    let isNew = false;
    let showAllCols = false;
    for (const user of users) {

      if (user.assigned_to_name !== user.gifted_to_name) showAllCols = true;
      if (!user.image && user.gifted_to_name) {
        const uris = getFilteredUrls(imageUrls, user.gifted_to_name);

        if (uris.length === 1) {
          isNew = true;
          user.image = true;
          user.image_name = uris[0].split('/').slice(-1)[0];
          user.image_url = uris[0];
          user.error = !isValidEmail(user.gifted_to_email) || !isValidPhone(user.gifted_to_phone)
        }
      }

      newUsers.push(user);
    }

    if (isNew) onUsersChange(newUsers);
    setShowAllCols(showAllCols);

  }, [imageUrls, users])

  useEffect(() => {
    const getUrls = async () => {

      if (!requestId) return;

      const apiClient = new ApiClient();
      const urls = await apiClient.getImagesForRequestId(requestId);
      setImageUrls(urls);
    }

    getUrls();
  }, [requestId])

  useEffect(() => {
    const filterList = Object.values(filters);
    let filteredUsers = users;
    for (const filter of filterList) {
      if ((filter.columnField === 'gifted_to_name') && filter.value) filteredUsers = filteredUsers.filter(item => item.gifted_to_name.includes(filter.value));
      else if ((filter.columnField === 'gifted_to_email') && filter.value) filteredUsers = filteredUsers.filter(item => item.gifted_to_email.includes(filter.value));
      else if (filter.columnField === 'image' && filter.value && filter.value.length > 0) {
        filteredUsers = filteredUsers.filter(item => {
          if (item.image === undefined && filter.value.includes('Image Not Provided')) return true;
          else if (item.image === false && filter.value.includes('Image Not Found')) return true;
          return false
        });
      } else if (filter.columnField === 'error' && filter.value && filter.value.length > 0) {
        filteredUsers = filteredUsers.filter(item => filter.value.includes(item.error ? 'Yes' : 'No'));
      }
    }

    setFilteredUsers(filteredUsers);
  }, [filters, users])

  const handleFileChange = (file: File) => {

    const awsUtils = new AWSUtils();

    onFileChange(file);
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: async (results: any) => {
          const parsedUsers: User[] = [];

          for (let i = 0; i < results.data.length; i++) {
            const user = results.data[i];

            if (user[giftNameField] && user[giftEmailField]) {

              const parsedUser: User = {
                key: getUniqueRequestId(),
                gifted_to_name: (user[giftNameField] as string).trim(),
                gifted_to_phone: (user[giftPhoneField] as string).trim(),
                gifted_to_email: (user[giftEmailField] as string).trim(),
                image_name: user[imageNameField] ? user[imageNameField] : undefined,
                relation: user['Relation with person'] ? user['Relation with person'] : undefined,
                count: user[countField] ? user[countField] : 1,
                image: user[imageNameField] !== ''
                  ? await awsUtils.checkIfPublicFileExists('cards' + "/" + requestId + '/' + user[imageNameField])
                  : undefined,
                error: false,
                editable: false,
              };

              if ((user[assignNameField] as string).trim()) {
                parsedUser.assigned_to_name = (user[assignNameField] as string).trim()
                parsedUser.assigned_to_phone = (user[assignPhoneField] as string).trim()
                parsedUser.assigned_to_email = (user[assignEmailField] as string).trim()
              } else {
                parsedUser.assigned_to_name = parsedUser.gifted_to_name
                parsedUser.assigned_to_phone = parsedUser.gifted_to_email
                parsedUser.assigned_to_email = parsedUser.gifted_to_phone
              }

              if (!parsedUser.gifted_to_email) parsedUser.gifted_to_email = parsedUser.gifted_to_name.split(" ").join('.') + "@14trees"
              if (!parsedUser.assigned_to_email) parsedUser.assigned_to_email = parsedUser.assigned_to_name.split(" ").join('.') + "@14trees"
              if (parsedUser.image) parsedUser.image_url = awsUtils.getS3UrlForKey('cards' + "/" + requestId + '/' + user[imageNameField])

              parsedUsers.push(parsedUser);

            }
          }

          const usersList = parsedUsers.map(user => {
            return {
              ...user,
              error: !isValidEmail(user.gifted_to_email) || !isValidPhone(user.gifted_to_phone) || user.image === false
            }
          });
          onUsersChange(usersList);
        },
        error: () => {
          toast.error("Failed to parse CSV file. Please ensure it is formatted correctly.");
        },
      });
    }

    setCsvModal(false);
  };

  const handleCrapWebPage = async () => {
    if (pageUrl === '' || !requestId) {
      toast.error('Please provide valid web page link');
      return;
    }

    setWebScraping(true);
    const apiClient = new ApiClient();
    const imageUrls = await apiClient.scrapImagesFromWebPage(requestId, pageUrl);
    setImageUrls(imageUrls);
    setWebScraping(false);
    setWebScrapModal(false);

    toast.success("Successfully uploaded images!")
  }

  const handleImageSelection = (imageUrl: string) => {
    if (!selectedUser) return;

    const newUsers = [...users];
    const idx = newUsers.findIndex(user => user.gifted_to_email === selectedUser.gifted_to_email && user.assigned_to_name === selectedUser.assigned_to_name)
    if (idx > -1) {
      newUsers[idx].image = true;
      newUsers[idx].image_name = imageUrl.split('/').slice(-1)[0];
      newUsers[idx].image_url = imageUrl;
      newUsers[idx].error = !isValidEmail(newUsers[idx].gifted_to_email) || !isValidPhone(newUsers[idx].gifted_to_phone)
      onUsersChange(newUsers);
    }
  }

  const handleUserAdd = async (user: User) => {

    const image: File | string | undefined = (user as any).profileImage
    if (image && typeof image !== 'string' && requestId) {
      const awsUtils = new AWSUtils();
      const location = await awsUtils.uploadFileToS3('gift-request', image, requestId);
      user.image = true;
      user.image_name = image.name;
      user.image_url = location;
    } else if (image === selectedUser?.image_url) {
      user.image = selectedUser?.image;
      user.image_name = selectedUser?.image_name;
      user.image_url = selectedUser?.image_url;
    } else if (image && typeof image === 'string') {
      user.image = true;
      user.image_name = image.split("/").slice(-1)[0];
      user.image_url = image;
    }

    if (user.editable) {
      user.gifted_to_name = user.gifted_to_name.trim();
      user.gifted_to_phone = user.gifted_to_phone.trim();
      user.gifted_to_email = user.gifted_to_email.trim();
      user.relation = user.relation?.trim();
      user.assigned_to_name = user.assigned_to_name?.trim();
      user.assigned_to_phone = user.assigned_to_phone?.trim();
      user.assigned_to_email = user.assigned_to_email?.trim();
      user.error = !isValidEmail(user.gifted_to_email) || !isValidPhone(user.gifted_to_phone) || user.gifted_to_name === ''
    }

    const idx = users.findIndex((u) => (u.key === user.key));
    if (idx === -1) {
      user.key = getUniqueRequestId();
      onUsersChange([...users, user]);
    } else {
      const newUsers = [...users]
      newUsers[idx] = user;
      onUsersChange(newUsers);
    }

    setSelectedUser(null);
  }

  const handleDeleteUser = (user: User) => {
    onUsersChange(users.filter(item => item.gifted_to_email !== user.gifted_to_email));
  }

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page - 1);
    setPageSize(pageSize);
  }

  const columns: ColumnType<User>[] = [
    {
      dataIndex: "gifted_to_name",
      key: "gifted_to_name",
      title: "Recipient Name",
      width: 180,
      align: "center",
      ...getColumnSearchProps('gifted_to_name', filters, handleSetFilters),
    },
    {
      dataIndex: "gifted_to_email",
      key: "gifted_to_email",
      title: "Recipient Email",
      width: 180,
      align: "center",
      ...getColumnSearchProps('gifted_to_email', filters, handleSetFilters),
    },
    {
      dataIndex: "gifted_to_phone",
      key: "gifted_to_phone",
      title: "Recipient Phone",
      width: 180,
      align: "center",
    },
    {
      dataIndex: "assigned_to_name",
      key: "assigned_to_name",
      title: "Assignee Name",
      width: 180,
      align: "center",
      ...getColumnSearchProps('assigned_to_name', filters, handleSetFilters),
    },
    {
      dataIndex: "assigned_to_email",
      key: "assigned_to_email",
      title: "Assignee Email",
      width: 180,
      align: "center",
      ...getColumnSearchProps('assigned_to_email', filters, handleSetFilters),
    },
    {
      dataIndex: "assigned_to_phone",
      key: "assigned_to_phone",
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
          ? record.image_name
          : record.image_name + '\n(Not Found)',
      ...getColumnSelectedItemFilter({ dataIndex: 'image', filters, handleSetFilters, options: ['Image Not Provided', 'Image Not Found'] })
    },
    {
      dataIndex: "count",
      key: "count",
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
      ...getColumnSelectedItemFilter({ dataIndex: 'error', filters, handleSetFilters, options: ['Yes', 'No'] })
    },
    {
      dataIndex: "action",
      key: "action",
      title: "Actions",
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
          {record.editable && <Button
            variant="outlined"
            color="error"
            style={{ margin: "0 5px" }}
            onClick={() => {
              handleDeleteUser(record);
            }}
          >
            <DeleteOutline />
          </Button>}
        </div>
      ),
    },
  ];

  return (
    <div style={{ margin: '20px', width: '100%' }}>
      { (treeCount - users.map(user => user.count).reduce((prev, curr) => prev + curr, 0)) > 0
        && <Typography variant="h6" style={{ color: 'red' }}>Number of trees left to allocate: {treeCount - users.map(user => user.count).reduce((prev, curr) => prev + curr, 0)}</Typography>}
      <Grid
        container
        style={{ marginTop: '10px' }}
        width={'100%'}
      >
        <GeneralTable
          columns={showAllCols ? columns : columns.filter(item => !item.key?.toString().startsWith("assigned") && item.key?.toString() !== 'relation')}
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
      <Box mt={2} display="flex" alignItems="center">
        <Typography>Do you wish to fetch recipient(s) profile pic from a website (via webscraping)? </Typography>
        <ToggleButton
          value="check"
          color="success"
          selected={webScrapModal}
          sx={{ ml: 2 }}
          onChange={() => setWebScrapModal(true)}
          size="small"
        >
          <Web color="success" sx={{ mr: 1 }} /> Yes
        </ToggleButton>
      </Box>
      <Box mt={2} display="flex" alignItems="center">
        <Typography>Add Recipients: </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => { setManualUserModal(true) }}
          sx={{ ml: 2 }}
        >
          Add a recipient
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => { setCsvModal(true) }}
          sx={{ ml: 2 }}
        >
          Bulk add via csv
        </Button>
      </Box>

      <ImageMapping name={setSelectedUser.name} open={openImageSelection} images={imageUrls} onClose={() => { setOpenImageSelection(false) }} onSelect={handleImageSelection} />

      <Dialog open={csvModal} fullWidth maxWidth="md">
        <DialogTitle>Bulk upload recipient details using csv file</DialogTitle>
        <DialogContent dividers>
          <CSVUploadForm onFileChange={handleFileChange} requestId={requestId} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCsvModal(false)} variant="outlined" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={webScrapModal} fullWidth maxWidth="md">
        <DialogTitle>Fetch user images from website</DialogTitle>
        <DialogContent dividers>
          <Grid item xs={12}>
            <Typography variant="body1">Enter the link of the web page containing user images. You can refer these images during user addition.</Typography>
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30, marginTop: 5 }}>
              <TextField
                onChange={(event) => { setPageUrl(event.target.value.trim()) }}
                margin="normal"
                size="small"
                label="Web page url"
                style={{ display: 'flex', flexGrow: 1, marginRight: 5, marginTop: 0, marginBottom: 0 }}
              />
            </Box>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWebScrapModal(false)} variant="outlined" color="error">
            Cancel
          </Button>
          <LoadingButton
            loading={webScraping}
            loadingPosition="start"
            startIcon={<CloudSync />}
            variant="contained"
            color="success"
            onClick={handleCrapWebPage}
          >Fetch Images</LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog open={manualUserModal} fullWidth maxWidth="md">
        <DialogTitle>Recipient Details</DialogTitle>
        <DialogContent dividers>
          <SingleUserForm imageUrls={imageUrls} value={selectedUser} onSubmit={(user: any) => { handleUserAdd(user) }} onCancel={() => { setSelectedUser(null) }} />
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

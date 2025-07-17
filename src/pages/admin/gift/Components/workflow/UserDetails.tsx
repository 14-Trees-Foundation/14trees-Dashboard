import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, ToggleButton } from "@mui/material";
import { FC, useEffect, useState } from "react";
import Papa from 'papaparse';
import { toast } from "react-toastify";
import { AWSUtils } from "../../../../../helpers/aws";
import ApiClient from "../../../../../api/apiClient/apiClient";
import ImageMapping from "../ImageMapping";
import { Web } from "@mui/icons-material";
import { getUniqueRequestId } from "../../../../../helpers/utils";
import SingleUserForm from "../user/SingleUserForm";
import ImageViewModal from "../../../../../components/ImageViewModal";
import CSVUploadForm from "../user/components/CSVUploadForm";
import WebScrapingModal from "../user/components/WebScrapingModal";
import BulkUserTable from "../user/components/BulkUserTable";
import { isValidEmail, isValidPhone, generateDefaultEmail } from "../user/components/ValidationUtils";

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

const CSV_FIELD_MAPPING = {
  recipientName: 'Recipient Name',
  recipientEmail: 'Recipient Email',
  recipientCommEmail: 'Recipient Communication Email (optional)',
  recipientPhone: 'Recipient Phone (optional)',
  assigneeName: 'Assignee Name',
  assigneeEmail: 'Assignee Email (optional)',
  assigneeCommEmail: 'Assignee Communication Email (optional)',
  assigneePhone: 'Assignee Phone (optional)',
  count: 'Number of trees to assign',
  imageName: 'Image Name (optional)',
  relation: 'Relation with person'
};

interface BulkUserFormProps {
  requestId: string | null;
  treeCount: number,
  users: User[];
  onUsersChange: (users: User[]) => void;
  onFileChange: (file: File | null) => void;
}

export const BulkUserForm: FC<BulkUserFormProps> = ({ 
  requestId, 
  treeCount, 
  users, 
  onUsersChange, 
  onFileChange 
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAllCols, setShowAllCols] = useState(false);
  const [csvModal, setCsvModal] = useState(false);
  const [manualUserModal, setManualUserModal] = useState(false);
  const [webScrapModal, setWebScrapModal] = useState(false);
  const [webScraping, setWebScraping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getFilteredUrls = (images: string[], str: string) => {
    const filteredUrls: string[] = [];
    for (const image of images) {
      const parts = str.split(' ');
      let count = 0;
      for (const part of parts) {
        if (image.toLowerCase().includes(part.toLowerCase())) count++;
      }
      if (count / parts.length > 0.5) filteredUrls.push(image);
    }
    return filteredUrls;
  };

  useEffect(() => {
    const newUsers: User[] = [];
    let isNew = false;
    let showAllCols = false;
    
    for (const user of users) {
      if (user.assignee_name !== user.recipient_name) showAllCols = true;
      if (!user.image && user.recipient_name) {
        const uris = getFilteredUrls(imageUrls, user.recipient_name);
        if (uris.length === 1) {
          isNew = true;
          user.image = true;
          user.image_name = uris[0].split('/').slice(-1)[0];
          user.image_url = uris[0];
          user.error = !isValidEmail(user.recipient_email) || !isValidPhone(user.recipient_phone);
        }
      }
      newUsers.push(user);
    }

    if (isNew) onUsersChange(newUsers);
    setShowAllCols(showAllCols);
  }, [imageUrls, users, onUsersChange]);

  useEffect(() => {
    const getUrls = async () => {
      if (!requestId) return;
      const apiClient = new ApiClient();
      const urls = await apiClient.getImagesForRequestId(requestId);
      setImageUrls(urls);
    };
    getUrls();
  }, [requestId]);

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

            if (user[CSV_FIELD_MAPPING.recipientName]) {
              const parsedUser: User = {
                key: getUniqueRequestId(),
                recipient_name: (user[CSV_FIELD_MAPPING.recipientName] as string).trim(),
                recipient_phone: (user[CSV_FIELD_MAPPING.recipientPhone] as string).trim(),
                recipient_email: (user[CSV_FIELD_MAPPING.recipientEmail] as string).trim(),
                recipient_communication_email: (user[CSV_FIELD_MAPPING.recipientCommEmail] as string).trim(),
                assignee_name: (user[CSV_FIELD_MAPPING.assigneeName] as string).trim(),
                assignee_phone: (user[CSV_FIELD_MAPPING.assigneePhone] as string).trim(),
                assignee_email: (user[CSV_FIELD_MAPPING.assigneeEmail] as string).trim(),
                assignee_communication_email: (user[CSV_FIELD_MAPPING.assigneeCommEmail] as string).trim(),
                image_name: user[CSV_FIELD_MAPPING.imageName] ? user[CSV_FIELD_MAPPING.imageName] : undefined,
                relation: user[CSV_FIELD_MAPPING.relation] ? user[CSV_FIELD_MAPPING.relation] : undefined,
                gifted_trees: user[CSV_FIELD_MAPPING.count] ? user[CSV_FIELD_MAPPING.count] : 1,
                image: user[CSV_FIELD_MAPPING.imageName] !== ''
                  ? await awsUtils.checkIfPublicFileExists('cards' + "/" + requestId + '/' + user[CSV_FIELD_MAPPING.imageName])
                  : undefined,
                error: false,
                editable: false,
              };

              if (!(user[CSV_FIELD_MAPPING.assigneeName] as string).trim()) {
                parsedUser.assignee_name = parsedUser.recipient_name;
                parsedUser.assignee_phone = parsedUser.recipient_phone;
                parsedUser.assignee_email = parsedUser.recipient_email;
                parsedUser.assignee_communication_email = parsedUser.recipient_communication_email;
              }

              if (!parsedUser.recipient_email) {
                parsedUser.recipient_email = generateDefaultEmail(parsedUser.recipient_name);
              }
              if (!parsedUser.assignee_email) {
                parsedUser.assignee_email = generateDefaultEmail(parsedUser.assignee_name);
              }
              if (parsedUser.image) {
                parsedUser.image_url = awsUtils.getS3UrlForKey('cards' + "/" + requestId + '/' + user[CSV_FIELD_MAPPING.imageName]);
              }

              parsedUsers.push(parsedUser);
            }
          }

          const usersList = parsedUsers.map(user => ({
            ...user,
            error: !isValidEmail(user.recipient_email) || !isValidPhone(user.recipient_phone) || user.image === false
          }));
          onUsersChange(usersList);
        },
        error: () => {
          toast.error("Failed to parse CSV file. Please ensure it is formatted correctly.");
        },
      });
    }
    setCsvModal(false);
  };

  const handleWebPageScrape = async (pageUrl: string) => {
    if (pageUrl === '' || !requestId) {
      toast.error('Please provide valid web page link');
      return;
    }

    setWebScraping(true);
    try {
      const apiClient = new ApiClient();
      const imageUrls = await apiClient.scrapImagesFromWebPage(requestId, pageUrl);
      setImageUrls(imageUrls);
      toast.success("Successfully uploaded images!");
    } catch (error: any) {
      toast.error(error.message);
    }
    setWebScraping(false);
    setWebScrapModal(false);
  };

  const handleImageSelection = (imageUrl: string) => {
    if (!selectedUser) return;

    const newUsers = [...users];
    const idx = newUsers.findIndex(user => user.key === selectedUser.key);
    if (idx > -1) {
      newUsers[idx].image = true;
      newUsers[idx].image_name = imageUrl.split('/').slice(-1)[0];
      newUsers[idx].image_url = imageUrl;
      newUsers[idx].error = !isValidEmail(newUsers[idx].recipient_email) || !isValidPhone(newUsers[idx].recipient_phone);
      onUsersChange(newUsers);
    }
  };

  const handleUserAdd = async (user: User) => {
    const image: File | string | undefined = (user as any).profileImage;
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
    } else {
      user.image = undefined;
      user.image_name = undefined;
      user.image_url = undefined;
    }

    if (user.editable) {
      user.recipient_name = user.recipient_name.trim();
      user.recipient_phone = user.recipient_phone.trim();
      user.recipient_email = user.recipient_email.trim();
      user.recipient_communication_email = user.recipient_communication_email.trim();
      user.relation = user.relation?.trim();
      user.assignee_name = user.assignee_name?.trim();
      user.assignee_phone = user.assignee_phone?.trim();
      user.assignee_email = user.assignee_email?.trim();
      user.assignee_communication_email = user.assignee_communication_email?.trim();
      user.error = !isValidEmail(user.recipient_email) || !isValidPhone(user.recipient_phone) || user.recipient_name === '';
    }

    const idx = users.findIndex((u) => (u.key === user.key));
    if (idx === -1) {
      user.key = getUniqueRequestId();
      onUsersChange([...users, user]);
    } else {
      const newUsers = [...users];
      newUsers[idx] = { 
        ...newUsers[idx], 
        ...user,
        image: user.image, 
        image_name: user.image_name, 
        image_url: user.image_url, 
      };
      onUsersChange(newUsers);
    }
    setSelectedUser(null);
  };

  const handleDeleteUser = (user: User) => {
    onUsersChange(users.filter(item => item.recipient_email !== user.recipient_email));
  };

  return (
    <div>
      <BulkUserTable
        users={users}
        imageUrls={imageUrls}
        treeCount={treeCount}
        showAllCols={showAllCols}
        onUsersChange={onUsersChange}
        onDeleteUser={handleDeleteUser}
        onUserAdd={handleUserAdd}
        onImageSelection={handleImageSelection}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      <Box mt={2} display="flex" alignItems="center">
        <Typography>Do you wish to fetch recipient(s) profile pic from a website (via webscraping)?</Typography>
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
        <Typography>Add Recipients:</Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => setManualUserModal(true)}
          sx={{ ml: 2 }}
        >
          Add a recipient
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => setCsvModal(true)}
          sx={{ ml: 2 }}
        >
          Bulk add via csv
        </Button>
      </Box>

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

      <WebScrapingModal
        open={webScrapModal}
        onClose={() => setWebScrapModal(false)}
        onScrape={handleWebPageScrape}
        loading={webScraping}
      />

      <Dialog open={manualUserModal} fullWidth maxWidth="md">
        <DialogTitle>Recipient Details</DialogTitle>
        <DialogContent dividers>
          <SingleUserForm 
            maxTrees={treeCount - users.map(u => u.gifted_trees).reduce((prev, curr) => prev + curr, 0)}  
            imageUrls={imageUrls} 
            value={selectedUser} 
            onSubmit={handleUserAdd} 
            onCancel={() => setSelectedUser(null)} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setManualUserModal(false)} variant="outlined" color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <ImageViewModal 
        open={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ''}
      />
    </div>
  );
};
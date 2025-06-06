import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Avatar,
    IconButton,
    Box,
    Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface EditOrganizationDialogProps {
    open: boolean;
    onClose: () => void;
    organizationData: {
        name: string;
        address: string;
        logo_url: string;
    };
    onSave: (data: { name: string; address: string; logo_url: string }) => void;
}

const EditOrganizationDialog: React.FC<EditOrganizationDialogProps> = ({
    open,
    onClose,
    organizationData,
    onSave
}) => {
    const theme = useTheme();
    const [name, setName] = useState(organizationData.name);
    const [address, setAddress] = useState(organizationData.address);
    const [logoUrl, setLogoUrl] = useState(organizationData.logo_url);
    const [logoPreview, setLogoPreview] = useState(organizationData.logo_url);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            // In a real app, you would upload the file to your server here
            // and get back the new URL to save
        }
    };

    const handleSave = () => {
        onSave({
            name,
            address,
            logo_url: logoPreview // In a real app, this would be the new URL from the server
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Box display="flex" alignItems="center">
                    <Typography variant="h6">Edit Organization Details</Typography>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                    <Avatar
                        src={logoPreview}
                        alt="Organization logo"
                        sx={{
                            width: 120,
                            height: 120,
                            mb: 2,
                            '& img': {
                                objectFit: 'contain'
                            }
                        }}
                    />
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="logo-upload"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="logo-upload">
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload New Logo
                        </Button>
                    </label>
                </Box>

                <TextField
                    label="Organization Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    label="Address"
                    fullWidth
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows={3}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="success" variant="contained">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditOrganizationDialog;
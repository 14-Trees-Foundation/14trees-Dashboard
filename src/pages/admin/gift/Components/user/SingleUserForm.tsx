import { Button, Checkbox, FormControl, FormControlLabel, Grid, TextField } from "@mui/material";
import { FC, useState, ChangeEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../redux/store/hooks";
import * as userActionCreators from "../../../../../redux/actions/userActions";
import { bindActionCreators } from "@reduxjs/toolkit";
import ImageMapping from "../ImageMapping";
import UserFormFields from "./components/UserFormFields";
import RelationshipSelector from "./components/RelationshipSelector";
import ImageUploadSection from "./components/ImageUploadSection";
import { generateDefaultEmail } from "./components/ValidationUtils";

interface User {
    key?: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_email: string;
    recipient_communication_email: string;
    assignee_name: string;
    assignee_phone: string;
    assignee_email: string;
    assignee_communication_email: string;
    relation: string;
    gifted_trees: number;
    editable?: boolean,
    profileImage?: File | string;
}

interface SingleUserFormProps {
    maxTrees: number
    imageUrls: string[]
    value: any
    onSubmit: (user: User) => void;
    onCancel: () => void
}

const SingleUserForm: FC<SingleUserFormProps> = ({ 
    maxTrees, 
    imageUrls, 
    value, 
    onSubmit, 
    onCancel 
}) => {
    const dispatch = useAppDispatch();
    const { searchUsers } = bindActionCreators(userActionCreators, dispatch);

    const [user, setUser] = useState<User>({
        recipient_name: '',
        recipient_email: '',
        recipient_communication_email: '',
        recipient_phone: '',
        assignee_email: '',
        assignee_communication_email: '',
        assignee_name: '',
        assignee_phone: '',
        relation: '',
        gifted_trees: 1,
        editable: true,
    });
    const [showAssignedFields, setShowAssignedFields] = useState(false);
    const [imageSelectionModal, setImageSelectionModal] = useState(false);

    useEffect(() => {
        if (value) {
            setUser({
                key: value.key,
                recipient_name: value.recipient_name,
                recipient_email: value.recipient_email,
                recipient_communication_email: value.recipient_communication_email,
                recipient_phone: value.recipient_phone || '',
                assignee_name: value.assignee_name,
                assignee_email: value.assignee_email,
                assignee_communication_email: value.assignee_communication_email,
                assignee_phone: value.assignee_phone || '',
                relation: value.relation || '',
                gifted_trees: value.gifted_trees,
                profileImage: value.image_url,
                editable: value.editable,
            })

            if (value.recipient_name !== value.assignee_name) setShowAssignedFields(true);
        }
    }, [value]);

    const handleUserChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const handleNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, parseInt(event.target.value, 10));
        setUser({ ...user, gifted_trees: value });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setUser(prev => ({
            ...prev,
            profileImage: file ?? undefined
        }));
    };

    const handleImageSelection = (imageUrl: string) => {
        setUser(prev => ({
            ...prev,
            profileImage: imageUrl
        }));
    }

    const handleRemoveImage = () => {
        setUser(prev => ({ ...prev, profileImage: undefined }));
    };

    const usersData = useAppSelector((state) => state.searchUsersData);
    let usersList: any[] = [];
    if (usersData) {
        usersList = Object.values(usersData.users);
    }

    const handleRecipientEmailChange = (event: React.SyntheticEvent, value: string) => {
        handleEmailChange(event, value, 'recipient_email');
    };

    const handleAssigneeEmailChange = (event: React.SyntheticEvent, value: string) => {
        handleEmailChange(event, value, 'assignee_email');
    };

    const handleEmailChange = (event: React.SyntheticEvent, value: string, field: 'recipient_email' | 'assignee_email') => {
        let isSet = false;
        usersList.forEach((user) => {
            if (`${user.name} (${user.email})` === value) {
                isSet = true;
                if (field === 'recipient_email') {
                    setUser(prev => ({
                        ...prev,
                        recipient_email: user.email,
                        recipient_name: user.name,
                        recipient_phone: user.phone ?? '',
                        recipient_communication_email: user.communication_email ?? '',
                    }));
                } else {
                    setUser(prev => ({
                        ...prev,
                        assignee_email: user.email,
                        assignee_name: user.name,
                        assignee_phone: user.phone ?? '',
                        assignee_communication_email: user.communication_email ?? '',
                    }));
                }
            }
        });

        if (!isSet && user[field] !== value && value !== ` ()`) {
            setUser({
                ...user,
                [field]: value,
            });
            if (value.length >= 3) searchUsers(value);
        }
    };

    const handleSubmit = () => {
        if (!user.recipient_name.trim()) return;
        if (showAssignedFields && !user.assignee_name.trim()) return;

        const data = { ...user };
        if (data.recipient_email.trim() === '') {
            data.recipient_email = generateDefaultEmail(data.recipient_name);
        }

        if (!showAssignedFields || !data.assignee_name) {
            data.assignee_email = data.recipient_email
            data.assignee_phone = data.recipient_phone
            data.assignee_name = data.recipient_name
            data.assignee_communication_email = data.recipient_communication_email
        } else if (showAssignedFields && data.assignee_email.trim() === '') {
            data.assignee_email = generateDefaultEmail(data.assignee_name);
        }

        onSubmit(data);
        handleCancel();
    };

    const handleCancel = () => {
        setUser({
            recipient_name: '',
            recipient_email: '',
            recipient_communication_email: '',
            recipient_phone: '',
            assignee_email: '',
            assignee_communication_email: '',
            assignee_name: '',
            assignee_phone: '',
            relation: '',
            gifted_trees: 1,
            editable: true,
        });
        onCancel();
    };

    return (
        <div>
            <Grid container rowSpacing={2} columnSpacing={1}>
                <UserFormFields
                    userEmail={user.recipient_email}
                    userName={user.recipient_name}
                    userPhone={user.recipient_phone}
                    userCommEmail={user.recipient_communication_email}
                    usersList={usersList}
                    disabled={!user.editable}
                    fieldPrefix="recipient"
                    onEmailChange={handleRecipientEmailChange}
                    onInputChange={handleUserChange}
                />
                
                <Grid item xs={12}>
                    <TextField
                        type="number"
                        label="Number of trees to assign"
                        name="gifted_trees"
                        value={user.gifted_trees}
                        onChange={handleNumberChange}
                        inputProps={{ 
                            min: user.editable ? 1 : value?.gifted_trees || 1, 
                            max: Math.max(value?.gifted_trees ? value.gifted_trees : 0, maxTrees) 
                        }}
                        fullWidth
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <FormControl component="fieldset">
                        <FormControlLabel
                            control={
                                <Checkbox 
                                    checked={showAssignedFields} 
                                    onChange={(e) => setShowAssignedFields(e.target.checked)} 
                                    name="show_all" 
                                />
                            }
                            label="Do you want to assign/name the tree(s) to someone else (related to recipient)?"
                        />
                    </FormControl>
                </Grid>
                
                {showAssignedFields && (
                    <UserFormFields
                        userEmail={user.assignee_email}
                        userName={user.assignee_name}
                        userPhone={user.assignee_phone}
                        userCommEmail={user.assignee_communication_email}
                        usersList={usersList}
                        disabled={!user.editable}
                        fieldPrefix="assignee"
                        onEmailChange={handleAssigneeEmailChange}
                        onInputChange={handleUserChange}
                    />
                )}
                
                {showAssignedFields && (
                    <RelationshipSelector
                        relation={user.relation}
                        recipientName={user.recipient_name}
                        assigneeName={user.assignee_name}
                        disabled={!user.editable}
                        onRelationChange={(relation) => setUser(prev => ({ ...prev, relation }))}
                    />
                )}
                
                <ImageUploadSection
                    currentImageUrl={typeof user.profileImage === 'string' ? user.profileImage : undefined}
                    uploadedImage={typeof user.profileImage !== 'string' ? user.profileImage : undefined}
                    imageUrls={imageUrls}
                    showAssignedFields={showAssignedFields}
                    onImageChange={handleImageChange}
                    onImageSelectionModalOpen={() => setImageSelectionModal(true)}
                    onRemoveImage={handleRemoveImage}
                />
                
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleCancel}
                        style={{ marginRight: '10px' }}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                        disabled={!value && maxTrees === 0}
                    >
                        Add
                    </Button>
                </Grid>
            </Grid>

            <ImageMapping 
                name={user.assignee_name || user.recipient_name} 
                open={imageSelectionModal} 
                images={imageUrls} 
                onClose={() => setImageSelectionModal(false)} 
                onSelect={handleImageSelection} 
            />
        </div>
    );
};

export default SingleUserForm;
import { useState } from 'react';
import { Autocomplete, Box, Button, Grid, Modal, TextField, Typography } from '@mui/material';
import { useAppSelector } from '../../../../redux/store/hooks';
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from "react-image-crop";
import Dropzone from 'react-dropzone';
import imageCompression from "browser-image-compression";

const AssignTreeModal = ({ open, handleClose, onSubmit, searchUsers }) => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        overflowY: 'auto', 
        transform: 'translate(-50%, -50%)',
        minWidth: 400,
        maxWidth: 600,
        height: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        borderRadius: '10px',
        p: 4,
    };

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        org: '',
        sponsored_by_user: '',
        plantation_type: '',
        gifted_by: '',
        planted_by: '',
        type: '',
        description: '',
    });
    const [crop, setCrop] = useState(
        // default crop config
        {
            unit: "%",
            width: 30,
            aspect: 9 / 11,
        }
    );
    const [imageRef, setImageRef] = useState();
    const [srcImg, setSrcImage] = useState(null);
    const [cropImgSrc, setCropImgSrc] = useState(null);

    let usersList = [];
    const usersData = useAppSelector((state) => state.searchUsersData);
    if (usersData) {
        usersList = Object.values(usersData.users);
    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const plantationTypeList = [
        { id: 'onsite', value: 'Onsite' },
        { id: 'offsite', value: 'Offsite' },
    ]

    const eventTypes = [
        {
            value: "Birthday",
            id: "1",
        },
        {
            value: "In Memory of",
            id: "2",
        },
        {
            value: "General gift",
            id: "3",
        },
        {
            value: "Corporate gift",
            id: "4",
        },
    ];

    // search based on phone will be added after postgres changes
    const handleEmailChange = (event, value) => {
        let isSet = false;
        usersList.forEach((user) => {
            if (`${user.name} (${user.email})` === value) {
                isSet = true;
                setFormData({
                    ...formData,
                    'email': user.email,
                    'name': user.name,
                    'phone': user.phone ?? '',
                })
            }
        })

        if (!isSet) {
            setFormData({
                ...formData,
                'email': value,
            })
            if (value.length >= 3) searchUsers(value);
        }
    }

    const compressImageList = async (file) => {
        const options = {
          maxSizeMB: 2.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
    
        let compressedFile;
    
        try {
          compressedFile = await imageCompression(file, options);
        } catch (error) {
          console.log(error);
        }
    
        return new File([compressedFile], file.name);
      };

    const handleAutocompleteChange = (key, value) => {
        if (value !== null) {
            setFormData((prevState) => {
                return { ...prevState, [key]: value.id };
            });
        }
    }

    const handleSearch = (event, value) => {
        if (value.length >= 3) searchUsers(value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
        onSubmit(formData);
    };

    const handleProfilePic = (images) => {
        setSrcImage(images ? URL.createObjectURL(images[0]) : null);
    };

    async function cropImage(crop) {
        let random = Math.random().toString(36).substr(2, 5);
        if (imageRef && crop.width && crop.height) {
            const croppedImage = await getCroppedImg(
                imageRef,
                crop,
                "croppedImage" + random + ".jpeg" // destination filename
            );
            
            // calling the props function to expose
            if (croppedImage) {
                const image = await compressImageList(croppedImage);
                setFormData({
                    ...formData,
                    'files': image,
                    'user_image': croppedImage.name,
                });
            }
            setCropImgSrc(croppedImage ? URL.createObjectURL(croppedImage) : null);
        }
    }

    const getCroppedImg = async (imageFile, pixelCrop, fileName) => {
        const canvas = document.createElement("canvas");

        const scaleX = imageFile.naturalWidth / imageFile.width;
        const scaleY = imageFile.naturalHeight / imageFile.height;
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            imageFile,
            pixelCrop.x * scaleX,
            pixelCrop.y * scaleY,
            pixelCrop.width * scaleX,
            pixelCrop.height * scaleY,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    // returning an error
                    if (!blob) {
                        reject(new Error("Canvas is empty"));
                        return;
                    }

                    const file = new File([blob], fileName, { type: 'image/jpeg' });
                    resolve(file);
                },
                "image/jpeg",
                1
            );
        });

    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form onSubmit={handleSubmit}>
                        <Grid container rowSpacing={2} columnSpacing={1} >
                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                    Assign Trees
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="phone" label="Phone" value={formData.phone} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    fullWidth
                                    options={usersList}
                                    name='email'
                                    noOptionsText="No Users"
                                    value={formData.email}
                                    onInputChange={handleEmailChange}
                                    getOptionLabel={(option) => option.email ? `${option.name} (${option.email})` : option}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Email" variant="outlined" />
                                    )}>
                                </Autocomplete>
                            </Grid>
                            {/* <Grid item xs={12}>
                                <TextField name="org" label="Org" value={formData.org} onChange={handleChange} fullWidth/>
                            </Grid> */}
                            <Grid item xs={12}>
                                <Autocomplete
                                    fullWidth
                                    options={usersList}
                                    name='sponsored_by_user'
                                    onChange={(event, value) => { handleAutocompleteChange('sponsored_by_user', value) }}
                                    getOptionLabel={(option) => option.email ? `${option.name} (${option.email})` : option}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Donor" variant="outlined" />
                                    )}>
                                </Autocomplete>
                                {/* <TextField name="donor" label="Donor" value={formData.donor} onChange={handleChange} fullWidth/> */}
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    fullWidth
                                    options={plantationTypeList}
                                    name='plantation_type'
                                    onChange={(event, value) => { handleAutocompleteChange('plantation_type', value) }}
                                    getOptionLabel={(option) => option.value}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Planted Type" variant="outlined" />
                                    )}>
                                </Autocomplete>
                                {/* <TextField name="plantation_type" label="Planted Type" value={formData.plantation_type} onChange={handleChange} fullWidth/> */}
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    fullWidth
                                    options={usersList}
                                    name='gifted_by'
                                    onChange={(event, value) => { handleAutocompleteChange('gifted_by', value) }}
                                    onInputChange={handleSearch}
                                    getOptionLabel={(option) => option.email ? `${option.name} (${option.email})` : option}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Gifted By" variant="outlined" />
                                    )}>
                                </Autocomplete>
                                {/* <TextField name="gifted_by" label="Gifted By" value={formData.gifted_by} onChange={handleChange} fullWidth/> */}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="planted_by" label="Planted By" value={formData.planted_by} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        fullWidth
                                        options={eventTypes}
                                        name='type'
                                        onChange={(event, value) => { handleAutocompleteChange('type', value) }}
                                        getOptionLabel={(option) => option.value}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Event Type" variant="outlined" />
                                        )}>
                                    </Autocomplete>
                                    {/* <TextField name="gifted_by" label="Gifted By" value={formData.gifted_by} onChange={handleChange} fullWidth/> */}
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="description" label="Event Name / Description" value={formData.description} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{
                                    padding: "4px",
                                    marginBottom: "8px",
                                    border: "1px #1f3625 dashed",
                                    textAlign: "center",
                                }}>
                                    <Dropzone
                                        onDrop={(acceptedFiles) =>
                                            handleProfilePic(acceptedFiles)
                                        }
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <section>
                                                <div {...getRootProps()}>
                                                    <input {...getInputProps()} />
                                                    <p style={{ cursor: "pointer" }}>
                                                        Upload profile pic. Click or Drag!
                                                    </p>
                                                </div>
                                            </section>
                                        )}
                                    </Dropzone>
                                </div> 
                            </Grid>
                            {srcImg && (<Grid item xs={12}>
                                <ReactCrop
                                    src={srcImg}
                                    crop={crop}
                                    onImageLoaded={(imageRef) => setImageRef(imageRef)}
                                    onComplete={(cropConfig) => cropImage(cropConfig)}
                                    onChange={(c) => setCrop(c)}
                                />
                                <div style={{ width: "100%", textAlign: "center" }}>
                                    <img
                                        src={cropImgSrc}
                                        alt="profile"
                                    />
                                </div>
                            </Grid>
                            )}
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
                                <Button color='error' variant='outlined' onClick={handleClose} sx={{ marginRight: '8px' }}>Cancel</Button>
                                <Button type="submit" variant="contained" color="success">Submit</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}

export default AssignTreeModal;
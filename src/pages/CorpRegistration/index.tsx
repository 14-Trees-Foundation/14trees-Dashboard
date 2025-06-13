import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  CircularProgress,
  Slide,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import backgroundImage from '../../assets/ARANYA_poster.jpg';
import {AWSUtils} from '../../helpers/aws'
import ApiClient from '../../api/apiClient/apiClient';

const BackgroundContainer = styled(Container)(({ theme }) => ({
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: 'auto',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(5px)',
  width: '100%',
  maxWidth: '800px',
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const GreenStepIcon = styled('div')<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: ownerState.active ? '#4caf50' : theme.palette.text.secondary,
    display: 'flex',
    height: 22,
    alignItems: 'center',
    '& .MuiStepIcon-completed': {
      color: '#4caf50',
    },
    '& .MuiStepIcon-active': {
      color: '#4caf50',
    },
  })
);

// Custom styled TextField with green focus
const GreenTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#4caf50',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#4caf50',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: '#81c784',
    },
  },
});

interface FormErrors {
  name?: string;
  address?: string;
  companyEmail?: string;
  logo?: string;
  username?: string;
  userEmail?: string;
  phone?: string;
}

const steps = ['Company Information', 'User Information'];

const initialFormData = {
  name: '',
  address: '',
  companyEmail: '',
  logo: null as File | null,
  username: '',
  userEmail: '',
  phone: '',
};

const CorpRegistration: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
      isValid = false;
    } else if (formData.name.length < 2) {
      newErrors.name = 'Company name must be at least 2 characters';
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.companyEmail) {
      newErrors.companyEmail = 'Company email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.companyEmail)) {
      newErrors.companyEmail = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.logo) {
      newErrors.logo = 'Company logo is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (formData.username.length < 2) {
      newErrors.username = 'Username must be at least 2 characters';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.userEmail) {
      newErrors.userEmail = 'User email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.userEmail)) {
      newErrors.userEmail = 'Please enter a valid email address';
      isValid = false;
    }

    if (formData.phone && !/^[0-9+-]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number can only contain numbers, +, or -';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone' && !/^[0-9+-]*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleLogoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    // Validation checks
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({
        ...prev,
        logo: 'Please upload an image file',
      }));
      return;
    }
  
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        logo: 'File size should be less than 5MB',
      }));
      return;
    }
  
    try {
      setIsUploadingLogo(true);
      setUploadProgress(0);
      
      // Upload to S3
      const awsUtils = new AWSUtils();
      const url = await awsUtils.uploadFileToS3(
        'logo',
        file,
        undefined,
        (progress: number) => { setUploadProgress(progress) }
      );
  
      setLogoUrl(url);
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));
  
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      setErrors((prev) => ({
        ...prev,
        logo: undefined,
      }));
    } catch (error) {
      console.error('Logo upload failed:', error);
      setErrors((prev) => ({
        ...prev,
        logo: 'Logo upload failed. Please try again.',
      }));
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logo: null,
    }));
    setLogoPreview('');
    setLogoUrl(null);
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setLogoPreview('');
    setErrors({});
    setStep(1);
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const apiClient = new ApiClient();
      const corporateData = {
        name: formData.name,
        type: "corporate",
        logo_url: logoUrl || undefined,
        address: formData.address,
        billing_email: formData.companyEmail,
        description: '',
      };

      const userData = {
        name: formData.username,
        email: formData.userEmail,
        phone: formData.phone || undefined,
      };

      await apiClient.registerGroup(corporateData, userData);

      setSubmitSuccess(true);
      resetForm(); 

    } catch (error: any) {
      console.error('Registration failed:', error);
      setSubmitError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Complete = Boolean(
    formData.name.trim() &&
    formData.address.trim() &&
    formData.companyEmail.trim() &&
    formData.logo
  );

  const isStep2Complete = Boolean(
    formData.username.trim() &&
    formData.userEmail.trim()
  );

  return (
    <BackgroundContainer maxWidth={false}>
      <StyledPaper elevation={3} sx={{ overflow: 'hidden' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Corporate Registration
        </Typography>

        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Registration successful! You can now register another company if needed.
          </Alert>
        )}

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Stepper activeStep={step - 1} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={(props) => (
                  <GreenStepIcon ownerState={{ active: props.active || props.completed }}>
                    {props.icon}
                  </GreenStepIcon>
                )}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* STEP TRANSITION ANIMATION */}
          <Slide
            key={step}
            direction={step === 2 ? "left" : "right"}
            in={true}
            mountOnEnter
            unmountOnExit
            timeout={800}
          >
            <div>
              {step === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <GreenTextField
                      required
                      fullWidth
                      label="Company Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={!!errors.name}
                      helperText={errors.name}
                      sx={{ mb: 3 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <GreenTextField
                      required
                      fullWidth
                      label="Company Email"
                      name="companyEmail"
                      type="email"
                      value={formData.companyEmail}
                      onChange={handleChange}
                      error={!!errors.companyEmail}
                      helperText={errors.companyEmail}
                      sx={{ mb: 3 }}
                    />
                  </Grid>

                  <Grid container item xs={12} spacing={3}>
                    <Grid item xs={12} md={8.4}>
                      <GreenTextField
                        required
                        fullWidth
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        error={!!errors.address}
                        helperText={errors.address}
                        multiline
                        rows={4}
                      />
                    </Grid>

                    <Grid item xs={12} md={3.6}>
                      <Box
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          position: 'relative',
                        }}
                      >
                        {!logoPreview ? (
                          <Button
                            component="label"
                            variant="contained"
                            color="success"
                            startIcon={<CloudUploadIcon />}
                            fullWidth
                            sx={{
                              height: '56px',
                              mt: '8px'
                            }}
                          >
                            Upload Logo
                            <VisuallyHiddenInput
                              type="file"
                              accept="image/*"
                              onChange={handleLogoChange}
                            />
                          </Button>
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              position: 'relative',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              mt: '8px',
                              height: '100%',
                            }}
                          >
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              style={{
                                maxWidth: '100%',
                                maxHeight: '120px',
                                borderRadius: '4px',
                                objectFit: 'contain',
                              }}
                            />
                            <IconButton
                              onClick={handleRemoveLogo}
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                border: '1px solid #f44336',
                                padding: '4px',
                                '&:hover': {
                                  backgroundColor: 'rgba(255,255,255,1)',
                                },
                              }}
                            >
                              <DeleteIcon color="error" fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                        {errors.logo && (
                          <Alert severity="error" sx={{ width: '100%', mt: 1 }}>
                            {errors.logo}
                          </Alert>
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      size="large"
                      onClick={handleNextStep}
                      disabled={!isStep1Complete}
                      sx={{ mt: 3 }}
                    >
                      Next
                    </Button>
                  </Grid>
                </Grid>
              )}

              {step === 2 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <GreenTextField
                      required
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      error={!!errors.username}
                      helperText={errors.username}
                      sx={{ mb: 3 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <GreenTextField
                      required
                      fullWidth
                      label="User Email"
                      name="userEmail"
                      type="email"
                      value={formData.userEmail}
                      onChange={handleChange}
                      error={!!errors.userEmail}
                      helperText={errors.userEmail}
                      sx={{ mb: 3 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <GreenTextField
                      fullWidth
                      label="Phone Number (optional)"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      inputProps={{ inputMode: 'tel' }}
                      sx={{ mb: 3 }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      color="success"
                      fullWidth
                      size="large"
                      onClick={handlePreviousStep}
                      sx={{ height: '46px' }}
                    >
                      Back
                    </Button>
                  </Grid>

                  <Grid item xs={6}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      fullWidth
                      size="large"
                      disabled={!isStep2Complete || isSubmitting}
                      sx={{ height: '46px' }}
                    >
                      {isSubmitting ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Register'
                      )}
                    </Button>
                  </Grid>
                </Grid>
              )}
            </div>
          </Slide>
        </Box>
      </StyledPaper>
    </BackgroundContainer>
  );
};

export default CorpRegistration;
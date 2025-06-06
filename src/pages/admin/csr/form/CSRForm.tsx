import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PlantationInfoTab } from './components/PlantationInfoTab';
import { RecipientDetailsTab } from './components/RecipientDetailsTab';
import { SponsorDetailsTab } from './components/SponsorDetailsTab';
import CardDetails from '../../../admin/gift/Form/CardDetailsForm';
import  ApiClient  from '../../../../api/apiClient/apiClient'; 

interface TreeSponsorshipFormProps {
  open: boolean;
  onClose: () => void;
  group_id: number;
  onSubmit: (formData: FormData) => void;
}

interface Recipient {
  name: string;
  email: string;
  message: string;
  treeCount: number;
}

interface FormData {
  treeCount: number;
  amount: number;
  occasionType: string;
  occasionName: string;
  giftedBy: string;
  occasionDate: Date;
  recipients: Recipient[];
  sponsorName: string;
  sponsorEmail: string;
  sponsorPhone: string;
  panNumber: string;
  primaryMessage: string;
  eventName: string;
  eventType?: string | null;
  plantedBy: string;
  logoMessage: string;
  logoUrl?: string | null;
  presentationId?: string | null;
  slideId?: string | null;
}

const steps = ['Plantation Info', 'Recipient Details', 'Tree Card Messages', 'Sponsor Details'];

export const TreeSponsorshipForm = ({ open, onClose, group_id }: TreeSponsorshipFormProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    treeCount: 10,
    amount: 20000,
    occasionType: '',
    occasionName: '',
    giftedBy: '',
    occasionDate: new Date(),
    recipients: [{ name: '', email: '', message: '', treeCount: 1 }],
    sponsorName: '',
    sponsorEmail: '',
    sponsorPhone: '',
    panNumber: '',
    primaryMessage: '',
    eventName: '',
    plantedBy: '',
    logoMessage: '',
  });

  const totalAllocatedTrees = formData.recipients.reduce((sum, r) => sum + (r.treeCount || 0), 0);
  const remainingTrees = formData.treeCount - totalAllocatedTrees;

  const getRemainingTreesForRecipient = (index: number) => {
    const currentRecipientCount = formData.recipients[index]?.treeCount || 0;
    return remainingTrees + currentRecipientCount;
  };

  const handleNext = () => {
    switch (activeStep) {
      case 0:
        if (formData.treeCount <= 0) {
          alert('Please select at least one tree');
          return;
        }
        break;
      case 1:
        if (formData.recipients.some((r) => !r.name)) {
          alert('Please fill all recipient names');
          return;
        }
        if (totalAllocatedTrees !== formData.treeCount) {
          alert(`Please allocate all ${formData.treeCount} trees to recipients`);
          return;
        }
        break;
      case 2:
        if (!formData.primaryMessage) {
          alert('Please provide a primary message for the cards');
          return;
        }
        break;
      case 3:
        if (!formData.sponsorName || !formData.sponsorEmail || !formData.sponsorPhone) {
          alert('Please fill all sponsor details');
          return;
        }
        break;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleStepChange = (step: number) => {
    if (step > activeStep) {
      switch (activeStep) {
        case 0:
          if (formData.treeCount <= 0) {
            alert('Please complete the current step first');
            return;
          }
          break;
        case 1:
          if (totalAllocatedTrees !== formData.treeCount || formData.recipients.some(r => !r.name)) {
            alert('Please complete the current step first');
            return;
          }
          break;
        case 2:
          if (!formData.primaryMessage) {
            alert('Please complete the current step first');
            return;
          }
          break;
      }
    }
    setActiveStep(step);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Prepare users array from recipients
      const users = formData.recipients.map(recipient => ({
        name: recipient.name,
        email: recipient.email,
        tree_count: recipient.treeCount,
        message: recipient.message
      }));
  
      // Call the API client function
      const apiClient = new ApiClient();
      const response = await apiClient.createGiftCardRequestV2(
        group_id, // From props
        formData.sponsorName,
        formData.sponsorEmail,
        formData.treeCount, // no_of_cards is the total treeCount
        formData.eventType || formData.occasionType || '',
        formData.eventName || formData.occasionName || '',
        1, // created_by (you might want to get this from auth context)
        formData.giftedBy,
        formData.logoMessage,
        formData.primaryMessage,
        users,
        ['corporate'], // tags (optional)
        undefined  // payment_id (optional, might be handled separately)
      );
  
      // Handle successful submission
      console.log('Gift card request created:', response);
      onClose();
      setActiveStep(0);
  
      // Optionally show success message or redirect
      alert('Gift card request created successfully!');
    } catch (error) {
      console.error('Error creating gift card request:', error);
  
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to create gift card request');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const updateFormData = (partial: Partial<FormData>) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        ...partial,
        amount: partial.treeCount ? partial.treeCount * 2000 : prev.amount,
      };

      if (partial.giftedBy && !prev.plantedBy) {
        newData.plantedBy = partial.giftedBy;
      }

      if (partial.treeCount !== undefined && partial.treeCount < prev.treeCount) {
        const totalAllocated = newData.recipients.reduce((sum, r) => sum + r.treeCount, 0);
        if (totalAllocated > partial.treeCount) {
          const ratio = partial.treeCount / totalAllocated;
          newData.recipients = newData.recipients.map(r => ({
            ...r,
            treeCount: Math.max(1, Math.floor(r.treeCount * ratio))
          }));
        }
      }

      return newData;
    });
  };

  const updateRecipient = (index: number, updates: Partial<Recipient>) => {
    setFormData((prev) => {
      const updatedRecipients = [...prev.recipients];
      updatedRecipients[index] = { ...updatedRecipients[index], ...updates };

      if (updates.treeCount !== undefined) {
        updatedRecipients[index].treeCount = Math.max(1, updates.treeCount);
      }

      return { ...prev, recipients: updatedRecipients };
    });
  };

  const addNewRecipient = () => {
    if (remainingTrees > 0) {
      setFormData((prev) => ({
        ...prev,
        recipients: [
          ...prev.recipients,
          {
            name: '',
            email: '',
            message: '',
            treeCount: Math.min(1, remainingTrees)
          },
        ],
      }));
    }
  };

  const removeRecipient = (index: number) => {
    if (formData.recipients.length > 1) {
      setFormData((prev) => ({
        ...prev,
        recipients: prev.recipients.filter((_, i) => i !== index),
      }));
    }
  };

  const handleCardMessagesChange = (messages: {
    primaryMessage: string;
    eventName: string;
    eventType?: string | null;
    plantedBy: string;
    logoMessage: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      ...messages
    }));
  };

  const handlePresentationIds = (presentationId: string | null, slideId: string | null) => {
    setFormData(prev => ({
      ...prev,
      presentationId,
      slideId
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          style: {
            width: '120%',
            maxWidth: '1200px',
            height: '90vh',
            maxHeight: '800px'
          }
        }}
      >
        <DialogTitle>14 Trees Foundation - Tree Sponsorship</DialogTitle>

        <DialogContent dividers style={{ overflowY: 'auto' }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label} onClick={() => handleStepChange(index)} sx={{ cursor: 'pointer' }}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: '400px' }}>
            {activeStep === 0 && (
              <PlantationInfoTab
                treeCount={formData.treeCount}
                onTreeCountChange={(count) => updateFormData({ treeCount: count })}
                occasionType={formData.occasionType}
                onOccasionTypeChange={(type) => updateFormData({ occasionType: type })}
                occasionName={formData.occasionName}
                onOccasionNameChange={(name) => updateFormData({ occasionName: name })}
                giftedBy={formData.giftedBy}
                onGiftedByChange={(name) => updateFormData({ giftedBy: name })}
                occasionDate={formData.occasionDate}
                onOccasionDateChange={(date) => updateFormData({ occasionDate: date })}
              />
            )}

            {activeStep === 1 && (
              <>
                {formData.recipients.map((recipient, index) => (
                  <RecipientDetailsTab
                    key={index}
                    index={index}
                    recipientName={recipient.name}
                    onRecipientNameChange={(name) => updateRecipient(index, { name })}
                    recipientEmail={recipient.email}
                    onRecipientEmailChange={(email) => updateRecipient(index, { email })}
                    recipientTreeCount={recipient.treeCount}
                    onRecipientTreeCountChange={(count) => updateRecipient(index, { treeCount: count })}
                    maxTreeCount={formData.treeCount}
                    remainingTrees={getRemainingTreesForRecipient(index)}
                    onAddAnother={addNewRecipient}
                    onRemoveRecipient={removeRecipient}
                    showAddButton={
                      index === formData.recipients.length - 1 &&
                      remainingTrees > 0
                    }
                    isFirstRecipient={index === 0}
                    allRecipientsCount={formData.recipients.length}
                    totalAllocatedTrees={totalAllocatedTrees}
                  />
                ))}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body1">
                    Total trees: {formData.treeCount} | Allocated: {totalAllocatedTrees} | Remaining: {remainingTrees}
                  </Typography>
                </Box>
              </>
            )}

            {activeStep === 2 && (
              <CardDetails
                request_id=""
                presentationId={formData.presentationId || null}
                slideId={formData.slideId || null}
                logo_url={formData.logoUrl || null}
                messages={{
                  primaryMessage: formData.primaryMessage,
                  eventName: formData.eventName || formData.occasionName,
                  eventType: formData.eventType || formData.occasionType || undefined,
                  plantedBy: formData.plantedBy || formData.giftedBy || formData.sponsorName,
                  logoMessage: formData.logoMessage
                }}
                onChange={handleCardMessagesChange}
                onPresentationId={handlePresentationIds}
                userName={formData.recipients[0]?.name}
              />
            )}

            {activeStep === 3 && (
              <SponsorDetailsTab
                sponsorName={formData.sponsorName}
                onSponsorNameChange={(name) => updateFormData({ sponsorName: name })}
                sponsorEmail={formData.sponsorEmail}
                onSponsorEmailChange={(email) => updateFormData({ sponsorEmail: email })}
                sponsorPhone={formData.sponsorPhone}
                onSponsorPhoneChange={(phone) => updateFormData({ sponsorPhone: phone })}
                panNumber={formData.panNumber}
                onPanNumberChange={(pan) => updateFormData({ panNumber: pan })}
                logo={formData.logoUrl || null}
                onLogoChange={(file: File | null) => {
                  setLogoFile(file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      updateFormData({ logoUrl: e.target?.result as string || null });
                    };
                    reader.readAsDataURL(file);
                  } else {
                    updateFormData({ logoUrl: null });
                  }
                }}
              />
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button variant="contained" color="success" onClick={handleBack} disabled={activeStep === 0}>
            Back
          </Button>
          <Box>
            <Button variant="outlined" color="error" onClick={onClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : activeStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};
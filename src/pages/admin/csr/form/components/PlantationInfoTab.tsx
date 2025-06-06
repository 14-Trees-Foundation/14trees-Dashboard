import { Box, Button, Grid, TextField, Typography, Autocomplete } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useState, useEffect } from "react";

const EventTypes = [
    {
        value: '1',
        label: 'Birthday'
    },
    {
        value: '2',
        label: 'Memorial'
    },
    {
        value: '4',
        label: 'Wedding'
    },
    {
        value: '5',
        label: 'Anniversary'
    },
    {
        value: '6',
        label: 'Festival Celebration'
    },
    {
        value: '7',
        label: 'Retirement'
    },
    {
        value: '3',
        label: 'General gift'
    },
]

interface PlantationInfoTabProps {
  treeCount: number;
  onTreeCountChange: (count: number) => void;
  occasionType: string;
  onOccasionTypeChange: (type: string) => void;
  occasionName: string;
  onOccasionNameChange: (name: string) => void;
  occasionDate: Date;
  onOccasionDateChange: (date: Date) => void;
  giftedBy: string;
  onGiftedByChange: (name: string) => void;
  isAboveLimit?: boolean;
  rpPaymentSuccess?: boolean;
}

const treePresets = [2, 5, 10, 14, 50, 100];

export const PlantationInfoTab = ({
  treeCount = 10, // Default to 10 trees
  onTreeCountChange,
  occasionType,
  onOccasionTypeChange,
  occasionName,
  onOccasionNameChange,
  occasionDate,
  onOccasionDateChange,
  giftedBy,
  onGiftedByChange,
  isAboveLimit = false,
  rpPaymentSuccess = false,
}: PlantationInfoTabProps) => {
  const [selectedEventType, setSelectedEventType] = useState<{ value: string, label: string } | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(!treePresets.includes(treeCount));

  useEffect(() => {
    const eventType = EventTypes.find(item => item.value === occasionType);
    setSelectedEventType(eventType ? eventType : null);
  }, [occasionType]);

  const handlePresetSelect = (count: number) => {
    onTreeCountChange(count);
    setShowCustomInput(false);
  };

  const handleCustomTreeCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and empty string
    if (value === "" || /^\d+$/.test(value)) {
      const numValue = value ? parseInt(value) : 0;
      onTreeCountChange(numValue);
    }
  };

  const handleOtherClick = () => {
    setShowCustomInput(true);
    // Focus the input field when "Other" is clicked
    setTimeout(() => {
      const input = document.querySelector('input[name="treeCount"]') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 0);
  };

  const handleEventTypeSelection = (e: any, item: { value: string, label: string } | null) => {
    onOccasionTypeChange(item ? item.value : "");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        How many trees would you like to sponsor?*
      </Typography>
      
      {/* Updated Tree Count Section */}
      <Box sx={{ 
        border: 1, 
        borderColor: 'divider', 
        borderRadius: 1, 
        p: 3, 
        mb: 3,
        backgroundColor: 'background.paper'
      }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <TextField
              name="treeCount"
              type="number"
              size="small"
              value={treeCount}
              onChange={handleCustomTreeCount}
              disabled={rpPaymentSuccess}
              inputProps={{
                min: 1,
                step: 1,
              }}
              sx={{
                width: 100,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: treeCount < 1 ? 'error.main' : 'divider',
                  },
                },
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={1} sx={{ mt: 2 }}>
          {treePresets.map((count) => (
            <Grid item key={count}>
              <Button
                variant={treeCount === count ? "contained" : "outlined"}
                color={treeCount === count ? "primary" : "inherit"}
                onClick={() => handlePresetSelect(count)}
                sx={{
                  textTransform: 'none',
                  fontWeight: treeCount === count ? 'bold' : 'normal',
                  minWidth: '80px'
                }}
              >
                {count} Trees
              </Button>
            </Grid>
          ))}
          <Grid item>
            <Button
              variant={showCustomInput ? "contained" : "outlined"}
              color={showCustomInput ? "primary" : "inherit"}
              onClick={handleOtherClick}
              sx={{
                textTransform: 'none',
                fontWeight: showCustomInput ? 'bold' : 'normal',
                minWidth: '80px'
              }}
            >
              Other
            </Button>
          </Grid>
        </Grid>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Total Amount: ₹{(treeCount * 2000).toLocaleString()}
          {isAboveLimit && (
            <Typography component="span" color="error" sx={{ ml: 1 }}>
              (Above Razorpay limit - Bank Transfer recommended)
            </Typography>
          )}
        </Typography>
      </Box>

      <Typography variant="h6" gutterBottom>
        Occasion Details
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            size="small"
            value={selectedEventType}
            options={EventTypes}
            getOptionLabel={option => option.label}
            onChange={handleEventTypeSelection}
            renderInput={(params) => (
              <TextField
                {...params}
                name="eventType"
                label='Event Type'
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Occasion Name"
            value={occasionName}
            onChange={(e) => onOccasionNameChange(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <DatePicker
            label="Date of Occasion"
            value={occasionDate}
            onChange={(newValue) => newValue && onOccasionDateChange(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Gifted By"
            value={giftedBy}
            onChange={(e) => onGiftedByChange(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
  );
};
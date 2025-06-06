import { Box, TextField, Typography } from "@mui/material";
import { useState } from "react";

interface SponsorDetailsTabProps {
  sponsorName: string;
  onSponsorNameChange: (name: string) => void;
  sponsorEmail: string;
  onSponsorEmailChange: (email: string) => void;
  sponsorPhone: string;
  onSponsorPhoneChange: (phone: string) => void;
  panNumber: string;
  onPanNumberChange: (pan: string) => void;
  logo: string | null;
  onLogoChange: (file: File | null) => void;
}

const validationPatterns = {
  name: /^[A-Za-z0-9\s.,&_'-]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[0-9\s\-()]{7,20}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
};

export const SponsorDetailsTab = ({
  sponsorName,
  onSponsorNameChange,
  sponsorEmail,
  onSponsorEmailChange,
  sponsorPhone,
  onSponsorPhoneChange,
  panNumber,
  onPanNumberChange,
}: SponsorDetailsTabProps) => {
  const [errors, setErrors] = useState({
    sponsorName: "",
    sponsorEmail: "",
    sponsorPhone: "",
    panNumber: "",
  });

  const validateField = (name: string, value: string) => {
    let error = "";

    if (!value.trim()) {
      if (name === "sponsorPhone") return "";
      if (name === "panNumber") return "";

      return "This field is required";
    }

    switch (name) {
      case "sponsorName":
        if (!validationPatterns.name.test(value)) {
          error = "Please enter a valid name (letters and spaces only)";
        }
        break;
      case "sponsorEmail":
        if (!validationPatterns.email.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "sponsorPhone":
        if (!validationPatterns.phone.test(value)) {
          error = "Please enter a valid phone number (7-20 digits)";
        }
        break;
      case "panNumber":
        if (value && !validationPatterns.pan.test(value)) {
          error = "Please enter a valid PAN number (e.g., ABCDE1234F)";
        }
        break;
    }

    return error;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers, +, -, (, ), and spaces
    if (/^[0-9+\-()]*$/.test(value)) {
      onSponsorPhoneChange(value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Sponsored by:
      </Typography>

      <TextField
        label="Type your name"
        name="sponsorName"
        value={sponsorName}
        onChange={(e) => onSponsorNameChange(e.target.value)}
        onBlur={handleBlur}
        fullWidth
        sx={{ mb: 2 }}
        error={!!errors.sponsorName}
        helperText={errors.sponsorName}
      />

      <TextField
        label="Email ID*"
        name="sponsorEmail"
        value={sponsorEmail}
        onChange={(e) => onSponsorEmailChange(e.target.value)}
        onBlur={handleBlur}
        fullWidth
        type="email"
        sx={{ mb: 2 }}
        required
        error={!!errors.sponsorEmail}
        helperText={errors.sponsorEmail}
      />

      <TextField
        label="Mobile number*"
        name="sponsorPhone"
        value={sponsorPhone}
        onChange={handlePhoneChange}
        onBlur={handleBlur}
        fullWidth
        sx={{ mb: 2 }}
        helperText={errors.sponsorPhone}
        required
        error={!!errors.sponsorPhone}
        inputProps={{
          inputMode: 'tel',
          pattern: '[0-9+\\-()\\s]*'  // This helps mobile devices show numeric keyboard
        }}
      />

      <TextField
        label="PAN number*"
        name="panNumber"
        value={panNumber}
        onChange={(e) => onPanNumberChange(e.target.value)}
        onBlur={handleBlur}
        fullWidth
        sx={{ mb: 2 }}
        required
        error={!!errors.panNumber}
        helperText={errors.panNumber}
      />

      <Typography variant="caption">
        At present we can accept donations only from Indian residents. PAN number is required to know the donor's identity.
      </Typography>
    </Box>
  );
};

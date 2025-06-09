import { Box, TextField, Typography, Button, Alert } from "@mui/material";
import { useState } from "react";

interface RecipientDetailsTabProps {
  index: number;
  recipientName: string;
  onRecipientNameChange: (name: string) => void;
  recipientEmail: string;
  onRecipientEmailChange: (email: string) => void;
  recipientTreeCount: number;
  onRecipientTreeCountChange: (count: number) => void;
  maxTreeCount: number;
  remainingTrees: number;
  onAddAnother: () => void;
  onRemoveRecipient?: (index: number) => void;
  showAddButton: boolean;
  isFirstRecipient: boolean;
  allRecipientsCount: number;
  totalAllocatedTrees: number;
}

export const RecipientDetailsTab = ({
  index,
  recipientName,
  onRecipientNameChange,
  recipientEmail,
  onRecipientEmailChange,
  recipientTreeCount,
  onRecipientTreeCountChange,
  maxTreeCount,
  remainingTrees,
  onAddAnother,
  onRemoveRecipient,
  showAddButton,
  isFirstRecipient,
  allRecipientsCount,
  totalAllocatedTrees,
}: RecipientDetailsTabProps) => {
  const [treeCountError, setTreeCountError] = useState("");

  const handleTreeCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;

    if (value < 1) {
      setTreeCountError("Minimum 1 tree required");
      onRecipientTreeCountChange(1);
      return;
    }

    // Calculate if this would be an increase
    const isIncreasing = value > recipientTreeCount;

    if (isIncreasing && totalAllocatedTrees >= maxTreeCount) {
      setTreeCountError("All trees have been allocated");
      return;
    }

    if (value > maxTreeCount) {
      setTreeCountError(`Cannot exceed total sponsored trees (${maxTreeCount})`);
      return;
    }

    if (isIncreasing && value > recipientTreeCount + remainingTrees) {
      setTreeCountError(`Only ${remainingTrees} trees remaining to allocate`);
      return;
    }

    setTreeCountError("");
    onRecipientTreeCountChange(value);
  };

  const disableAddAnother =
    remainingTrees === 0 || !recipientName.trim() || recipientTreeCount <= 0;

  // Determine if increasing should be disabled for this recipient
  const disableIncrease = totalAllocatedTrees >= maxTreeCount;

  return (
    <Box
      sx={{
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        mb: 2,
        position: "relative",
        backgroundColor: "#fff",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">
          Who would you like to honour with this living tribute?
          {allRecipientsCount > 1 && ` (Recipient ${index + 1})`}
        </Typography>

        {!isFirstRecipient && onRemoveRecipient && (
          <Button
            onClick={() => onRemoveRecipient(index)}
            color="error"
            sx={{
              color: "error.main",
              "&:hover": {
                backgroundColor: "rgba(244, 67, 54, 0.08)",
              },
            }}
          >
            REMOVE
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Number of trees for this recipient *"
          type="number"
          value={recipientTreeCount}
          onChange={handleTreeCountChange}
          fullWidth
          sx={{ mb: 1 }}
          inputProps={{
            min: 1,
            max: disableIncrease ? recipientTreeCount : maxTreeCount,
          }}
          error={!!treeCountError}
          helperText={treeCountError}
          required
        />

        <Typography variant="body2" sx={{ mb: 3, color: "#666" }}>
          Trees allocated to this recipient: {recipientTreeCount}
        </Typography>

        <TextField
          label="Recipient name *"
          value={recipientName}
          onChange={(e) => onRecipientNameChange(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          required
        />

        <TextField
          label="Recipient email"
          value={recipientEmail}
          onChange={(e) => onRecipientEmailChange(e.target.value)}
          fullWidth
          type="email"
          sx={{ mb: 2 }}
        />
      </Box>

      {showAddButton && (
        <Button
          variant="outlined"
          onClick={onAddAnother}
          disabled={disableAddAnother}
          sx={{
            mt: 2,
            color: "#2e7d32",
            borderColor: "#2e7d32",
            "&:hover": {
              borderColor: "#1b5e20",
              backgroundColor: "rgba(46, 125, 50, 0.04)",
            },
            "&:disabled": {
              borderColor: "rgba(0, 0, 0, 0.12)",
              color: "rgba(0, 0, 0, 0.26)",
            },
          }}
        >
          ADD ANOTHER RECIPIENT
        </Button>
      )}

      {recipientTreeCount > maxTreeCount && (
        <Alert severity="error" sx={{ mt: 2 }}>
          You cannot gift more trees than originally requested!
        </Alert>
      )}
    </Box>
  );
};
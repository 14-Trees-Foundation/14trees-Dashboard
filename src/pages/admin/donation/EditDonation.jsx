import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, Typography } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// This component is no longer needed since editing is handled directly in the Donation component
// It now redirects to the main donations page
const EditDonation = ({ row, openeditModal, closeEditModal }) => {
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  
  useEffect(() => {
    if (openeditModal) {
      setRedirecting(true);
      // Show a message to the user
      toast.info("Redirecting to the donation management page...");
      
      // Redirect after a short delay
      const timer = setTimeout(() => {
        navigate("/admin/donations");
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [openeditModal, navigate]);

  return (
    <div style={{ 
      display: redirecting ? "flex" : "none",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem"
    }}>
      <CircularProgress color="success" style={{ marginBottom: "1rem" }} />
      <Typography variant="h6">
        Redirecting to the donation management page...
      </Typography>
      <Button 
        variant="contained" 
        color="primary"
        style={{ marginTop: "1rem" }}
        onClick={() => {
          navigate("/admin/donations");
        }}
      >
        Go to Donations Page Now
      </Button>
    </div>
  );
};

export default EditDonation;

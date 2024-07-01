import React, { useState } from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Modal,
    TextField,
    Typography,
    Autocomplete,
} from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import { Dashboard } from '@mui/icons-material';


const EditDonation = ({row, openeditModal, closeEditModal, editSubmit })=>{

  const [ name  ,  setName ] = useState(row.Name);
  const [ email  ,  setEmail ] = useState(row.Email_Address);
  const [ donor_type  ,  setDonor_type ] = useState(row.donor_type);

  const [ Grove  ,  setGrove ] = useState(row.Grove);

  const [ Land_Type  ,  setLand_Type ] = useState(row.Land_Type);
  const [ Zone  ,  setZone ] = useState(row.Zone);
  const [ phone  ,  setPhone ] = useState(row.phone);
  const [  pledged  ,  setPledged ] = useState(row.Pledged);
  const [  PAN   ,  setPAN ] = useState(row.PAN);
  const [ dashboard_status ,  setStatus ] = useState(row.DashboardStatus);
  const [ assignedPlot ,  setAssignedPlot ] = useState(row.assignedPlot);
  const [ remarks ,  setRemarks] = useState(row.remarks);

  const handleSubmit = (e) =>{
         e.preventDefault()

         const updatedData = {
          id: row.id,
          Name: name,
          'Email Address': email,
          "Donor Type": donor_type,
          Grove: Grove,
          'Land Type': Land_Type,
          Zone: Zone,
          Phone: phone,
          Pledged: pledged,
          PAN: PAN,
          DashboardStatus: dashboard_status,
          Assigned_Plot: assignedPlot,
          "Remarks for inventory": remarks,
          
         }

         console.log(updatedData);
         editSubmit(updatedData);
         closeEditModal();
       
  }



  return(
   
    <Dialog open={openeditModal} fullWidth maxWidth="md">
      <DialogTitle align="center">Add Donation</DialogTitle>
      <form  onSubmit={handleSubmit} style={{padding: '40px'}} >
      <DialogContent>
                    
                    <DialogContent>
                    <DialogTitle >Donor Details</DialogTitle>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e)=>{ setName(e.target.value)}}
                       
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="text"
                        fullWidth
                        value={email}
                        onChange={(e)=>{ setEmail(e.target.value)}}
                    />

                <TextField
                        autoFocus
                        margin="dense"
                        name="Donor_Type"
                        label="Donor Type"
                        type="text"
                        fullWidth
                        value={donor_type}
                        onChange={(e)=>{ setDonor_type(e.target.value)}}
                       
                    />

                <TextField
                        autoFocus
                        margin="dense"
                        name="Pledged"
                        label="Pledged"
                        type="text"
                        fullWidth
                        value={pledged}
                        onChange={(e)=>{ setPledged(e.target.value)}}
                       
                    />

                  <TextField
                        autoFocus
                        margin="dense"
                        name="Phone"
                        label="Phone"
                        type="text"
                        fullWidth
                        value={phone}
                        onChange={(e)=>{ setPhone(e.target.value)}}
                       
                    />
                     
              </DialogContent>
              <DialogContent>
                  <DialogTitle >Land Details</DialogTitle>
                  <TextField
                        autoFocus
                        margin="dense"
                        name="Land_Type"
                        label="Land_Type"
                        type="text"
                        fullWidth
                        value={Land_Type}
                        onChange={(e)=>{ setLand_Type(e.target.value)}}
                       
                    />

                  <TextField
                        autoFocus
                        margin="dense"
                        name="Assigned Plot"
                        label="Assigned Plot"
                        type="text"
                        fullWidth
                        value={assignedPlot}
                        onChange={(e)=>{ setAssignedPlot(e.target.value)}}
                       
                    />

                  <TextField
                        autoFocus
                        margin="dense"
                        name="Grove"
                        label="Grove"
                        type="text"
                        fullWidth
                        value={Grove}
                        onChange={(e)=>{ setGrove(e.target.value)}}
                       
                    />

                <TextField
                        autoFocus
                        margin="dense"
                        name="Zone"
                        label="Zone"
                        type="text"
                        fullWidth
                        value={Zone}
                        onChange={(e)=>{ setZone(e.target.value)}}
                       
                    />
              </DialogContent>
              <DialogContent>
                  <DialogTitle >Payment Details</DialogTitle>

                  <TextField
                            margin="dense"
                            name="PAN"
                            label="PAN Number"
                            type="text"
                            fullWidth
                            value={PAN}
                            onChange={(e)=>{setPAN(e.target.value)}}
    
                        />  
                    
                    </DialogContent>  

                    <DialogContent>
                        <DialogTitle>Other Details</DialogTitle>
                    <TextField
                            margin="dense"
                            name="Dashboard_Status"
                            label="Dashboard_Status"
                            type="text"
                            fullWidth
                            value={dashboard_status}
                            onChange={(e)=>{setStatus(e.target.value)}}
    
                        />  

                    <TextField
                            margin="dense"
                            name="Remarks"
                            label="Remarks"
                            type="text"
                            fullWidth
                            value={remarks}
                            onChange={(e)=>{setRemarks(e.target.value)}}
    
                        /> 
                   
                   
                  
                  </DialogContent>
                 

        </DialogContent>  
        <DialogActions sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                    <Button variant='contained' onClick={() => closeEditModal()} color="primary">
                        Cancel
                    </Button>
                    <Button variant='contained' type="submit" color="primary" >
                        Save
                    </Button>
                </DialogActions>

      </form>

    </Dialog>



  )

};

export default EditDonation;
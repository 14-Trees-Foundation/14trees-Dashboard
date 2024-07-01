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


const AddDonation = ({open , handleClose , createDonation})=>{

  const [ name  ,  setName ] = useState('');
  const [ email  ,  setEmail ] = useState('');
  const [ No_of_Trees_Acres  ,  setNo_of_Trees_Acres ] = useState('');

  const [ Grove  ,  setGrove ] = useState('');

  const [ Site_Type  ,  setSite_Type ] = useState('');
  const [ QRCode  ,  setQRCode ] = useState('');
  const [ Total_Payment_based_on_selection  ,  setTotal_Payment ] = useState('');
  const [  Contribution_dropdown_Screenshot  ,  setContribution ] = useState('');
  const [  PAN   ,  setPAN ] = useState('');
  const [ FCRA_matters ,  setFCRA ] = useState('');
  const [ List_of_people_names ,  setListOfNames ] = useState('');
  const [ Summary ,  setSummary] = useState('');
  const [ Comments ,  setComments] = useState('');

  const handleSubmit = (e) =>{
         e.preventDefault()

         const newDonation = {
          Name: name,
          Email_Address: email,
          No_of_Trees_Acres: No_of_Trees_Acres,
          Grove: Grove,
          Site_Type: Site_Type,
          QRCode: QRCode,
          Total_Payment_based_on_selection: Total_Payment_based_on_selection,
          Contribution_dropdown_Screenshot: Contribution_dropdown_Screenshot,
          PAN: PAN,
          FCRA_matters: FCRA_matters,
          List_of_people_names: List_of_people_names,
          Summary: Summary,
          Comments: Comments
          
         }

                createDonation(newDonation);
               console.log('New Donation Data : ', newDonation);
               handleClose();
       
  }



  return(
   
    <Dialog open={open} onClose={handleClose}  fullWidth maxWidth="md">
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
                     
              </DialogContent>
              <DialogContent>
                  <DialogTitle >Donation Details</DialogTitle>
                  <TextField
                        autoFocus
                        margin="dense"
                        name="No of Trees/Acres"
                        label="No of Trees/Acres"
                        type="text"
                        fullWidth
                        value={No_of_Trees_Acres}
                        onChange={(e)=>{ setNo_of_Trees_Acres(e.target.value)}}
                       
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
                        name="Site Type"
                        label="Site Type"
                        type="text"
                        fullWidth
                        value={Site_Type}
                        onChange={(e)=>{ setSite_Type(e.target.value)}}
                       
                    />
              </DialogContent>
              <DialogContent>
                  <DialogTitle >Payment Details</DialogTitle>
                    <TextField
                        select
                        margin="dense"
                        name="QRCode"
                        label="QRCode"
                        type="text"
                        fullWidth
                        value={QRCode}
                        onChange={(e)=>{setQRCode(e.target.value)}}
                    >
                        
                    </TextField>

                    <TextField
                        select
                        margin="dense"
                        name="Total Payment based on selection"
                        label="Total_Payment_based_on_selection"
                        type="text"
                        fullWidth
                        value={Total_Payment_based_on_selection}
                        onChange={(e)=>{setTotal_Payment(e.target.value)}}
                    >
                        
                    </TextField>
                    <TextField
                        select
                        margin="dense"
                        name="Contribution dropdown Screenshot"
                        label="Contribution_dropdown_Screenshot"
                        type="text"
                        fullWidth
                        value={Contribution_dropdown_Screenshot}
                        onChange={(e)=>{setContribution(e.target.value)}}
                    >
                        
                    </TextField>
                    </DialogContent>  

                    <DialogContent>
                        <DialogTitle>Tax Benefit Details</DialogTitle>
                       
                        <TextField
                            margin="dense"
                            name="PAN"
                            label="PAN Number"
                            type="text"
                            fullWidth
                            value={PAN}
                            onChange={(e)=>{setPAN(e.target.value)}}
    
                        />  

                    <TextField
                            margin="dense"
                            name="FCRA_matters"
                            label="80g / 501 (c)/ FCRA section"
                            type="text"
                            fullWidth
                            value={FCRA_matters}
                            onChange={(e)=>{setFCRA(e.target.value)}}
    
                        />  
                   
                   
                  
                  </DialogContent>
                  <DialogContent>
                        <DialogTitle>Name Assignment Details</DialogTitle>
                    <TextField
                        margin="dense"
                        name="List_of_people_names"
                        label="List of people names"
                        type="text"
                        fullWidth
                        value={List_of_people_names}
                        onChange={(e)=>{setListOfNames(e.target.value)}}
                    />
                  
                    </DialogContent>

                    <DialogContent>
                        <DialogTitle>Summary</DialogTitle>
                    <TextField
                        margin="dense"
                        name="Summary"
                        label="Summary"
                        type="text"
                        fullWidth
                        value={Summary}
                        onChange={(e)=>{setSummary(e.target.value)}}
                    />
                  
                    </DialogContent>

                    <DialogContent>
                        <DialogTitle>Thank You</DialogTitle>
                    <TextField
                        margin="dense"
                        name="Comments"
                        label="Comments/feedbacks"
                        type="text"
                        fullWidth
                        value={Comments}
                        onChange={(e)=>{setComments(e.target.value)}}
                    />
                  
                    </DialogContent>

        </DialogContent>  
        <DialogActions sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                    <Button variant='contained' onClick={handleClose} color="primary">
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

export default AddDonation;
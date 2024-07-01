import { Box, Button, TextField, Typography  ,  Autocomplete,} from "@mui/material";

export const NameOwner = ({ values, handleNameAndEmail, setValues }) => {

  const ownerOptions = [
    { value: 'GramPanchayat (ग्राम पंचायत)', label: 'Gram Panchayat (ग्राम पंचायत)' },
    { value: 'Govt. Dept. (सरकारी विभाग)', label: 'Govt. Dept. (सरकारी विभाग)' },
    { value: 'Forest Dept. (वन विभाग)', label: 'Forest Dept. (वन विभाग)' },
    { value: '14 Trees Branch', label: '14 Trees Branch' },
    { value: 'NGO (संस्था)', label: 'NGO (संस्था)' },
    { value: 'Farmer (शेतकरी)', label: 'Farmer (शेतकरी)' },
   
  ];




  return (
    <Box sx={{ minHeight: "350px", position: "relative" }}>
      <Typography
        sx={{ fontSize: { xs: "20px", md: "28px" }, letterSpacing: "0.1px" }}
      >
        Please enter English , Marathi and Owner name 
      </Typography>
      <Box sx={{ mt: 2 }}>
        <TextField
          variant="outlined"
          name="name_marathi"
          label="Name (Marathi)"          
          required
          onChange={(e) => setValues({ ...values, name_marathi: e.target.value })}
        />

        <TextField
          variant="outlined"
          name="name_english"
         label="Name (English)"          
         required
          onChange={(e) => setValues({ ...values, name_english: e.target.value })}
        />
{/*       
       <TextField
          variant="outlined"
          label="owner"
          name="Owner"
          required
          onChange={(e) => setValues({ ...values, owner: e.target.value })}
        /> */}

                <Autocomplete
                        options={ownerOptions}
                        getOptionLabel={(option)=>option.label}
                        
                        onChange={(e) => setValues({ ...values, owner: e.target.value })}
                        renderInput={(params)=>( 
                        <TextField
                           {...params}
                            
                            margin="dense"
                            name="owner"
                            label="Owner Name"
                            type="text"
                            fullWidth
                            
                        />)} 
                   />

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            position: "absolute",
            bottom: 0,
            width: "100%",
          }}
        >
          <Button
            color="inherit"
            disabled={values.activeStep === 0}
            onClick={() =>
              setValues({ ...values, activeStep: values.activeStep - 1 })
            }
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button
            size="large"
            variant="contained"
            color="primary"
            // disabled={values.name === "" || values.email === ""}
            onClick={() => handleNameAndEmail()}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

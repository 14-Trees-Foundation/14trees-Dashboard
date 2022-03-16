import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

export const MoreInfo = ({ values, setValues, handleOrgChange }) => {
  const treeNum = values.treeinfo.length;
  if(treeNum > 1) {
    values.treeinfo = values.treeinfo.sort((a,b) => new Date(b.tree.date_added) - new Date(a.tree.date_added));
  }

  const buttons = () => {
    return (
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
          type="submit"
          size="large"
          variant="contained"
          color="primary"
          onClick={() =>
            setValues({ ...values, activeStep: values.activeStep + 1 })
          }
        >
          Next
        </Button>
      </Box>
    );
  };
  if (values.userFound) {
    return (
      <Box sx={{ position: "relative", minHeight: "400px" }}>
        <Box>
          <Typography
            sx={{ fontSize: "24px", color: "#1f3625", letterSpacing: "0.1px" }}
          >
            Looks like you have already planted a tree
          </Typography>
          <div style={{display:'flex', overflowX: 'auto', paddingLeft:'8px'}}>
            {values.treeinfo.map((item) => {
              return(
              <Card
              key={item.tree.sapling_id}
                sx={{
                  m: 2,
                  ml: 0,
                  minWidth: '250px',
                  maxWidth: "300px",
                  boxShadow: "#e5e5e5 0px 0px 4px 4px;",
                  backgroundColor: 'rgb(60, 121, 188)',
                  color:'#fff'
                }}
              >
                <CardContent>
                  <Typography>
                    Tree Name :{" "}
                    <em>
                      <b>{item.tree.tree_id.name}</b>
                    </em>
                  </Typography>
                  <Typography>
                    Tree ID :{" "}
                    <em>
                      <b>{item.tree.sapling_id}</b>
                    </em>
                  </Typography>
                  <Typography>
                    Date :{" "}
                    <em>
                      <b>{item.tree.date_added.slice(0, 10)}</b>
                    </em>
                  </Typography>
                </CardContent>
              </Card>)
            })}
          </div>

          <Typography sx={{ mt: 3 }}>
            Do you want to add an organization for today's plantation
          </Typography>
          <Autocomplete
            id="org"
            options={values.org}
            autoHighlight
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
              handleOrgChange(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Organization" variant="outlined" />
            )}
          />
        </Box>
        {buttons()}
      </Box>
    );
  } else {
    return (
      <Box sx={{ position: "relative", minHeight: "300px" }}>
        <Box>
          <Typography
            sx={{ fontSize: "24px", color: "#1f3625", letterSpacing: "0.1px" }}
          >
            Uh Oh! There is no tree in your name. Lets add one.
          </Typography>
        {buttons()}
        <Typography sx={{ mt: 3 }}>
            Do you want to add an organization for today's plantation
          </Typography>
          <Autocomplete
            id="org"
            options={values.org}
            autoHighlight
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
              handleOrgChange(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Organization" variant="outlined" />
            )}
          />
        </Box>
      </Box>
    );
  }
};

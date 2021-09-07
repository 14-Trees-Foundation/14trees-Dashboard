import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
          light: '#9BC53D',
          main: '#3f50b5',
          dark: '#1F3625',
          contrastText: '#fff',
          grey: "#d9d9d9",
        },
        secondary: {
          light: '#ff7961',
          main: '#f44336',
          dark: '#ba000d',
          contrastText: '#000',
        },
      },
    typography: {
        fontFamily: "Helvetica, Arial, Sans-Serif",
    },
    components: {
        MuiButton: {
            variants: [
                {
                  props: { color: "primary", variant: "contained" },
                  style: {
                    backgroundColor: '#9BC53D',
                    fontcolor: '#ffffff',
                    fontSize: 18,
                    minWidth: "100px",
                    textTransform: 'none',
                    borderRadius: "7px",
                    '&:hover':{
                        backgroundColor: '#1F3625',
                        color: '#ffffff',
                    },
                  }
                },
                {
                  props: { color: "secondary", variant: "contained" },
                  style: {
                    minWidth: '200px',
                    borderRadius: "7px",
                    backgroundColor: '#1F3625',
                    color: '#9BC53D',
                    border: '1px solid #dcdcdc',
                    boxShadow: 'rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset',
                    textTransform: 'none',
                    '&:hover':{
                        backgroundColor: '#9BC53D',
                        color: '#ffffff',
                    },
                  }
                }
              ]
        },
    },
});

export default theme;
import { Box } from "@mui/material";

export const CustomBox = ({ children }) => {
  return (
    <Box
      sx={{
        color: "#2D1B08",
        background: "linear-gradient(145deg, #9faca3, #bdccc2)",
        boxShadow: "8px 8px 16px #9eaaa1,-8px -8px 16px #c4d4c9",
        p: 2,
        borderRadius: 3,
      }}
    >
      {children}
    </Box>
  );
};

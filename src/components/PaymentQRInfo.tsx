import { Box, Typography } from "@mui/material"
import PaymentQR14trees from "../assets/PaymentQR14trees.png";

const PaymentQRInfo: React.FC = () => {

    return (
        <Box
            display="flex"
        >
            <div style={{ textAlign: "center" }}>
                <img
                    src={PaymentQR14trees} // Replace with your QR code image URL
                    alt="QR Code"
                    style={{
                        width: "auto",
                        height: "250px",
                        marginBottom: "20px",
                    }}
                />
            </div>
            <Box ml={2}>
                <Typography><strong>14 Trees Foundation</strong></Typography>
                <Typography>Current a/c number: <strong>007305012197</strong></Typography>
                <Typography>IFSC Code: <strong>ICIC0000073</strong></Typography>
                <Typography>ICICI Bank, Gulmohor park, ITI road, Aundh, Pune 411007</Typography>
                <Typography></Typography>
                <Typography>14 Trees Foundation is a (section 8) charitable organization dedicated to building sustainable, carbon-footprint-neutral eco-systems through re-forestation.</Typography>
                <Typography>CIN: U93090PN2020NPL191410</Typography>
                <Typography>Mail Id: contact@14trees.org</Typography>
                <Typography>Web: www.14trees.org</Typography>
            </Box>
        </Box>
    )
};

export default PaymentQRInfo;


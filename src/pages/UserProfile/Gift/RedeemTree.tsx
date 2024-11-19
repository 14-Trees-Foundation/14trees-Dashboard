import { Box, Button, Typography, useMediaQuery } from "@mui/material"
import { GiftCardUser } from "../../../types/gift_card";
import { createStyles, makeStyles } from "@mui/styles";
import { useState } from "react";
import { User } from "../../../types/user";
import SelectCreateUser from "../../../components/SelectCreateUser";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";

interface RedeemTreeProps {
    tree: GiftCardUser
}

const RedeemTree: React.FC<RedeemTreeProps> = ({ tree }) => {
    const matches = useMediaQuery("(max-width:481px)");
    const classes = useStyles();

    const [user, setUser] = useState<User | null>(null);

    const refreshPage = () => {
        window.location.reload();
    };


    const handleRedeemTree = async () => {
        if (!user) {
            toast.error("Please select a user or register your self in the system!");
            return;
        }

        if (!tree.sapling_id || !tree.tree_id) {
            toast.error("Gifted tree not found!");
            return;
        }

        try {
            const apiClient = new ApiClient();
            await apiClient.redeemGiftCardTemplate(tree.gift_card_request_id, tree.sapling_id, tree.tree_id, user);

            refreshPage();
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <Box
            className={matches ? classes.mbmain : classes.main}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: "20px",
            }}>
            <Box
                style={{
                    maxWidth: matches ? "92%" : '600px',
                }}
            >
                <Typography variant="h6">You have been gifted a Tree!</Typography>
                <Box display="flex" mt={1}>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Box display="flex" justifyContent="space-between">
                            <Typography>Sapling ID:</Typography>
                            <Typography ml={7}>{tree.sapling_id}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography>Plant Type:</Typography>
                            <Typography ml={7}>{tree.plant_type}</Typography>
                        </Box>
                    </Box>
                    <Box style={{ flexGrow: 1 }}></Box>
                </Box>
                <Box mt={5}>
                    <Typography>Please select existing user or register you self in order to redeem this tree!</Typography>
                    <SelectCreateUser
                        user={user}
                        onSelect={user => { setUser(user) }}
                    />
                </Box>
                <Box
                    mt={2}
                    display='flex'
                    alignItems="center"
                >
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleRedeemTree}
                    >Redeem</Button>
                </Box>
            </Box>
        </Box>
    )
};

const useStyles = makeStyles((theme) =>
    createStyles({
        mbmain: {
            height: "100%",
            marginTop: "50px",
        },
        main: {
            height: "100%",
        },
    })
);

export default RedeemTree;
import { Box, Button, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { FC } from "react";

interface PlotBookingOptionsProps {
    bookNonGiftable: boolean;
    bookAllHabits: boolean;
    diversify: boolean;
    onBookNonGiftableChange: (value: boolean) => void;
    onBookAllHabitsChange: (value: boolean) => void;
    onDiversifyChange: (value: boolean) => void;
    onManualSelection: () => void;
    showOptions: boolean;
}

const PlotBookingOptions: FC<PlotBookingOptionsProps> = ({
    bookNonGiftable,
    bookAllHabits,
    diversify,
    onBookNonGiftableChange,
    onBookAllHabitsChange,
    onDiversifyChange,
    onManualSelection,
    showOptions
}) => {
    return (
        <Box
            mt={3}
            display="flex"
            alignItems="center"
        >
            <Box>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Typography mr={10}>Do you want to manually select trees for each recipient?</Typography>
                    <Button
                        variant="outlined"
                        color="success"
                        onClick={onManualSelection}
                    >
                        Select Manually
                    </Button>
                </Box>
                
                {showOptions && (
                    <>
                        <Box
                            mt={2}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Typography mr={10}>Do you want to book non giftable trees?</Typography>
                            <ToggleButtonGroup
                                color="success"
                                value={bookNonGiftable ? "yes" : "no"}
                                exclusive
                                onChange={(e, value) => onBookNonGiftableChange(value === "yes")}
                                aria-label="Platform"
                                size="small"
                            >
                                <ToggleButton value="yes">Yes</ToggleButton>
                                <ToggleButton value="no">No</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                        
                        <Box
                            mt={2}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Typography mr={10}>Do you want to book Trees, Herbs & Shrubs?</Typography>
                            <ToggleButtonGroup
                                color="success"
                                value={bookAllHabits ? "yes" : "no"}
                                exclusive
                                onChange={(e, value) => onBookAllHabitsChange(value === "yes")}
                                aria-label="Platform"
                                size="small"
                            >
                                <ToggleButton value="yes">Yes</ToggleButton>
                                <ToggleButton value="no">Only Trees</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                        
                        <Box
                            mt={2}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Typography mr={10}>Do you want diversify plant types?</Typography>
                            <ToggleButtonGroup
                                color="success"
                                value={diversify ? "yes" : "no"}
                                exclusive
                                onChange={(e, value) => onDiversifyChange(value === "yes")}
                                aria-label="Platform"
                                size="small"
                            >
                                <ToggleButton value="yes">Yes</ToggleButton>
                                <ToggleButton value="no">No</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </>
                )}
            </Box>
            <Box display="flex" flexGrow={1}></Box>
        </Box>
    );
};

export default PlotBookingOptions;
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import TagSelector from "../../../../components/TagSelector"

interface TagComponentProps {
    defaultTags: string[]
    tags: string[]
    onSubmit: (updatedTags: string[]) => void
    open: boolean
    onClose: () => void
}

const TagComponent: React.FC<TagComponentProps> = ({ defaultTags, tags, open, onClose, onSubmit }) => {
    const [tagsList, setTagsList] = useState<string[]>([]);

    useEffect(() => {
        if (open) setTagsList(tags);
    }, [open, tags])

    const handleSubmit = () => {
        onSubmit(tagsList);
    }

    return (
        <Dialog open={open} fullWidth maxWidth="md">
            <DialogTitle>Tag request</DialogTitle>
            <DialogContent dividers>
                <Box mt={2}>
                    <Typography mb={1}>You can tag the tree card request by selecting existing tags from the list below or adding new ones.</Typography>
                    <TagSelector
                        showLabels={false}
                        userTags={defaultTags}
                        systemTags={undefined}
                        value={tagsList}
                        handleChange={(tags: string[]) =>
                            setTagsList(tags)
                        }
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="success" variant="contained">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default TagComponent;
import { Box, Dialog, DialogContent, DialogTitle, ImageList, ImageListItem, ImageListItemBar, TextField } from "@mui/material"
import { useEffect, useState } from "react"

interface ImageMappingProps {
    name?: string
    open: boolean
    images: string[]
    onClose: () => void
    onSelect: (imageUrl: string) => void
}

const ImageMapping: React.FC<ImageMappingProps> = ({ name, open, images, onClose, onSelect }) => {

    const [filteredImages, setFilteredImages] = useState<string[]>(images)
    const [searchStr, setSearchStr] = useState('');

    const getFilteredUrls = (images: string[], str: string) => {

        const filteredUrls: string[] = [];
        for (const image of images) {
            const parts = str.split(' ')
            let count = 0;
            for (const part of parts) {
                if (image.toLocaleLowerCase().includes(part.toLocaleLowerCase())) count++;
            }

            if (count/parts.length > 0.5) filteredUrls.push(image)
        }

        return filteredUrls;
    }

    useEffect(() => {
        if (!name) return;
        const urls = getFilteredUrls(images, name);
        const remainingUrls = images.filter(url => !urls.includes(url));

        setFilteredImages([...urls, ...remainingUrls])
    }, [name, images])

    useEffect(() => {
        if (searchStr === '') setFilteredImages(images);
        else {
            const urls = getFilteredUrls(images, searchStr);
    
            setFilteredImages(urls)
        }
    }, [searchStr, images])


    const handleImageSelection = (image: string) => {
        onSelect(image);
        onClose();
    }

    return (
        <Dialog
            open={open}
            maxWidth='lg'
        >
            <DialogTitle>Select a User Image</DialogTitle>
            <DialogContent dividers>
                <Box>
                    <TextField 
                        fullWidth
                        label={"Search name"}
                        value={searchStr}
                        onChange={(e) => { setSearchStr(e.target.value)}}
                        style={{ marginBottom: 10, backgroundColor: 'rgba(227, 250, 239, 0.4)' }}
                    />
                    <ImageList cols={4} sx={{ width: 1000, height: 600 }}>
                        {filteredImages.map((url, index) => (
                            <ImageListItem key={index}>
                                <img
                                    srcSet={`${url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`${url}?w=248&fit=crop&auto=format`}
                                    alt={url.split('/').slice(-1)[0]}
                                    loading="lazy"
                                    onClick={() => { handleImageSelection(url) }}
                                    style={{ cursor: 'pointer' }}
                                />
                                <ImageListItemBar
                                    title={url.split('/').slice(-1)[0]}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default ImageMapping;
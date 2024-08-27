import { FC } from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import PlaceIcon from '@mui/icons-material/Place';
import moment from "moment";

interface VisitCardProps {
    visitName: string;
    visitDate: string;
    numberOfPeople: number;
    numberOfImages: number;
}

const VisitCard: FC<VisitCardProps> = ({ visitName, visitDate, numberOfPeople, numberOfImages }) => {
    const formattedDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '-';

        return moment(date).format('MMMM DD, YYYY')
    }
    return (
        <Card>
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={8} md={4} container alignItems="center">
                        <PlaceIcon />
                        <Typography variant="body1" style={{ marginLeft: 8 }}>
                            {visitName}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} container alignItems="center">
                        <EventIcon />
                        <Typography variant="body1" style={{ marginLeft: 8 }}>
                            {formattedDate(visitDate)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2} container alignItems="center">
                        <PeopleIcon />
                        <Typography variant="body1" style={{ marginLeft: 8 }}>
                            {numberOfPeople}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2} container alignItems="center">
                        <PhotoLibraryIcon />
                        <Typography variant="body1" style={{ marginLeft: 8 }}>
                            {numberOfImages}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default VisitCard;

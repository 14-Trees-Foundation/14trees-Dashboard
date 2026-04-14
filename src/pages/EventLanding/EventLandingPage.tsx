import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { Spinner } from '../../components/Spinner';
import { NotFound } from '../notfound/NotFound';
import EventsApiClient from '../../api/events/eventsApiClient';
import { EventLandingData } from '../../types/EventLanding';
import EventHero from './components/EventHero';
import EventGallery from './components/EventGallery';
import EventParticipants from './components/EventParticipants';
import EventMap from './components/EventMap';
import EventMessages from './components/EventMessages';
import CorpFooter from '../GroupLanding/components/CorpFooter';
import AboutSection from '../../components/AboutSection';

const EventLandingPage: React.FC = () => {
	const { linkId } = useParams<{ linkId: string }>();
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<EventLandingData | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!linkId) {
			setError('Invalid event link');
			setLoading(false);
			return;
		}

		const client = new EventsApiClient();
		client
			.getEventLandingData(linkId)
			.then((res) => {
				setData(res);
				document.title = `${res.event.name} | 14 Trees`;
				// Track view (fire-and-forget)
				client.trackEventView(linkId);
			})
			.catch((err: any) => {
				const msg = err.message || 'Event not found';
				setError(msg);
				toast.error(msg);
			})
			.finally(() => setLoading(false));
	}, [linkId]);

	if (loading) return <Spinner text="Loading event…" />;
	if (error || !data) return <NotFound text={error ?? 'Event not found'} />;

	const { event, images, participants, messages } = data;

	return (
		<Box
			sx={{
				minHeight: '100vh',
				bgcolor: '#fff',
				'&, & *': {
					fontFamily: '"Instrument Sans", "HelveticaNowDisplay", sans-serif',
				},
			}}
		>
			<ToastContainer />

			<EventHero event={event} fallbackImage={images[0]?.image_url ?? null} />

			<EventGallery images={images} description={event.message} />

			<EventParticipants participants={participants} />

			<EventMessages messages={messages} />

			{event.location && (
				<EventMap location={event.location} siteName={event.site_name} />
			)}

			<AboutSection />

			<CorpFooter />
		</Box>
	);
};

export default EventLandingPage;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { Spinner } from '../../components/Spinner';
import { NotFound } from '../notfound/NotFound';
import EventsApiClient from '../../api/events/eventsApiClient';
import ApiClient from '../../api/apiClient/apiClient';
import { EventLandingData } from '../../types/EventLanding';
import EventHero from './components/EventHero';
import EventGallery from './components/EventGallery';
import EventParticipants from './components/EventParticipants';
import EventMap from './components/EventMap';
import EventMessages from './components/EventMessages';
import CorpFooter from '../GroupLanding/components/CorpFooter';
import AboutSection from '../../components/AboutSection';

type Donor = {
	donationId: number;
	donationReceiptNumber: string | null;
	name: string | null;
	amount: number | null;
};

const EventLandingPage: React.FC = () => {
	const { linkId } = useParams<{ linkId: string }>();
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<EventLandingData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [donors, setDonors] = useState<Donor[]>([]);

	useEffect(() => {
		if (!linkId) {
			setError('Invalid event link');
			setLoading(false);
			return;
		}

		const eventsClient = new EventsApiClient();
		eventsClient
			.getEventLandingData(linkId)
			.then((res) => {
				setData(res);
				document.title = `${res.event.name} | 14 Trees`;
				eventsClient.trackEventView(linkId);

				// Fetch campaign donors if the event is linked to a campaign
				if (res.event.campaign_c_key) {
					const apiClient = new ApiClient();
					apiClient
						.getCampaignAnalytics(res.event.campaign_c_key)
						.then((analytics) => setDonors(analytics.donors ?? []))
						.catch(() => {});
				}
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

	const { event, images, participants, trees, messages } = data;
	const isBirthday = Number(event.type) === 1;

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

			<EventHero
				event={event}
				fallbackImage={images[0]?.image_url ?? null}
				isBirthday={isBirthday}
			/>

			<EventGallery
				images={images}
				description={event.message}
				isBirthday={isBirthday}
			/>

			<EventParticipants
				participants={participants}
				trees={trees}
				isBirthday={isBirthday}
				donors={donors}
			/>

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

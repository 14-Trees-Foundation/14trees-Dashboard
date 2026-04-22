import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import ApiClient from '../../api/apiClient/apiClient';
import { Spinner } from '../../components/Spinner';
import { NotFound } from '../notfound/NotFound';
import { GroupLandingData } from '../../types/GroupLanding';
import HeroSection from './components/HeroSection';
import StatsStrip from './components/StatsStrip';
import VisitFilmStrip from './components/VisitFilmStrip';
import AboutSection from '../../components/AboutSection';
import CorpFooter from './components/CorpFooter';

type Props = {
	nameKey?: string;
};

const GroupLandingPage: React.FC<Props> = ({ nameKey: nameKeyProp }) => {
	const { name_key: nameKeyParam } = useParams<{ name_key: string }>();
	const name_key = nameKeyProp ?? nameKeyParam;
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<GroupLandingData | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!name_key) {
			setError('Invalid group key');
			setLoading(false);
			return;
		}

		const apiClient = new ApiClient();
		apiClient
			.getGroupLandingData(name_key)
			.then((res) => {
				setData(res);
				document.title = `${res.group.name} | 14 Trees`;
			})
			.catch((err: any) => {
				const msg = err.message || 'Group not found';
				setError(msg);
				toast.error(msg);
			})
			.finally(() => setLoading(false));
	}, [name_key]);

	if (loading) return <Spinner text="Loading..." />;
	if (error || !data) return <NotFound text={error ?? 'Group not found'} />;

	return (
		<Box
			sx={{
				minHeight: '100vh',
				bgcolor: '#f7faf8',
				'&, & *': {
					fontFamily: '"Instrument Sans", "HelveticaNowDisplay"',
				},
			}}
		>
			<ToastContainer />
			<HeroSection group={data.group} />
			<StatsStrip
				group={data.group}
				stats={data.stats}
				giftCards={data.gift_cards}
			/>
			<VisitFilmStrip
				visits={data.events}
				giftCards={data.gift_cards}
				siteVisits={data.visits ?? []}
				nameKey={name_key!}
			/>
			<AboutSection />
			<CorpFooter />
		</Box>
	);
};

export default GroupLandingPage;

import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import { Search } from './pages/Search/Search';
import { Visitor } from './pages/Visitor/Visitor';
import { AddTree } from './pages/admin/Forms/components/Addtree';
import { AddOrg } from './pages/admin/Forms/components/Addorg';
import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/events/Events';
import { NotFound } from './pages/notfound/NotFound';
import { AssignTree } from './pages/admin/Forms/components/AssignTree';
import { AdminLayout } from './pages/admin/Admin';
import { Layout } from './components/Layout';
import { GiftTrees } from './pages/ww/GiftTrees';
import { WW } from './pages/ww/WW';
// import { AdminLogin } from "./pages/admin/GoogleLogin";
import { RequireAuth } from './pages/admin/auth/RequireAuth';
import { AuthProvider } from './pages/admin/auth/auth';
import { Login } from './pages/admin/Login/Login';
import { Forms } from './pages/admin/Forms/Forms';
import { Birthday } from './pages/events/Birthday';
import { VisitorNew } from './pages/Visitor/Visitor2';
import { OrgEvent } from './pages/events/OrgEvent';
import { Corporate } from './pages/events/Corporate';
import { Test } from './pages/test/test';
import TreeProfile from './pages/Profiles/TreeProfile';
import UserProfile from './pages/Profiles/UserProfile';
import VisitProfile from './pages/Profiles/VisitProfile';
import OrgProfile from './pages/Profiles/OrgProfile';
import RedeemCard from './pages/admin/gift/Components/RedeemCard';
import { User } from './pages/user/User';
import RequestTreeCardsForm from './pages/admin/gift/Components/TreeCardRequest/RequestTreeCardsForm';
import SponsorProfile from './pages/SponsorProfile/SponsorProfile';
import CSRPage from './pages/admin/csr/CSRPage';
import EventPage from './pages/EventDashboard/EventPage';
import EventLandingPage from './pages/EventLanding/EventLandingPage';

const NEW_EVENT_LANDING_LINKS = new Set([
	'ij5h8ow9',
	'5e7vujoc',
	'2f8chrbn',
	'fb621e6b',
]);

const EventPageRouter = () => {
	const { linkId } = useParams();
	return NEW_EVENT_LANDING_LINKS.has(linkId) ? (
		<EventLandingPage />
	) : (
		<EventPage />
	);
};
import GiftDashboard from './pages/GiftDashboard/GiftDashboard';
import { AdminHome } from './pages/admin/home/AdminHome';
import { SitesComponent } from './pages/admin/sites/Sites';
import { PlotComponent } from './pages/admin/plot/Plot';
import { Trees } from './pages/admin/tree/Tree';
import { PlantTypeComponent } from './pages/admin/plantType/PlantType';
import { Ponds } from './pages/admin/Ponds/Ponds';
import { Users } from './pages/admin/users/Users';
import { OrganizationComponent } from './pages/admin/organization/Organization';
import { OnsiteReports } from './pages/admin/onsiteReports/OnsiteReports';
import TreeAuditVerification from './pages/admin/treeAuditVerification/TreeAuditVerification';
import TreeAuditSessionVerifier from './pages/admin/treeAuditVerification/TreeAuditSessionVerifier';
import { VisitsComponent } from './pages/admin/visits/Visits';
import { EventsPage } from './pages/admin/events/EventsPage';
import SiteInventory from './pages/admin/Inventory/SiteInventory';
import AnalyticsPage from './pages/admin/analytics/AnalyticsPage';
import SurveysPage from './pages/admin/surveys/SurveysPage';

import GiftTreesComponent from './pages/admin/gift/GiftTreesRefactored';
import GCInventory from './pages/admin/Inventory/GCInventory';
import { DonationComponent } from './pages/admin/donation/Donation';
import CSRAdminPage from './pages/admin/csr/CSRAdminPage';
import Campaigns from './pages/admin/campaign/Campaign';
import StaffRolesPage from './pages/admin/rbac/StaffRolesPage';
import { CampaignsPage } from './pages/admin/campaign/CampaignsPage';
import { ReferralsPage } from './pages/admin/campaign/ReferralsPage';
import { ReferralUserPage } from './pages/admin/campaign/ReferralUserPage';
import CorpRegistration from './pages/CorpRegistration';
import GroupDashboard from './pages/GroupDashboard/GroupDashboard';
import GroupLandingPage from './pages/GroupLanding/GroupLandingPage';
import GiftCardsPage from './pages/GroupLanding/GiftCardsPage';
import SiteVisitsPage from './pages/GroupLanding/SiteVisitsPage';
import CsrEventsPage from './pages/GroupLanding/CsrEventsPage';
import { getOrCreateVisitorId } from './helpers/visitorTracking';
import { useEffect, useRef } from 'react';
import ApiClient from './api/apiClient/apiClient';

function App() {
	const location = useLocation();
	const lastTrackedRef = useRef('');

	// Initialize visitor ID when app loads
	useEffect(() => {
		getOrCreateVisitorId();
	}, []);

	useEffect(() => {
		const hostname = window.location.hostname;
		const pathname = location.pathname;

		const isTrackablePath =
			pathname.startsWith('/profile/') || pathname.startsWith('/dashboard/');

		// Allow tracking on localhost only in development, or on production domain
		const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
		const isDevelopment = process.env.NODE_ENV === 'development';
		const isProduction =
			hostname === 'dashboard.14trees.org' || hostname.includes('dashboard');

		const isDashboardDomain = (isLocalhost && isDevelopment) || isProduction;

		if (!isDashboardDomain || !isTrackablePath) {
			return;
		}

		// React StrictMode can trigger effect twice in development.
		const trackingKey = `${pathname}${location.search}`;
		if (lastTrackedRef.current === trackingKey) {
			return;
		}
		lastTrackedRef.current = trackingKey;

		const apiClient = new ApiClient();
		apiClient.trackPublicDashboardVisit(pathname, window.location.href);
	}, [location.pathname, location.search]);

	return (
		<AuthProvider>
			<Layout>
				<Routes>
					<Route
						path="/home"
						component={() => {
							window.location.href = 'https://14trees.org/';
							return null;
						}}
					/>
					<Route path="/" element={<Search />}></Route>
					<Route path="/search" element={<Search />}></Route>
					<Route path="/visitor" element={<Visitor />}></Route>
					<Route path="/visitornew" element={<VisitorNew />}></Route>
					{/* <Route path="/addtree" element={<AddTree />}></Route> */}
					<Route path="/profile/:saplingId" element={<Dashboard />}></Route>
					<Route path="/profile/user/:userId" element={<Dashboard />}></Route>
					<Route path="/sponsorship/:id" element={<SponsorProfile />}></Route>
					<Route path="/group/:id" element={<SponsorProfile />}></Route>
					<Route path="/tree/:saplingId" element={<TreeProfile />}></Route>
					<Route path="/user/:id" element={<UserProfile />}></Route>
					<Route path="/visit/:id" element={<VisitProfile />}></Route>
					<Route path="/gifts" element={<RedeemCard />}></Route>
					<Route path="/organization/:id" element={<OrgProfile />}></Route>
					<Route path="/group/:grptype" element={<OrgEvent />}></Route>
					<Route path="/events/corp/:event_id" element={<Corporate />}></Route>
					<Route path="/events/:linkId" element={<EventPageRouter />}></Route>
					<Route path="/campaign/:c_key" element={<CampaignsPage />}></Route>
					<Route path="/referral" element={<ReferralsPage />}></Route>
					<Route path="/referral/:rfr" element={<ReferralUserPage />}></Route>
					<Route path="/login" element={<Login />} />
					<Route
						path="/corporate/registration"
						element={<CorpRegistration />}
					/>
					<Route
						path="/admin"
						element={
							<RequireAuth>
								<AdminLayout />
							</RequireAuth>
						}
					>
						<Route index element={<AdminHome />} /> {/* Default route */}
						<Route path="home" element={<AdminHome />} />
						<Route path="sites" element={<SitesComponent />} />
						<Route path="plots" element={<PlotComponent />} />
						<Route path="trees" element={<Trees />} />
						<Route path="plant-types" element={<PlantTypeComponent />} />
						<Route path="ponds" element={<Ponds />} />
						<Route path="people" element={<Users />} />
						<Route path="people-group" element={<OrganizationComponent />} />
						<Route path="onsite-reports" element={<OnsiteReports />} />
						<Route
							path="tree-audit-verification"
							element={<TreeAuditVerification />}
						/>
						<Route
							path="tree-audit-verification/:sessionId"
							element={<TreeAuditSessionVerifier />}
						/>
						<Route path="visits" element={<VisitsComponent />} />
						<Route path="events" element={<EventsPage />} />
						<Route path="site-inventory" element={<SiteInventory />} />
						<Route path="gc-inventory" element={<GCInventory />} />
						<Route path="analytics" element={<AnalyticsPage />} />
						<Route path="surveys" element={<SurveysPage />} />
						<Route path="campaigns" element={<Campaigns />}></Route>
						<Route path="tree-cards" element={<GiftTreesComponent />} />
						<Route path="donations" element={<DonationComponent />} />
						<Route path="corporate-dashboard" element={<CSRAdminPage />} />
						<Route path="rbac" element={<StaffRolesPage />} />
						<Route path="forms" element={<Forms />}>
							<Route path="assigntrees" element={<AssignTree />}></Route>
							<Route path="addorg" element={<AddOrg />}></Route>
						</Route>
					</Route>
					<Route
						path="/tree-cards"
						element={
							<RequireAuth>
								<User />
							</RequireAuth>
						}
					></Route>
					<Route path="/gift-trees" element={<RequestTreeCardsForm />}></Route>
					<Route path="/ww" element={<WW />}>
						<Route
							path=":email"
							element={
								<RequireAuth>
									<GiftTrees />
								</RequireAuth>
							}
						></Route>
					</Route>
					<Route path="/ww/group" element={<WW />}>
						<Route
							path=":group_id"
							element={
								<RequireAuth>
									<GiftTrees />
								</RequireAuth>
							}
						></Route>
					</Route>
					<Route path="/events" element={<Events />}>
						<Route path="birthday/:id" element={<Birthday />}></Route>
					</Route>
					<Route path="/notfound" element={<NotFound />} />
					<Route
						path="/test"
						element={
							<RequireAuth>
								<Test />
							</RequireAuth>
						}
					/>
					<Route
						path="/csr/dashboard/:groupId"
						element={
							<RequireAuth>
								<CSRPage />
							</RequireAuth>
						}
					/>
					<Route
						path="/dashboard/sprih"
						element={<GroupLandingPage nameKey="sprih" />}
					/>
					<Route
						path="/dashboard/hd-hyundai-construction-equipment-india-pvt-ltd"
						element={
							<GroupLandingPage nameKey="hd-hyundai-construction-equipment-india-pvt-ltd" />
						}
					/>
					<Route
						path="/dashboard/legalogic-consulting"
						element={<GroupLandingPage nameKey="legalogic-consulting" />}
					/>
					<Route
						path="/dashboard/:name_key/gifts"
						element={<GiftCardsPage />}
					/>
					<Route
						path="/dashboard/:name_key/visits"
						element={<SiteVisitsPage />}
					/>
					<Route path="/dashboard/:name_key/csr" element={<CsrEventsPage />} />
					<Route path="/dashboard/:name_key" element={<GroupDashboard />} />
					<Route
						path="/personal/dashboard/:userId"
						element={
							<RequireAuth>
								<GiftDashboard />
							</RequireAuth>
						}
					/>
				</Routes>
			</Layout>
		</AuthProvider>
	);
}

export default App;

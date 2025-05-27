import { Route, Routes } from "react-router-dom";
import { Search } from "./pages/Search/Search";
import { Visitor } from "./pages/Visitor/Visitor";
import { AddTree } from "./pages/admin/Forms/components/Addtree";
import { AddOrg } from "./pages/admin/Forms/components/Addorg";
import { Dashboard } from "./pages/Dashboard";
import { Events } from "./pages/events/Events";
import { NotFound } from "./pages/notfound/NotFound";
import { AssignTree } from "./pages/admin/Forms/components/AssignTree";
import { AdminLayout } from "./pages/admin/Admin";
import { Layout } from "./components/Layout";
import { GiftTrees } from "./pages/ww/GiftTrees";
import { WW } from "./pages/ww/WW";
// import { AdminLogin } from "./pages/admin/GoogleLogin";
import { RequireAuth } from "./pages/admin/auth/RequireAuth";
import { AuthProvider } from "./pages/admin/auth/auth";
import { Login } from "./pages/admin/Login/Login";
import { Forms } from "./pages/admin/Forms/Forms";
import { Birthday } from "./pages/events/Birthday";
import { VisitorNew } from "./pages/Visitor/Visitor2";
import { OrgEvent } from "./pages/events/OrgEvent";
import { Corporate } from "./pages/events/Corporate";
import { Test } from "./pages/test/test";
import TreeProfile from "./pages/Profiles/TreeProfile";
import UserProfile from "./pages/Profiles/UserProfile";
import VisitProfile from "./pages/Profiles/VisitProfile";
import OrgProfile from "./pages/Profiles/OrgProfile";
import RedeemCard from "./pages/admin/gift/RedeemCard";
import { User } from "./pages/user/User";
import RequestTreeCardsForm from "./pages/admin/gift/Form/TreeCardRequest/RequestTreeCardsForm";
import SponsorProfile from "./pages/SponsorProfile/SponsorProfile";
import CSRPage from "./pages/admin/csr/CSRPage";
import EventPage from "./pages/EventDashboard/EventPage";
import GiftDashboard from "./pages/GiftDashboard/GiftDashboard";
import { AdminHome } from "./pages/admin/home/AdminHome";
import { SitesComponent } from "./pages/admin/sites/Sites";
import { PlotComponent } from "./pages/admin/plot/Plot";
import { Trees } from "./pages/admin/tree/Tree";
import { PlantTypeComponent } from "./pages/admin/plantType/PlantType";
import { Ponds } from "./pages/admin/Ponds/Ponds";
import { Users } from "./pages/admin/users/Users";
import { OrganizationComponent } from "./pages/admin/organization/Organization";
import { VisitsComponent } from "./pages/admin/visits/Visits";
import { EventsComponent } from "./pages/admin/events/Events";
import SiteInventory from "./pages/admin/Inventory/SiteInventory";
import GiftTreesComponet from "./pages/admin/gift/GiftTrees";
import GCInventory from "./pages/admin/Inventory/GCInventory";
import { DonationComponent } from "./pages/admin/donation/Donation";
import CSRInventory from "./pages/admin/csr/CSRInventory";

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route
            path="/home"
            component={() => {
              window.location.href = "https://14trees.org/";
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
          <Route path="/dashboard/:id" element={<SponsorProfile />}></Route>
          <Route path="/group/:id" element={<SponsorProfile />}></Route>
          <Route path="/tree/:saplingId" element={<TreeProfile />}></Route>
          <Route path="/user/:id" element={<UserProfile />}></Route>
          <Route path="/visit/:id" element={<VisitProfile />}></Route>
          <Route path="/gifts" element={<RedeemCard />}></Route>
          <Route path="/organization/:id" element={<OrgProfile />}></Route>
          <Route path="/group/:grptype" element={<OrgEvent />}></Route>
          <Route path="/events/corp/:event_id" element={<Corporate />}></Route>
          <Route path="/events/:linkId" element={<EventPage />}></Route>
          <Route path="/login" element={<Login />} />
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
            <Route path="visits" element={<VisitsComponent />} />
            <Route path="events" element={<EventsComponent />} />
            <Route path="site-inventory" element={<SiteInventory />} />
            <Route path="gc-inventory" element={<GCInventory />} />
            <Route path="tree-cards" element={<GiftTreesComponet />} />
            <Route path="donations" element={<DonationComponent />} />
            <Route path="corporate-dashboard" element={<CSRInventory />} />
            <Route path="forms" element={<Forms />}>
              <Route path="assigntrees" element={<AssignTree />}></Route>
              <Route path="addorg" element={<AddOrg />}></Route>
            </Route>
          </Route>
          <Route
            path="/tree-cards"
            element={
              // <RequireAuth>
              <User />
              // </RequireAuth>
            }
          >
          </Route>
          <Route
            path="/gift-trees"
            element={
              <RequestTreeCardsForm />
            }
          >
          </Route>
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

/** @format */

import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
	Link,
	useNavigate,
} from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CampaignList from './pages/campaigns';
import { ToastContainer } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import useAuthStore from './state/atoms';
import MyAccount from './pages/myaccount';
import UserApplyCampaign from './pages/userapplycampaign';
import AddPostUrl from './pages/addposturl';
// import { SubmitFeedback_Kbeauty, SubmitFeedback_Kfood } from "./pages/ProductFeedback";
import CampaignDetail from './pages/CampaignDetail';
import CampaignManagement from './pages/admin/campainManagement';
import Applications from './pages/admin/Applications';
import axios from 'axios';
import config from './config';
import Cookie from 'js-cookie';
import AuthAdmin from './pages/admin/Auth';
import { LoaderCircle } from 'lucide-react';
import ViewCampaignApplicants from './pages/admin/CampaignApplications';
import ViewCampaignSubmission from './pages/admin/CampaignSubmission';
import AboutUs from './pages/AboutUs';
import BrandLandingPage from './pages/BrandLandingPage';
import Influencer from './pages/influencer';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from "./pages/ForgotPassword";


const URL = config.BACKEND_URL;

function Layout() {
	const location = useLocation();
	const [loading, setloading] = useState(true);
	const isAdminRoute = location.pathname.startsWith('/admin');

	// Skip authentication logic for admin routes
	const authStore = useAuthStore();
	const isLogin = !isAdminRoute ? authStore.isLogin : null;
	const User = !isAdminRoute ? authStore.User : null;
	const verifyLogin = !isAdminRoute ? authStore.verifyLogin : null;

	useEffect(() => {
		first();
	}, [isAdminRoute, verifyLogin]);

	async function first() {
		if (!isAdminRoute && verifyLogin) {
			// setloading(true)
			await verifyLogin();
		}
		setloading(false);
	}

	if (loading)
		return (
			<div className='flex items-center justify-center h-screen'>
				<LoaderCircle
					className='animate-spin text-gray-200'
					size={48}
				/>
			</div>
		);

	return (
		<>
			<ToastContainer />
			{!isAdminRoute && <Navbar Islogin={isLogin} />}

			<Routes>
				{/* Public Routes */}
				<Route
					path='/'
					element={<Home />}
				/>
				<Route
					path='signin'
					element={<Signin />}
				/>
				<Route
					path='signup'
					element={<Signup />}
				/>
				<Route
					path='/verify-email'
					element={<VerifyEmail />}
				/>
				<Route
					path='campaigns'
					element={<CampaignList />}
				/>
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route 
				path='UserApplyCampaign'
				element={
					<AuthChecker isLogin={isLogin}>
					<UserApplyCampaign />
					</AuthChecker>
				}	
				/>
				<Route 
				path='/AddPostUrl/:campaignId'
				element={
					<AuthChecker isLogin={isLogin}>
					<AddPostUrl />
					</AuthChecker>
				}	
				/>
				<Route
					path='MyAccount'
					element={
						<AuthChecker isLogin={isLogin}>
							<MyAccount
								user={User}
								campaigns={[
									{ title: 'one', date: 'two' },
									{ title: 'one', date: 'two' },
									{ title: 'one', date: 'two' },
									{ title: 'one', date: 'two' },
								]}
							/>
						</AuthChecker>
					}
				/>
				{/* <Route path="ProductFeedback/K-food" element={<SubmitFeedback_Kfood />} />
        <Route path="ProductFeedback/K-beauty" element={<SubmitFeedback_Kbeauty />} /> */}
				<Route
					path='/aboutus'
					element={<AboutUs />}
				/>
				<Route
					path='/brand'
					element={<BrandLandingPage />}
				/>
				<Route
					path='/influencer'
					element={<Influencer />}
				/>
				<Route
					path='/campaign/:campaignId'
					element={<CampaignDetail />}
				/>
				<Route
					path='/admin/auth'
					element={<AuthAdmin></AuthAdmin>}
				></Route>
			</Routes>
			{!isAdminRoute && (
				<div className='bg-[var(--background)] pt-[30px]'>
					<Footer />
				</div>
			)}

			{isAdminRoute && (
				<AdminAuthChecker>
					<div className='flex flex-col md:flex-row md:min-h-screen bg-[#141414] text-white'>
						{/* Sidebar */}
						<aside className='bg-[#1f1f1f] p-6 space-y-6  w-[100vw] md:w-54'>
							<h1 className='text-[15px] md:text-2xl font-bold text-center FontNoto'>
								Admin Panel
							</h1>
							<nav className='md:space-y-7 flex md:block justify-around mt-[40px] md:mt-0'>
								<Link
									to='/admin/campaigns'
									className='block py-1 px-4 rounded-md hover:bg-gray-600 FontNoto text-[14px]'
								>
									Campaigns
								</Link>
								<Link
									to='/admin/Users'
									className='block py-1 px-4 rounded-md hover:bg-gray-600 FontNoto text-[14px]'
								>
									Applications
								</Link>
							</nav>
						</aside>

						{/* Main Content */}
						<main className='flex-1'>
							<Routes>
								<Route
									path='/admin/campaigns'
									element={
										<AdminAuthChecker>
											<CampaignManagement />
										</AdminAuthChecker>
									}
								/>
								<Route
									path='/admin/Users'
									element={
										<AdminAuthChecker>
											<Applications />
										</AdminAuthChecker>
									}
								/>
								<Route
									path='/admin/applicants/:campaignId'
									element={
										<AdminAuthChecker>
											<ViewCampaignApplicants></ViewCampaignApplicants>
										</AdminAuthChecker>
									}
								/>
								<Route
									path='/admin/campaign-submission/:campaignId/:email'
									element={
										<AdminAuthChecker>
											<ViewCampaignSubmission />
										</AdminAuthChecker>
									}
								/>
							</Routes>
						</main>
					</div>
				</AdminAuthChecker>
			)}
		</>
	);
}

function AuthChecker({ children, isLogin }) {
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLogin) {
			navigate('/signin');
		}
	}, [isLogin, navigate]);

	return <>{children}</>;
}

function AdminAuthChecker({ children }) {
	const navigate = useNavigate();
	const [loading, setloading] = useState(true);

	useEffect(() => {
		async function verifyLogin() {
			try {
				const token = Cookie.get('AdminToken');
				const res = await axios.get(`${URL}/admin/verify`, {
					headers: {
						authorization: token,
					},
				});
				if (res.data.status === 'success') {
					setloading(false);
					return true;
				}
				navigate('/admin/auth');
				return false;
			} catch {
				navigate('/admin/auth');
				return false;
			}
		}
		verifyLogin();
	}, []);

	if (loading)
		return (
			<div className='flex items-center justify-center h-screen'>
				<LoaderCircle
					className='animate-spin text-gray-200'
					size={48}
				/>
			</div>
		);

	return <>{children}</>;
}

function App() {
	return (
		<Router>
			<Layout />
		</Router>
	);
}

export default App;

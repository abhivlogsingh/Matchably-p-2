/** @format */

// ✅ Refactored ViewCampaignApplicants with status update & proper hooks

import React, { useEffect, useState } from 'react';
import { Download, Save } from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios';
import config from '../../config';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AiOutlineEye } from 'react-icons/ai';
import { FaTrashAlt } from 'react-icons/fa';

const Button = ({ children, onClick }) => (
	<button
		onClick={onClick}
		className='flex justify-center items-center bg-gradient-to-l from-[#7d71ff] to-[#5b25ff] hover:bg-blue-800 text-white px-4 py-2 rounded-lg gap-2 FontLato transition shadow-md'
	>
		{children}
	</button>
);

const ApplicantRow = ({
	applicant,
	campaignId,
	edited,
	onFieldChange,
	onSave,
	onDelete,
}) => {
	const { status, rejectionReason, showReasonToInfluencer } = edited;

	return (
		<tr className='border-b border-gray-800 hover:bg-[#303030] transition-colors'>
			{/* 1. Applicant Info */}
			<td className='p-3'>{applicant.name}</td>
			<td className='p-3'>{applicant.email}</td>
			<td className='p-3'>{applicant.address}</td>
			<td className='p-3'>{applicant.phone}</td>
			<td className='p-3'>{applicant.appliedAt.split('T')[0]}</td>

			{/* 2. View Submission Link */}
			<td className='p-3'>
				<Link
					to={`/admin/campaign-submission/${campaignId}/${encodeURIComponent(
						applicant.email
					)}`}
					className='
			  inline-flex items-center px-4 py-2
			  bg-indigo-600 text-white text-sm font-medium
			  rounded-md shadow-sm
			  hover:bg-indigo-700
			  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
			  transition
			'
				>
					<AiOutlineEye className='h-5 w-5 mr-2' />
					View Submission
				</Link>
			</td>

			{/* 3. Status Dropdown, Rejection Fields & Actions */}
			<td className='p-3'>
				<select
					value={status}
					onChange={(e) =>
						onFieldChange(applicant.id, 'status', e.target.value)
					}
					className={`
			  bg-[#2c2c2c] border px-2 py-1 rounded text-white outline-none mb-2 w-full
			  ${
					status === 'Approved'
						? 'border-green-500'
						: status === 'Rejected'
						? 'border-red-500'
						: 'border-yellow-500'
				}
			`}
				>
					<option value='Pending'>Pending</option>
					<option value='Approved'>Approved</option>
					<option value='Rejected'>Rejected</option>
				</select>

				{status === 'Rejected' && (
					<>
						<textarea
							placeholder='Rejection reason'
							value={rejectionReason}
							onChange={(e) =>
								onFieldChange(applicant.id, 'rejectionReason', e.target.value)
							}
							className='
				  w-full p-2 bg-[#1e1e1e] border border-gray-600
				  rounded text-white text-sm mb-2
				'
						/>
						<label className='flex items-center gap-2 text-sm text-white mb-2'>
							<input
								type='checkbox'
								checked={showReasonToInfluencer}
								onChange={() =>
									onFieldChange(
										applicant.id,
										'showReasonToInfluencer',
										!showReasonToInfluencer
									)
								}
							/>
							Show reason to influencer
						</label>
					</>
				)}

				<div className='flex gap-2'>
					<button
						onClick={() => onSave(applicant.id)}
						className='
				bg-blue-600 hover:bg-blue-700 text-white text-sm
				px-3 py-1 rounded
			  '
					>
						Save
					</button>
					<button
						onClick={() => onDelete(applicant.id)}
						className='
				bg-red-600 hover:bg-red-700 text-white
				px-3 py-1 rounded
			  '
					>
						<FaTrashAlt />
					</button>
				</div>
			</td>
		</tr>
	);
};

const ViewCampaignApplicants = () => {
	const { campaignId } = useParams();
	const [applications, setApplications] = useState([]);
	const [Last, setLast] = useState(false);
	const [loading, setloading] = useState(false);
	const [LastId, setLastId] = useState(null);
	const [campaignTitle, setCampaignTitle] = useState('');
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedApplicantId, setSelectedApplicantId] = useState(null);
	const [editedApplications, setEditedApplications] = useState({});

	const exportToCSV = async () => {
		try {
			const response = await axios.get(
				`${config.BACKEND_URL}/admin/applications/download/${campaignId}`,
				{ responseType: 'blob' }
			);
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'applications.csv');
			document.body.appendChild(link);
			link.click();
			link.remove();
		} catch (error) {
			alert('Failed to download CSV.');
		}
	};

	// inside ViewCampaignApplicants
	const handleSaveOne = async (applicantId) => {
		const token = Cookies.get('AdminToken');
		const data = editedApplications[applicantId];
		try {
			await axios.patch(
				`${config.BACKEND_URL}/admin/applications/${applicantId}/status`,
				{
					status: data.status,
					rejectionReason: data.rejectionReason,
					showReasonToInfluencer: data.showReasonToInfluencer,
				},
				{ headers: { authorization: token } }
			);
			alert('Applicant updated');
			getApplications();
		} catch {
			alert('Failed to save applicant');
		}
	};

	const getApplications = async () => {
		setloading(true);

		try {
			const token = Cookies.get('AdminToken');
			const res = await axios.get(
				`${config.BACKEND_URL}/admin/applications/${campaignId}`,
				{ headers: { authorization: token } }
			);
			if (res.data.status === 'success') {
				const apps = res.data.applications;

				// 1. Set the raw list
				setApplications(apps);

				// 2. Build the “edited” map for Save All
				const initialEdits = {};
				apps.forEach((app) => {
					initialEdits[app.id] = {
						status: app.status,
						rejectionReason: app.rejectionReason || '',
						showReasonToInfluencer: app.showReasonToInfluencer || false,
					};
				});
				setEditedApplications(initialEdits);

				// 3. Other existing setters
				setLast(!res.data.isLastPage);
				setLastId(res.data.nextCursor);
				setCampaignTitle(res.data.campaignTitle);
			}
		} finally {
			setloading(false);
		}
	};

	// 2. Row field update handler
	const handleFieldChange = (applicantId, field, value) => {
		setEditedApplications((prev) => ({
			...prev,
			[applicantId]: {
				...prev[applicantId],
				[field]: value,
			},
		}));
	};

	// 3. Save all in one shot
	const saveAll = async () => {
		const token = Cookies.get('AdminToken');
		try {
			await Promise.all(
				Object.entries(editedApplications).map(([id, data]) =>
					axios.patch(
						`${config.BACKEND_URL}/admin/applications/${id}/status`,
						{
							status: data.status,
							rejectionReason: data.rejectionReason,
							showReasonToInfluencer: data.showReasonToInfluencer,
						},
						{ headers: { authorization: token } }
					)
				)
			);
			alert('All applicants updated successfully');
			getApplications();
		} catch (e) {
			alert('Failed to save some changes');
		}
	};

	const paginate = async () => {
		setloading(true);
		try {
			const token = Cookies.get('AdminToken');
			const res = await axios.post(
				`${config.BACKEND_URL}/admin/applications/paginate/${campaignId}`,
				{ LastId },
				{ headers: { authorization: token } }
			);
			if (res.data.status === 'success') {
				setApplications([...applications, ...res.data.applications]);
				setLast(!res.data.isLastPage);
				setLastId(res.data.nextCursor);
			}
		} finally {
			setloading(false);
		}
	};

	const handleDelete = async (applicantId) => {
		try {
			const token = Cookies.get('AdminToken');
			await axios.delete(
				`${config.BACKEND_URL}/admin/applications/${campaignId}/${applicantId}`,
				{ headers: { authorization: token } }
			);
			setApplications(applications.filter((app) => app.id !== applicantId));
		} catch (error) {
			alert('Failed to delete applicant.');
		}
	};

	useEffect(() => {
		getApplications();
	}, []);

	useEffect(() => {
		console.log('Applications:', applications);
	}, [applications]);

	return (
		<div className='p-6 text-white rounded-xl shadow-lg min-h-screen lg:max-w-[83vw]'>
			<Helmet>
				<title>My Account</title>
				<meta
					name='robots'
					content='noindex, nofollow'
				/>
				<meta
					name='googlebot'
					content='noindex, nofollow'
				/>
			</Helmet>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-xl font-semibold FontLato'>Applicants</h2>
				<div className='flex space-x-2'>
					{/* New Save All button */}
					<Button onClick={saveAll}>
						<Save size={16} /> <span>Save All</span>
					</Button>

					{/* Existing Export CSV button */}
					<Button onClick={exportToCSV}>
						<Download size={16} /> <span>Export CSV</span>
					</Button>
				</div>
			</div>

			<div className='text-white h-[50px] text-[green]'>
				<Link to={`/campaign/${campaignId}`}>{campaignTitle}</Link>
			</div>

			<div className='overflow-x-auto bg-[#202020] rounded-[5px]'>
				{applications.length !== 0 || loading ? (
					<table className='min-w-full rounded-lg border-none'>
						<thead>
							<tr className='bg-[#3c3c3c] text-left text-sm font-semibold text-white'>
								<th className='p-3'>Name</th>
								<th className='p-3'>Email</th>
								<th className='p-3'>Shipping Address</th>
								<th className='p-3'>Phone</th>
								<th className='p-3'>Application Date</th>
								<th className='p-3'>Apply Urls</th>
								<th className='p-3'>Action</th>
							</tr>
						</thead>
						<tbody>
							{applications.map((applicant) => (
								<ApplicantRow
									key={applicant.id}
									applicant={applicant}
									campaignId={campaignId} // from useParams
									edited={editedApplications[applicant.id]}
									onFieldChange={handleFieldChange}
									userId={applicant.email} // or applicant.userId, depending on your backend
									onDelete={(id) => {
										setSelectedApplicantId(id);
										setShowDeleteModal(true);
									}}
									onRefresh={getApplications}
									onSave={handleSaveOne}
								/>
							))}

							{loading && (
								<tr>
									<td
										colSpan='6'
										className='text-center py-8 text-gray-400'
									>
										Loading applications...
									</td>
								</tr>
							)}

							{!loading && Last && (
								<tr>
									<td
										colSpan='6'
										className='text-center py-8'
									>
										<button
											onClick={paginate}
											className='bg-[#484848] hover:bg-[#5a5a5a] text-white py-2 px-4 rounded-lg transition-all'
										>
											Load More
										</button>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				) : (
					<div className='flex justify-center items-center h-[80vh] bg-[#414141]'>
						<p className='FontNoto'>No Applicants Registered</p>
					</div>
				)}
			</div>

			{showDeleteModal && (
				<div className='fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50'>
					<div className='bg-[#1f1f1f] p-6 md:p-8 rounded-2xl shadow-xl border border-gray-700 w-[90%] max-w-md'>
						<h2 className='text-2xl text-white font-semibold FontLato mb-5'>
							Confirm Deletion
						</h2>
						<p className='text-gray-300 mb-6 FontLato'>
							Are you sure you want to delete this applicant? This action cannot
							be undone.
						</p>
						<div className='flex justify-end gap-4'>
							<button
								onClick={() => setShowDeleteModal(false)}
								className='bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg FontLato'
							>
								Cancel
							</button>
							<button
								onClick={async () => {
									await handleDelete(selectedApplicantId);
									setShowDeleteModal(false);
									setSelectedApplicantId(null);
								}}
								className='bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg FontLato'
							>
								Yes, Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ViewCampaignApplicants;

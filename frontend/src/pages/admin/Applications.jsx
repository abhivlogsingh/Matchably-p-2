/** @format */

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import config from '../../config';
import { Helmet } from 'react-helmet';
import { FaLock, FaUnlock, FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function ViewApplicants() {
	const [applications, setApplications] = useState([]);
	const [lastCursor, setLastCursor] = useState(null);
	const [hasMore, setHasMore] = useState(false);
	const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
	const token = Cookies.get('AdminToken');

	// Fetch initial page of users
	const fetchUsers = async () => {
		setLoading(true);
		try {
			const res = await axios.get(`${config.BACKEND_URL}/admin/users`, {
				headers: { authorization: token },
			});
			if (res.data.status === 'success') {
				setApplications(res.data.registered);
				setHasMore(!res.data.isLastPage);
				setLastCursor(res.data.nextCursor);
			}
		} catch (err) {
			console.error('Error fetching users:', err);
		} finally {
			setLoading(false);
		}
	};

	// Load next page
	const loadMore = async () => {
		if (!lastCursor) return;
		setLoading(true);
		try {
			const res = await axios.post(
				`${config.BACKEND_URL}/admin/users/paginate`,
				{ LastId: lastCursor },
				{ headers: { authorization: token } }
			);
			if (res.data.status === 'success') {
				setApplications((prev) => [...prev, ...res.data.registered]);
				setHasMore(!res.data.isLastPage);
				setLastCursor(res.data.nextCursor);
			}
		} catch (err) {
			console.error('Error loading more users:', err);
		} finally {
			setLoading(false);
		}
	};

	// Delete a user permanently
	const handleDelete = async (userId) => {
		if (!window.confirm('Are you sure you want to delete this user?')) return;
		try {
			await axios.delete(`${config.BACKEND_URL}/admin/users/${userId}`, {
				headers: { authorization: token },
			});
			setApplications((prev) => prev.filter((u) => u.id !== userId));
		} catch (err) {
			console.error('Error deleting user:', err);
			alert('Failed to delete user.');
		}
	};

  const handleVerifyChange = async (userId, value) => {
    try {
      const res = await axios.patch(
        `${config.BACKEND_URL}/admin/users/${userId}/verify`,
        { isVerified: value === 'yes' },
        { headers: { authorization: token } }
      );
      if (res.data.status === 'success') {
        setApplications((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, isVerified: value === 'yes' } : u
          )
        );
        toast.success("Verification status updated successfully.", {  theme: "dark" });
      }
    } catch (err) {
      console.error('Error updating verification status:', err);
      toast.error("Failed to update verification status.", { theme: "dark"});
    }
  };
  

	// Toggle blocked status
	const handleToggleBlock = async (userId) => {
		try {
			const res = await axios.patch(
				`${config.BACKEND_URL}/admin/users/${userId}/block`,
				{},
				{ headers: { authorization: token } }
			);
			if (res.data.status === 'success') {
				setApplications((prev) =>
					prev.map((u) => (u.id === userId ? { ...u, blocked: !u.blocked } : u))
				);
			}
		} catch (err) {
			console.error('Error toggling block:', err);
			alert('Failed to update block status.');
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	return (
		<div className='p-6 text-white rounded-xl shadow-lg min-h-screen lg:max-w-[83vw]'>
			<Helmet>
				<title>Users Management</title>
				<meta
					name='robots'
					content='noindex, nofollow'
				/>
			</Helmet>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4'>
  <h2 className='text-xl font-semibold text-white'>
    Registered Users - {applications.length}
  </h2>

  <input
    type='text'
    placeholder='Search by name or email...'
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className='w-full md:w-80 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
  />
</div>

			<div className='overflow-x-auto bg-[#202020] rounded-lg'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead className='bg-gray-800'>
						<tr>
							<th className='px-4 py-2 text-left'>Name</th>
							<th className='px-4 py-2 text-left'>Email</th>
							<th className='px-4 py-2 text-left'>Joined</th>
							<th className='px-4 py-2 text-left'>Verified email</th>
							<th className='px-4 py-2 text-center'>Blocked</th>
							<th className='px-4 py-2 text-center'>Actions</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-700'>
          {applications
  .filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((user) => (

							<tr
								key={user.id}
								className='hover:bg-gray-700'
							>
								<td className='px-4 py-2'>{user.name}</td>
								<td className='px-4 py-2'>{user.email}</td>
								<td className='px-4 py-2'>{user.joinedAt.split('T')[0]}</td>
								<td className="px-4 py-2">
  <select
    value={user.isVerified ? 'yes' : 'no'}
    onChange={(e) => handleVerifyChange(user.id, e.target.value)}
    className={`px-3 py-1 rounded border font-semibold text-white
      ${user.isVerified ? 'bg-green-600 border-green-700' : 'bg-red-600 border-red-700'}
      hover:opacity-90 transition duration-200`}
  >
    <option value="yes" className="text-black">Yes</option>
    <option value="no" className="text-black">No</option>
  </select>
</td>


								<td className='px-4 py-2 text-center'>
									{user.blocked ? 'Yes' : 'No'}
								</td>
								<td className='px-4 py-2 text-center space-x-2'>
									<button
										onClick={() => handleToggleBlock(user.id)}
										className={
											`px-3 py-1 rounded text-white ` +
											(user.blocked
												? 'bg-yellow-600 hover:bg-yellow-700'
												: 'bg-red-600 hover:bg-red-700')
										}
									>
										{user.blocked ? <FaUnlock /> : <FaLock />}
									</button>
									<button
										onClick={() => handleDelete(user.id)}
										className='px-3 py-1 bg-red-600  text-white rounded'
									>
										<FaTrashAlt />
									</button>
								</td>
							</tr>
						))}

						{loading && (
							<tr>
								<td
									colSpan={5}
									className='px-4 py-8 text-center text-gray-400'
								>
									Loading users...
								</td>
							</tr>
						)}

						{!loading && hasMore && (
							<tr>
								<td
									colSpan={5}
									className='px-4 py-8 text-center'
								>
									<button
										onClick={loadMore}
										className='px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white'
									>
										Load More
									</button>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

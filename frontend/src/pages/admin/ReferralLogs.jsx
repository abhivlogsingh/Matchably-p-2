import React, { useEffect, useState } from 'react';
import config from '../../config';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";

const ReferralLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const token = Cookies.get("AdminToken") || localStorage.getItem("token");

  useEffect(() => {
    fetch(`${config.BACKEND_URL}/admin/referrel/points/logs`, {
      headers: { authorization: token },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const sorted = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setLogs(sorted);
          setFilteredLogs(sorted);
        } else {
          toast.error(data.message);
        }
      })
      .catch(() => toast.error('Failed to load referral logs'));
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);
    const filtered = logs.filter(log =>
      log.user?.toLowerCase().includes(term) || log.referrer?.toLowerCase().includes(term)
    );
    setFilteredLogs(filtered);
  };

  const handleSortByDate = () => {
    const sorted = [...filteredLogs].sort((a, b) =>
      sortAsc
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );
    setFilteredLogs(sorted);
    setSortAsc(!sortAsc);
  };

  return (
    <div className='p-6 text-white'>
      <div className="flex justify-between items-center mb-4">
        <h2 className='text-xl font-bold'>Point Logs</h2>
        <input
          type="text"
          placeholder="Search by email"
          value={search}
          onChange={handleSearch}
          className="px-3 py-1 rounded text-black"
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className='w-full text-sm text-left bg-gray-800 border border-gray-700'>
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className='p-3'>Logs</th>
              <th className='p-3'>Invitee</th>
              <th className='p-3 cursor-pointer' onClick={handleSortByDate}>
                Date {sortAsc ? '▲' : '▼'}
              </th>
              <th className='p-3'>Points</th>
              <th className='p-3'>Note</th>
              <th className='p-3'>Source</th>
              <th className='p-3'>Fraud?</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, i) => (
                <tr key={i} className='border-t border-gray-700 hover:bg-gray-600 transition'>
                  <td className='p-3'>{log.referrer || 'Logs'}</td>
                  <td className='p-3'>{log.user || 'N/A'}</td>
                  <td className='p-3'>{new Date(log.createdAt).toLocaleString()}</td>
                  <td className='p-3'>{log.points}</td>
                  <td className='p-3'>{log.note}</td>
                  <td className='p-3 capitalize'>{log.source?.replace('-', ' ')}</td>
                  <td className='p-3'>{log.fraud ? 'Yes' : 'No'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className='p-4 text-center text-gray-400'>No logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferralLogs;

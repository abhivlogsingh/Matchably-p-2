// ✅ Referral Logs Page
import React, { useEffect, useState } from 'react';
import config from '../../config';
import { toast } from 'react-toastify';

const ReferralLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch(`${config.BACKEND_URL}/user/admin/referrals`, {
      headers: { Authorization: localStorage.getItem('token') },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setLogs(data.data);
        else toast.error(data.message);
      })
      .catch(() => toast.error('Failed to load referral logs'));
  }, []);

  return (
    <div className='p-6 text-white'>
      <h2 className='text-xl font-bold mb-4'>Referral Logs</h2>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b border-gray-600'>
            <th>Referrer</th>
            <th>Invitee</th>
            <th>Date</th>
            <th>Points</th>
            <th>Fraud?</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i} className='border-b border-gray-700'>
              <td>{log.referrer}</td>
              <td>{log.invitee}</td>
              <td>{new Date(log.approvedAt).toLocaleDateString()}</td>
              <td>{log.points}</td>
              <td>{log.fraud ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReferralLogs;

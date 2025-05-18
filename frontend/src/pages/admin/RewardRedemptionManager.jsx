
// ✅ Reward Redemption Manager
import React, { useEffect, useState } from 'react';
import config from '../../config';
import { toast } from 'react-toastify';

const RewardRedemptionManager = () => {
  const [redemptions, setRedemptions] = useState([]);

  const fetchRedemptions = () => {
    fetch(`${config.BACKEND_URL}/user/admin/reward-transactions`, {
      headers: { Authorization: localStorage.getItem('token') },
    })
      .then(res => res.json())
      .then(data => setRedemptions(data.data || []))
      .catch(() => toast.error('Failed to load rewards'));
  };

  const markComplete = async id => {
    try {
      await fetch(`${config.BACKEND_URL}/admin/reward-transactions/${id}`, {
        method: 'PATCH',
        headers: { Authorization: localStorage.getItem('token') },
      });
      fetchRedemptions();
      toast.success('Marked as complete');
    } catch {
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    fetchRedemptions();
  }, []);

  return (
    <div className='p-6 text-white'>
      <h2 className='text-xl font-bold mb-4'>Reward Redemptions</h2>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b border-gray-600'>
            <th>User</th>
            <th>Reward</th>
            <th>Points</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {redemptions.map((r, i) => (
            <tr key={i} className='border-b border-gray-800'>
              <td>{r.user?.email || 'N/A'}</td>
              <td>{r.reward}</td>
              <td>{r.points}</td>
              <td>{r.status}</td>
              <td>
                {r.status === 'Pending' && (
                  <button
                    className='bg-blue-600 px-2 py-1 rounded text-xs'
                    onClick={() => markComplete(r._id)}
                  >
                    Mark Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RewardRedemptionManager;

// ✅ Manual Point Adjustment Page
import React, { useState } from 'react';
import config from '../../config';
import { toast } from 'react-toastify';

const ManualPointAdjust = () => {
  const [email, setEmail] = useState('');
  const [points, setPoints] = useState(0);
  const [note, setNote] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${config.BACKEND_URL}/user/admin/adjust-points`, {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, points, note }),
      });
      const data = await res.json();
      if (data.status === 'success') toast.success('Points updated');
      else toast.error(data.message);
    } catch {
      toast.error('Failed to adjust points');
    }
  };

  return (
    <div className='p-6 text-white'>
      <h2 className='text-xl font-bold mb-4'>Manual Point Adjustment</h2>
      <input
        placeholder='User Email'
        value={email}
        onChange={e => setEmail(e.target.value)}
        className='block bg-gray-800 p-2 rounded w-full mb-3 text-white'
      />
      <input
        type='number'
        placeholder='Points (+/-)'
        value={points}
        onChange={e => setPoints(Number(e.target.value))}
        className='block bg-gray-800 p-2 rounded w-full mb-3 text-white'
      />
      <input
        placeholder='Note (optional)'
        value={note}
        onChange={e => setNote(e.target.value)}
        className='block bg-gray-800 p-2 rounded w-full mb-3 text-white'
      />
      <button
        onClick={handleSubmit}
        className='bg-green-600 px-4 py-2 rounded hover:bg-green-700'
      >
        Submit
      </button>
    </div>
  );
};

export default ManualPointAdjust;


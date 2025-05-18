// ✅ Point Rules Editor Page
import React, { useEffect, useState } from 'react';
import config from '../../config';
import { toast } from 'react-toastify';

const PointRulesEditor = () => {
  const [rules, setRules] = useState([]);

  const fetchRules = () => {
    fetch(`${config.BACKEND_URL}/user/admin/point-rules`, {
      headers: { Authorization: localStorage.getItem('token') },
    })
      .then(res => res.json())
      .then(data => setRules(data.rules));
  };

  const updateRule = async (id, value) => {
    try {
      const res = await fetch(`${config.BACKEND_URL}/user/admin/point-rules`, {
        method: 'PUT',
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, value }),
      });
      const data = await res.json();
      if (data.status === 'success') toast.success('Updated');
      else toast.error(data.message);
      fetchRules();
    } catch {
      toast.error('Failed to update');
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return (
    <div className='p-6 text-white'>
      <h2 className='text-xl font-bold mb-4'>Point Rules Editor</h2>
      {rules.map(rule => (
        <div key={rule._id} className='mb-4'>
          <label className='block mb-1'>{rule.key}</label>
          <input
            type='number'
            value={rule.value}
            onChange={e => updateRule(rule._id, parseInt(e.target.value))}
            className='bg-gray-800 p-2 rounded w-40 text-white'
          />
        </div>
      ))}
    </div>
  );
};

export default PointRulesEditor;

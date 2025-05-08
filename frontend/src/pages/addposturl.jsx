import React, { useState, useEffect } from 'react';
import {useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../config';

const AddPostUrl = () => {
  const { campaignId } = useParams();
  const { state } = useLocation();
  const campaignTitle = state?.campaignTitle ?? 'Untitled Campaign';
  const [rows, setRows] = useState([{ instagram: '', tiktok: '' }]);
  const [allowReuse, setAllowReuse] = useState(false);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // helper to get auth header
  const getAuthHeader = () => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    return { Authorization: token || '' };
  };

  // Fetch existing submission on mount
  useEffect(() => {
    const fetchSubmission = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${config.BACKEND_URL}/user/campaign-submission/${campaignId}`,
          { headers: getAuthHeader() }
        );
        if (res.data.status === 'success') {
          const { instagram_urls = [], tiktok_urls = [], allow_brand_reuse } = res.data.data;
          const max = Math.max(instagram_urls.length, tiktok_urls.length, 1);
          setRows(
            Array.from({ length: max }, (_, i) => ({
              instagram: instagram_urls[i] || '',
              tiktok: tiktok_urls[i] || '',
            }))
          );
          setAllowReuse(!!allow_brand_reuse);
          setExists(true);
        } else {
          setRows([{ instagram: '', tiktok: '' }]);
          setAllowReuse(false);
          setExists(false);
        }
      } catch (err) {
        console.error(err);
        setError('Could not load your submission.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [campaignId]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setError('');
    setIsModalOpen(false);
  };

  const handleChange = (idx, field, value) => {
    setRows(rows.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  };

  const addRow = () => setRows([...rows, { instagram: '', tiktok: '' }]);
  const removeRow = (idx) => setRows(rows.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setLoading(true);
    setError('');
    const instagram_urls = rows.map(r => r.instagram.trim()).filter(Boolean);
    const tiktok_urls   = rows.map(r => r.tiktok.trim()).filter(Boolean);

    const payload = {
      campaign_id: campaignId,
      instagram_urls,
      tiktok_urls,
      allow_brand_reuse: allowReuse,
    };

    try {
      if (exists) {
        // UPDATE
        await axios.put(
          `${config.BACKEND_URL}/user/campaign-submission/${campaignId}`,
          payload,
          { headers: getAuthHeader() }
        );
      } else {
        // CREATE
        await axios.post(
          `${config.BACKEND_URL}/user/campaign-submission`,
          payload,
          { headers: getAuthHeader() }
        );
        setExists(true);
      }
      closeModal();
    } catch (err) {
      console.error(err);
      setError('Save failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your submission?')) return;
    setLoading(true);
    setError('');
    try {
      await axios.delete(
        `${config.BACKEND_URL}/user/campaign-submission/${campaignId}`,
        { headers: getAuthHeader() }
      );
      setRows([{ instagram: '', tiktok: '' }]);
      setAllowReuse(false);
      setExists(false);
    } catch (err) {
      console.error(err);
      setError('Delete failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="w-full lg:w-3/4 bg-gray-900 rounded-lg shadow-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white">Campaign Name - {campaignTitle}</h2>
          <div className="space-x-2">
            {exists && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
              >
                {loading ? 'Deleting…' : 'Delete All'}
              </button>
            )}
            <button
              onClick={openModal}
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-full font-bold"
            >
              {exists ? 'Edit Submission' : '+ Add URLs'}
            </button>
          </div>
        </div>

        {error && <p className="text-red-400">{error}</p>}

        {loading && !isModalOpen ? (
          <p className="text-gray-400 text-center">Loading…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-200">Instagram</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-200">TikTok</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-200">Allow Reuse</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx} className="border-t border-gray-700 hover:bg-gray-700">
                    <td className="px-6 py-4 text-gray-100 break-all">
                      {row.instagram || <span className="text-gray-500 italic">–</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-100 break-all">
                      {row.tiktok || <span className="text-gray-500 italic">–</span>}
                    </td>
                    {idx === 0 && (
                      <td className="px-6 py-4 text-gray-100">
                        {allowReuse ? 'Yes' : 'No'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---------- Modal ---------- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-xl shadow-2xl w-full max-w-3xl space-y-4">
            <h3 className="text-2xl font-semibold">
              {exists ? 'Edit Content URLs' : 'Add Content URLs'}
            </h3>

            {error && <p className="text-red-400">{error}</p>}

            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-medium">Instagram URL</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">TikTok URL</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="px-4 py-2">
                        <input
                          type="url"
                          placeholder="https://instagram.com/..."
                          value={row.instagram}
                          onChange={e => handleChange(idx, 'instagram', e.target.value)}
                          className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="url"
                          placeholder="https://tiktok.com/..."
                          value={row.tiktok}
                          onChange={e => handleChange(idx, 'tiktok', e.target.value)}
                          className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        {rows.length > 1 && (
                          <button
                            onClick={() => removeRow(idx)}
                            className="text-red-500 hover:text-red-400 font-bold"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="px-4 py-3 bg-gray-800">
                      <button
                        onClick={addRow}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
                      >
                        + Add another row
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex items-center space-x-3">
              <input
                id="allowReuse"
                type="checkbox"
                checked={allowReuse}
                onChange={() => setAllowReuse(!allowReuse)}
                className="h-5 w-5 text-yellow-500 bg-gray-700 rounded"
              />
              <label htmlFor="allowReuse" className="text-gray-300">
                Allow brand reuse
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 rounded font-bold"
              >
                {loading ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPostUrl;

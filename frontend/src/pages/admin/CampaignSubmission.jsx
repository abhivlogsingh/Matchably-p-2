import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { AiOutlineArrowLeft } from "react-icons/ai";
import config from "../../config";

const PLATFORMS = [
  { key: "instagram_urls", label: "Instagram", colorClass: "text-purple-400" },
  { key: "tiktok_urls", label: "TikTok", colorClass: "text-pink-400" },
];

const CampaignSubmission = () => {
  const { campaignId, email } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [user, setUser] = useState(null);
  const [contentStatus, setContentStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const goBack = () => navigate(-1);

useEffect(() => {
  if (!campaignId || !email) return;

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const token = Cookies.get("AdminToken");
      if (!token) throw new Error("Admin token missing");

      // ✅ 1. Always fetch userRes
      const userRes = await axios.get(
        `${config.BACKEND_URL}/admin/users/${encodeURIComponent(email)}`,
        { headers: { Authorization: token } }
      );
      if (userRes.data.status === "success") {
        setUser(userRes.data.user);
      } else {
        console.warn("User not found:", email);
      }

      // ✅ 2. Then try to fetch submissionRes
      try {
        const submissionRes = await axios.get(
          `${config.BACKEND_URL}/user/admin/submission/${campaignId}/${encodeURIComponent(email)}`,
          { headers: { Authorization: token } }
        );

        if (submissionRes.data.status === "success") {
          const submissionData = submissionRes.data.data;
          setSubmission(submissionData);

          const statusMap = {};
          PLATFORMS.forEach(({ key }) => {
            const urls = submissionData[key] || [];
            statusMap[key] = urls.map(() => "Pending");
          });
          setContentStatus(statusMap);
        } else {
          throw new Error(submissionRes.data.message || "Failed to load submission");
        }

      } catch (subErr) {
        console.warn("Submission fetch failed:", subErr);
        // ❗ Don't set full error here. Let user section still show.
      }

    } catch (err) {
      console.error("User fetch failed:", err);
      setError("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [campaignId, email]);


  const handleStatusChange = (platformKey, index, value) => {
    setContentStatus(prev => ({
      ...prev,
      [platformKey]: prev[platformKey].map((val, idx) =>
        idx === index ? value : val
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = Cookies.get("AdminToken");
      if (!token) throw new Error("Admin token missing");

      const res = await axios.post(
        `${config.BACKEND_URL}/user/admin/submission/update-status`,
        { campaignId, email, contentStatus },
        { headers: { Authorization: token } }
      );

      if (res.data.status === "success") {
        alert("Statuses updated!");
        navigate(-1);
      } else {
        alert(res.data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving content statuses");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center mb-6 space-x-3">
        <button
          onClick={goBack}
          className="inline-flex items-center bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg"
        >
          <AiOutlineArrowLeft size={18} />
          <span className="ml-1">Back</span>
        </button>
        <h1 className="text-2xl font-bold">Campaign Submission Details</h1>
      </div>

      {/* User Info Card */}
{user && (
  <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-5 mb-6 shadow">
    <h2 className="text-xl font-bold mb-4 text-white">User Details</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
      <div>
        <strong className="text-white">Name:</strong> {user.name}
      </div>
      <div>
        <strong className="text-white">Email:</strong> {user.email}
      </div>
      <div>
        <strong className="text-white">Instagram ID:</strong>{" "}
        {user.instagramId ? (
          <a
            href={`https://instagram.com/${user.instagramId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            @{user.instagramId}
          </a>
        ) : (
          "N/A"
        )}
      </div>
      <div>
        <strong className="text-white">TikTok ID:</strong>{" "}
        {user.tiktokId ? (
          <a
            href={`https://tiktok.com/@${user.tiktokId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            @{user.tiktokId}
          </a>
        ) : (
          "N/A"
        )}
      </div>
    </div>
  </div>
)}


      {/* Submission UI */}
      {loading ? (
        <p className="text-gray-400">Loading submission…</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : !submission ? (
        <p className="text-gray-400">No submission found.</p>
      ) : (
        <div className="bg-[#1f1f1f] p-6 rounded-xl shadow-lg border border-gray-700 space-y-6">
          {PLATFORMS.map(({ key, label, colorClass }) => (
            <div key={key}>
              <h2 className={`font-semibold mb-2 text-lg ${colorClass}`}>{label}</h2>
              {submission[key]?.length > 0 ? (
                <ul className="space-y-4">
                  {submission[key].map((url, i) => (
                    <li
                      key={i}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-800 p-4 rounded-lg border border-gray-700"
                    >
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline break-all"
                      >
                        {url}
                      </a>
                      <select
                        value={contentStatus[key]?.[i] || "Pending"}
                        onChange={(e) => handleStatusChange(key, i, e.target.value)}
                        className="bg-gray-900 border border-gray-600 px-3 py-2 rounded-lg text-white"
                      >
                        <option value="Pending">⏳ Pending</option>
                        <option value="Approved">✅ Approved</option>
                        <option value="Rejected">❌ Rejected</option>
                      </select>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No URLs submitted</p>
              )}
            </div>
          ))}

          {/* Reuse, Status, Submitted At */}
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-700 mt-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-green-400 w-40">Brand Reuse Allowed:</span>
              <span className={submission.allow_brand_reuse ? "text-green-300" : "text-red-300"}>
                {submission.allow_brand_reuse ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-yellow-400 w-40">Submission Status:</span>
              <span className="capitalize">{submission.status}</span>
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <span className="font-semibold text-cyan-300">Submitted At:</span>
              <span>
                {new Date(submission.submitted_at).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 text-right">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
            >
              {saving ? "Saving..." : "Save & Update Status"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignSubmission;

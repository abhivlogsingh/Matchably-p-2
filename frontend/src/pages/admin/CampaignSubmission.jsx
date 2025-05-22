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

          setContentStatus({
    content_status: submissionData.content_status || "Pending",
  });

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


const handleSave = async () => {
  setSaving(true);
  try {
    const token = Cookies.get("AdminToken");
    if (!token) throw new Error("Admin token missing");

    const status = contentStatus?.content_status;
    if (!status) {
      alert("Please select a content status.");
      setSaving(false);
      return;
    }

    const payload = {
      campaignId,
      email,
      contentStatus: { content_status: status }, // ✅ match backend shape
    };

    const res = await axios.post(
      `${config.BACKEND_URL}/user/admin/submission/update-status`,
      payload,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (res.data.status === "success") {
      alert("Status updated successfully!");
    } else {
      alert(res.data.message || "Failed to update status");
    }
  } catch (err) {
    console.error("Error while saving content status:", err);
    alert("Something went wrong while saving status.");
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
        <strong className="text-white">Points:</strong> {user.points || 'NA'}
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
  <table className="w-full table-auto text-left text-white border border-gray-700 rounded-xl overflow-hidden">
    <tbody className="divide-y divide-gray-700">
      {PLATFORMS.map(({ key, label }) => {
        const platform = key.split("_")[0];
        const urls = submission[key] || [];
        return (
          <tr key={key} className="align-top">
            <td className="w-40 p-3 font-semibold">{label}</td>
            <td className="p-3 space-y-2">
              {urls.length > 0 ? (
                urls.map((url, i) => (
                  <div
                    key={i}
                    className="bg-gray-800 text-blue-400 p-2 rounded-md border border-gray-700 break-all"
                  >
                    <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {url}
                    </a>
                  </div>
                ))
              ) : (
                <span className="italic text-gray-500">No URLs submitted</span>
              )}
            </td>
          </tr>
        );
      })}

      <tr>
        <td className="w-40 p-3 font-semibold text-green-400">Brand Reuse</td>
        <td className="p-3 text-green-300">
          {submission.allow_brand_reuse ? "Yes" : "No"}
        </td>
      </tr>

      <tr>
  <td className="w-40 p-3 font-semibold text-yellow-400">Content Status</td>
  <td className="p-3">
    <select
      value={contentStatus?.content_status || "Pending"}
      onChange={(e) =>
        setContentStatus((prev) => ({ ...prev, content_status: e.target.value }))
      }
      className="bg-gray-900 border border-gray-600 px-3 py-2 rounded-lg text-white"
    >
      <option value="Pending">⏳ Pending</option>
      <option value="Approved">✅ Approved</option>
      <option value="Rejected">❌ Rejected</option>
    </select>
  </td>
</tr>



      <tr>
        <td className="w-40 p-3 font-semibold text-cyan-300">Submitted At</td>
        <td className="p-3">
          {new Date(submission.submitted_at).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </td>
      </tr>
    </tbody>
  </table>

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

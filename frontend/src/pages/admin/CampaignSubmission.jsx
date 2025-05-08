import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { AiOutlineArrowLeft } from "react-icons/ai";
import config from "../../config";

const PLATFORMS = [
  { key: "instagram_urls", label: "Instagram", colorClass: "text-purple-400" },
  { key: "tiktok_urls",    label: "TikTok",    colorClass: "text-pink-400"   },
];

const CampaignSubmission = () => {
  const { campaignId, email } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  const goBack = () => navigate(-1);

  useEffect(() => {
    if (!campaignId || !email) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("AdminToken");
        if (!token) throw new Error("Admin token missing");

        const res = await axios.get(
          `${config.BACKEND_URL}/user/admin/submission/${campaignId}/${encodeURIComponent(email)}`,
          { headers: { Authorization: token } }
        );

        if (res.data.status === "success") {
          setSubmission(res.data.data);
        } else {
          setError(res.data.message || "Failed to load submission");
        }
      } catch (e) {
        console.error(e);
        setError("Unable to fetch submission");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [campaignId, email]);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center mb-6 space-x-3">
        <button
          onClick={goBack}
          className="inline-flex items-center bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition"
        >
          <AiOutlineArrowLeft size={18} /> <span className="ml-1">Back</span>
        </button>
        <h1 className="text-2xl font-bold">Campaign Submission Details</h1>
      </div>

      {/* Loading / Error */}
      {loading ? (
        <p className="text-gray-400">Loading submission…</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : !submission ? (
        <p className="text-gray-400">No submission found.</p>
      ) : (
        /* Details Card */
        <div className="bg-[#1f1f1f] p-6 rounded-xl shadow-lg border border-gray-700 space-y-4">
          {/* URL Platforms */}
          {PLATFORMS.map(({ key, label, colorClass }) => (
            <div key={key} className="flex">
              <div className={`w-1/3 font-semibold ${colorClass}`}>{label}</div>
              <div className="w-2/3">
                {submission[key]?.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {submission[key].map((url, i) => (
                      <li key={i}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline break-all"
                        >
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500 italic">No URLs</span>
                )}
              </div>
            </div>
          ))}

          {/* Brand Reuse */}
          <div className="flex">
            <div className="w-1/3 font-semibold text-green-400">
              Brand Reuse Allowed
            </div>
            <div className="w-2/3">
              {submission.allow_brand_reuse ? (
                <span className="text-green-300">Yes</span>
              ) : (
                <span className="text-red-300">No</span>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex">
            <div className="w-1/3 font-semibold text-yellow-400">Status</div>
            <div className="w-2/3 capitalize">{submission.status}</div>
          </div>

          {/* Submitted At */}
          <div className="flex">
            <div className="w-1/3 font-semibold text-cyan-400">
              Submitted At
            </div>
            <div className="w-2/3">
              {new Date(submission.submitted_at).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignSubmission;

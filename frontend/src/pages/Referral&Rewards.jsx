import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import config from "../config";

const ReferralRewards = () => {
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState(null);
  const [pointData, setPointData] = useState(null);
  const [redeemLoading, setRedeemLoading] = useState(null);

  useEffect(() => {
    fetchReferral();
    fetchPoints();
  }, []);

  const fetchReferral = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("User not logged in");

    try {
      const res = await fetch(`${config.BACKEND_URL}/user/campaigns/referral`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (data.status === "success") {
        setReferralData(data);
      } else {
        toast.error(data.message || "Failed to fetch referral data");
      }
    } catch {
      toast.error("Error loading referral info");
    }
  };

  const fetchPoints = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("User not logged in");

    try {
      const res = await fetch(`${config.BACKEND_URL}/user/campaigns/points`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (data.status === "success") {
        setPointData(data);
      } else {
        toast.error(data.message || "Failed to fetch points data");
      }
    } catch {
      toast.error("Error loading point data");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (tierId) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("User not logged in");

    try {
      setRedeemLoading(tierId);
      const res = await fetch(`${config.BACKEND_URL}/user/campaigns/redeem`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tierId }),
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success(data.message || "Reward requested");
        fetchPoints(); // Refresh point balance and history
      } else {
        toast.error(data.message || "Redeem failed");
      }
    } catch {
      toast.error("Redeem failed");
    } finally {
      setRedeemLoading(null);
    }
  };

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-white">
      <Helmet>
        <title>Referral & Rewards | Matchably</title>
      </Helmet>

      <h2 className="text-2xl font-bold mb-6">Referral & Rewards</h2>

      {/* Referral Section */}
      <div className="bg-[#1c1c1c] p-5 rounded-lg mb-10">
        <h3 className="text-lg font-semibold mb-2">Your Referral Link</h3>

        <div className="flex items-center gap-2">
          <input
            className="bg-gray-800 p-2 rounded w-full"
            value={referralData?.referralLink || ""}
            readOnly
          />
          <button
            className="bg-indigo-600 px-3 py-1 rounded"
            onClick={() => {
              if (referralData?.referralLink) {
                navigator.clipboard.writeText(referralData.referralLink);
                toast.success("Link copied");
              }
            }}
          >
            Copy
          </button>
        </div>

        <p className="mt-3 text-sm text-gray-400">Progress: {referralData?.progress}</p>

        <table className="w-full text-sm mt-5">
          <thead>
            <tr className="text-left border-b border-gray-600">
              <th>Email</th>
              <th>Status</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(referralData?.table) && referralData.table.length > 0 ? (
              referralData.table.map((entry, i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td>{entry.email}</td>
                  <td>{entry.status}</td>
                  <td>{entry.points}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 py-4">
                  No referrals yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Points Section */}
      <div className="bg-[#1c1c1c] p-5 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          Your Points: <span className="text-green-400">{pointData?.points}</span>
        </h3>

        {/* Redeemable Tiers */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(pointData?.progress) && pointData.progress.map((tier) => (
            <div key={tier._id} className="bg-[#2a2a2a] p-4 rounded shadow flex flex-col justify-between">
              <div>
                <p className="font-semibold">{tier.points} Points</p>
                <p className="text-sm text-gray-400">Reward: {tier.reward}</p>
              </div>
              <button
                className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
                disabled={pointData.points < tier.points || redeemLoading === tier._id}
                onClick={() => handleRedeem(tier._id)}
              >
                {redeemLoading === tier._id ? "Processing..." : "Redeem"}
              </button>
            </div>
          ))}
        </div>

        {/* Points History */}
        <div className="mt-8">
          <h4 className="font-semibold mb-2">Point History</h4>
          <ul className="space-y-2">
            {Array.isArray(pointData?.history) && pointData.history.length > 0 ? (
              pointData.history.map((item, i) => (
                <li
                  key={item._id || i}
                  className="text-sm text-gray-300 border-b border-gray-700 pb-2"
                >
                  {item.note} - <strong>{item.points} pts</strong>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No point activity yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReferralRewards;

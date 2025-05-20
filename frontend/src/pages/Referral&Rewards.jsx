import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import config from "../config";
import Cookies from "js-cookie";
import { FaCopy, FaGift, FaLink, FaStar } from "react-icons/fa";

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
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      toast.error("User not logged in");
      return;
    }

    try {
      const res = await fetch(`${config.BACKEND_URL}/user/campaigns/referral`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (data.status === "success") setReferralData(data);
      else toast.error(data.message || "Failed to fetch referral data");
    } catch {
      toast.error("Error loading referral info");
    }
  };

  const fetchPoints = async () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      toast.error("User not logged in");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${config.BACKEND_URL}/user/campaigns/points`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (data.status === "success") setPointData(data);
      else toast.error(data.message || "Failed to fetch points data");
    } catch {
      toast.error("Error loading point data");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (tierId) => {
    const token = Cookies.get("token") || localStorage.getItem("token");
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
        fetchPoints(); // Refresh
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

      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaGift className="text-yellow-400" /> Referral & Rewards
      </h2>

      {/* Referral Section */}
      <div className="bg-[#1c1c1c] p-5 rounded-lg mb-10 shadow-md">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <FaLink className="text-blue-400" /> Your Referral Link
        </h3>

        <div className="flex items-center gap-2">
          <input
            className="bg-gray-800 p-2 rounded w-full text-sm"
            value={referralData?.referralLink || ""}
            readOnly
          />
          <button
            className="bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded flex items-center gap-1 text-sm"
            onClick={() => {
              if (referralData?.referralLink) {
                navigator.clipboard.writeText(referralData.referralLink);
                toast.success("Link copied");
              }
            }}
          >
            <FaCopy /> Copy
          </button>
        </div>

        <p className="mt-3 text-sm text-gray-400">
          Progress: <strong>{referralData?.progress || "0 / 3"}</strong>
        </p>

        <table className="w-full text-sm mt-5">
          <thead>
            <tr className="text-left border-b border-gray-600 text-gray-300">
              <th className="py-2">Email</th>
              <th>Status</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(referralData?.table) && referralData.table.length > 0 ? (
              referralData.table.map((entry, i) => (
                <tr key={i} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="py-2">{entry.email}</td>
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

      {/* Points & Redeem Section */}
      <div className="bg-[#1c1c1c] p-5 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaStar className="text-yellow-500" /> Your Points:{" "}
          <span className="text-green-400 ml-1">{pointData?.points}</span>
        </h3>

        {/* Redeemable Tiers */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Array.isArray(pointData?.progress) && pointData.progress.map((tier) => (
            <div key={tier._id} className="bg-[#2a2a2a] p-4 rounded shadow-md">
              <p className="font-semibold text-lg mb-1">{tier.points} Points</p>
              <p className="text-sm text-gray-400 mb-3">Reward: {tier.reward}</p>
              <button
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm w-full"
                disabled={pointData.points < tier.points || redeemLoading === tier._id}
                onClick={() => handleRedeem(tier._id)}
              >
                {redeemLoading === tier._id ? "Processing..." : "Redeem"}
              </button>
            </div>
          ))}
        </div>

        {/* Point History Table */}
        <h4 className="font-semibold mb-3 text-gray-200">Point History</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-700">
            <thead className="bg-gray-700 text-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Note</th>
                <th className="py-2 px-4 text-left">Source</th>
                <th className="py-2 px-4 text-left">Points</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(pointData?.history) && pointData.history.length > 0 ? (
                pointData.history.map((item, i) => (
                  <tr key={item._id || i} className="border-t border-gray-700">
                    <td className="py-2 px-4">{new Date(item.createdAt).toLocaleString()}</td>
                    <td className="py-2 px-4">{item.note}</td>
                    <td className="py-2 px-4 capitalize">{item.source?.replace('-', ' ')}</td>
                    <td className="py-2 px-4 font-semibold">{item.points}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-4">
                    No point activity yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReferralRewards;

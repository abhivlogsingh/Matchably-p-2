// ✅ Reward Redemption Manager (Full UI + Logic)

import React, { useEffect, useState } from "react";
import config from "../../config";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const RewardRedemptionManager = () => {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteMap, setNoteMap] = useState({});
  const token = Cookies.get("AdminToken") || localStorage.getItem("token");

  // Fetch redemptions
  const fetchRedemptions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${config.BACKEND_URL}/admin/referrel/rewards/redemptions`, {
        headers: {
          Authorization: token,
        },
      });
      const data = await res.json();
      if (data.status === "success") {
        setRedemptions(data.redemptions || []);
      } else {
        toast.error(data.message || "Failed to load redemptions");
      }
    } catch {
      toast.error("Error fetching redemptions");
    } finally {
      setLoading(false);
    }
  };

  // Mark as complete
  const markComplete = async (id, note = "") => {
    console.log("🔥 Button clicked for:", id, "with note:", note);
    try {
      const res = await fetch(`${config.BACKEND_URL}/admin/referrel/rewards/redemptions/${id}/complete`, {
        method: "PATCH",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminNote: note }),
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success("Marked as complete");
        fetchRedemptions();
      } else {
        toast.error(data.message || "Failed to update");
      }
    } catch {
      toast.error("Failed to mark as complete");
    }
  };

  useEffect(() => {
    fetchRedemptions();
  }, []);

  if (loading) return <div className="text-white text-center">Loading...</div>;

  return (
    <div className="p-6 text-white max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reward Redemptions</h2>

      {redemptions.length === 0 ? (
        <div className="text-gray-400">No redemption requests found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-700">
            <thead className="bg-gray-800">
              <tr className="text-left">
                <th className="p-2">User</th>
                <th className="p-2">Email</th>
                <th className="p-2">Reward</th>
                <th className="p-2">Points Used</th>
                <th className="p-2">Status</th>
                <th className="p-2">Admin Note</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {redemptions.map((r, i) => (
                <tr key={r.id} className="border-t border-gray-700">
                  <td className="p-2">{r.user}</td>
                  <td className="p-2">{r.email}</td>
                  <td className="p-2">{r.reward}</td>
                  <td className="p-2">{r.pointsUsed}</td>
                  <td className="p-2 capitalize">{r.status}</td>
                  <td className="p-2">
                    {r.status === "Pending" ? (
                      <input
                        type="text"
                        placeholder="Add note"
                        value={noteMap[r.id] || ""}
                        onChange={(e) =>
                          setNoteMap((prev) => ({ ...prev, [r.id]: e.target.value }))
                        }
                        className="text-black text-xs p-1 rounded w-full"
                      />
                    ) : (
                      <span className="text-gray-400">{r.adminNote || "-"}</span>
                    )}
                  </td>
                  <td className="p-2">
  {r.status?.toLowerCase() === "pending" ? (
    <button
      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
      onClick={() => markComplete(r.id, noteMap[r.id] || "")}
    >
      Mark Complete
    </button>
  ) : (
    <span className="text-green-400 font-semibold">Completed</span>
  )}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RewardRedemptionManager;

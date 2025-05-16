// src/pages/UserApplyCampaign.jsx
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../config";
import { Link } from "react-router-dom";

const UserApplyCampaign = () => {
  const [appliedCampaigns, setAppliedCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token") || localStorage.getItem("token");
        const res = await axios.get(
          `${config.BACKEND_URL}/user/campaigns/appliedCampaigns`,
          { headers: { authorization: token } }
        );
        if (res.data.status === "success") {
          setAppliedCampaigns(res.data.campaigns);
        }
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="flex bg-[var(--background)] justify-center w-full p-6">
      <div className="w-full lg:w-[70%] bg-[#171717] p-6 rounded-xl shadow-md border border-gray-900">
        <h2 className="text-2xl font-bold mb-4 text-gray-100">
          Applied Campaigns
        </h2>

        {loading ? (
          // show 6 skeleton rows
          <div className="w-full">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {appliedCampaigns.length > 0 ? (
              <table className="w-full border-collapse rounded-lg overflow-hidden min-w-[600px]">
                <thead>
                  <tr className="bg-[#444] text-gray-200">
                    <th className="text-left p-4 font-medium">Campaign Title</th>
                    <th className="text-left p-4 font-medium">Application Date</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-center p-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appliedCampaigns.map((c, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-gray-600 hover:bg-[#333] transition"
                    >
                      <td className="p-4 text-gray-100 whitespace-nowrap">
                        <Link to={`/campaign/${c.id}`}>{c.title}</Link>
                      </td>
                      <td className="p-4 text-gray-300 whitespace-nowrap">
                        {c.appliedAt.split("T")[0]}
                      </td>
                      <td className="p-4 font-semibold flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            c.applicationStatus === "Approved"
                              ? "bg-green-500"
                              : c.applicationStatus === "Rejected"
                              ? "bg-red-500"
                              : "bg-yellow-400"
                          }`}
                        />
                        <span
                          className={`${
                            c.applicationStatus === "Approved"
                              ? "text-green-400"
                              : c.applicationStatus === "Rejected"
                              ? "text-red-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {c.applicationStatus}
                        </span>
                        {c.applicationStatus === "Rejected" &&
                          c.showReasonToInfluencer &&
                          c.rejectionReason && (
                            <details className="ml-2 cursor-pointer text-sm text-white">
                              <summary>Why?</summary>
                              <div className="mt-1 bg-[#2a2a2a] p-2 rounded shadow text-gray-300 w-64">
                                {c.rejectionReason}
                              </div>
                            </details>
                          )}
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                       {c.applicationStatus === "Approved" && (
                         <Link
                         to={`/AddPostUrl/${c.id}`}
                         state={{ campaignTitle: c.title }}
                           className="bg-yellow-400 text-black px-4 py-2 rounded-full hover:bg-yellow-500 transition"
                         >
                           Submit Content
                         </Link>
                       )}
                     </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-300 text-center text-lg">
                No applied campaigns yet.
              </p>
            )}
          </div>
        )}

        <p className="mt-4 text-gray-400 text-sm text-center">
          *All campaign approvals will be communicated individually via email.
        </p>
      </div>
    </div>
  );
};

const Skeleton = () => (
  <div className="flex justify-between gap-4 p-4 border-b border-gray-600 animate-pulse">
    <div className="h-4 bg-gray-700 rounded w-60" />
    <div className="h-4 bg-gray-700 rounded w-40" />
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 bg-gray-500 rounded-full" />
      <div className="h-4 bg-gray-700 rounded w-32" />
    </div>
  </div>
);

export default UserApplyCampaign;

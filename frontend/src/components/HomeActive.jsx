import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import useAuthStore from "../state/atoms";
import Cookies from "js-cookie"; 

import { Link, useNavigate } from "react-router-dom";

export default function HomeActive({ detail, loading }) {
  const navigate = useNavigate();
  const [appliedCampaignIds, setAppliedCampaignIds] = useState([]);
const { isLogin } = useAuthStore();

useEffect(() => {
  if (isLogin) {
    fetchAppliedCampaigns();
  }
}, [isLogin]);

const fetchAppliedCampaigns = async () => {
  try {
    const token = Cookies.get("token") || localStorage.getItem("token");
    const res = await axios.get(`${config.BACKEND_URL}/user/campaigns/appliedCampaigns`, {
      headers: { authorization: token },
    });

    if (res.data.status === "success") {
      const ids = res.data.campaigns.map((c) => String(c.id));
      setAppliedCampaignIds(ids);
    }
  } catch (err) {
    console.error("Failed to fetch applied campaigns:", err);
  }
};

  const SkeletonLoader = () => (
    <div className="bg-[#262626eb] p-5 w-[320px] rounded-2xl px-[20px] shadow-lg animate-pulse">
      <div className="w-full h-[80px] bg-gray-600 rounded-full mb-4"></div>{" "}
      {/* logo skeleton */}
      <div className="h-6 bg-gray-600 rounded-md mb-2"></div>
      <div className="h-6 bg-gray-600 rounded-md mb-2"></div>
      <div className="h-4 bg-gray-500 rounded-md mb-1"></div>
      <div className="h-4 bg-gray-500 rounded-md mb-1"></div>
      <div className="h-4 bg-gray-500 rounded-md mb-1"></div>
      <div className="mt-3 w-full h-10 bg-gray-600 rounded-md"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-[90%] flex justify-center md:justify-around items-center flex-wrap pt-[60px] gap-10">
        {Array(3)
          .fill()
          .map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
      </div>
    );
  }

  return (
    <div className="w-[70%] flex justify-center md:justify-around items-center flex-wrap pt-[60px] gap-1">
      {detail
  .filter(item => {
    // ✅ brand must start with #
    if (!item.brand?.startsWith("#")) return false;

    const hasApplied = appliedCampaignIds.includes(String(item.id));

    const now = new Date();
    const recruitmentEnd = new Date(item.recruitmentEndDate);
    const isRecruitmentExpired = recruitmentEnd < now;
    const rawStatus = item.campaignStatus ?? item.status;
    const isDeactive = rawStatus === "Deactive" || isRecruitmentExpired;

    // ✅ hide ONLY IF user is logged in AND has not applied AND campaign is deactive
    if (isDeactive && isLogin && !hasApplied) return false;

    return true;
  })
  .slice(0, 3)
  .map((data, index) => (

        <Link
          to={`/campaign/${data.id}`}
          key={index}
          className="bg-[#262626eb] p-5 w-[320px] rounded-2xl px-[20px] shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
        >
          {/* Logo at top */}
          <div className="w-full flex justify-center mb-4">
            <img
              src={
                data.image ||
                "https://media.istockphoto.com/id/2086856987/photo/golden-shiny-vintage-picture-frame-isolated-on-white.webp?s=1024x1024&w=is&k=20&c=ZzNs8GaqtXVQt4ff1xJ77OsEmVFVRaAKC3ecLUpWvqI="
              }
              alt="Campaign Logo"
              className="w-[120px] h-[120px] rounded-full object-cover bg-white"
            />
          </div>

          {/* Brand Name */}
          <h3 className="text-[#d2d2d2] font-bold text-[14px] mb-2">
          Brand Name: {data.brand?.replace(/^#/, '') || "Unknown Brand"}
          </h3>

          {/* Product Name */}
          <h3 className="text-[#d2d2d2] font-bold text-[14px] mb-2">
            Product Name: {data.name || "Unnamed Product"}
          </h3>

          {/* SNS Platforms */}
          <p className="text-[#d2d2d2] font-bold text-[14px] mb-2">
            SNS platforms:{" "}
            {data.category && data.category.length > 0
              ? data.category.join(", ")
              : "N/A"}
          </p>

          {/* Apply by */}
          <p className="text-[#d2d2d2] font-bold text-[14px] mb-2">
            Apply by: {data.deadline ? data.deadline.split("T")[0] : "N/A"}
          </p>

          {/* Recruiting */}
          {data.recruiting > 0 && (
            <p className="text-[#d2d2d2] font-bold text-[14px] mb-2">
              Recruiting: {data.recruiting}
            </p>
          )}

{isLogin ? (
  appliedCampaignIds.includes(String(data.id)) ? (
    <button
      className="mt-3 w-full border border-gray-500 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed bg-[#444]"
      disabled
    >
      Applied
    </button>
  ) : (
    <button
      className="mt-3 w-full border-[1px] cursor-pointer text-white py-2 px-4 rounded-lg hover:bg-white hover:text-black transition-all FontNoto"
      onClick={(e) => {
        e.preventDefault();
        navigate(`/campaign/${data.id}`);
      }}
    >
      Apply Now
    </button>
  )
) : (
  <button
  className="mt-3 w-full border border-white text-white py-2 px-4 rounded-lg hover:bg-white hover:text-black transition-all font-semibold shadow-sm hover:shadow-md FontNoto"
  onClick={() => navigate("/signin")}
>
  Sign In to Apply
</button>

)}


        </Link>
      ))}
    </div>
  );
}

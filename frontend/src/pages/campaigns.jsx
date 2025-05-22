import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import config from "../config";
import useAuthStore from "../state/atoms";
import Cookies from "js-cookie"; 

const CampaignList = () => {
  const [showLimitPopupIndex, setShowLimitPopupIndex] = useState(null);
  const [appliedThisMonth, setAppliedThisMonth] = useState(0);
  const [page, setPage] = useState(1);
  const [campaigns, setCampaigns] = useState([]);
  const [loadMore, setLoadMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [moreTriggerLoading, setMoreTriggerLoading] = useState(false);
  const [appliedCampaignIds, setAppliedCampaignIds] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const { isLogin } = useAuthStore();
  const navigate = useNavigate();
  const now = new Date();

  useEffect(() => {
    setLoading(true);
    getCampaigns().then(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (isLogin) {
      fetchAppliedCampaigns();
    }
  }, [isLogin]);

  async function fetchAppliedCampaigns() {
  try {
    const token = Cookies.get("token") || localStorage.getItem("token");
    const res = await axios.get(`${config.BACKEND_URL}/user/campaigns/appliedCampaigns`, {
      headers: {
        authorization: token,
      },
    });

    if (res.data.status === "success") {
      const ids = res.data.campaigns.map((c) => String(c.id));
      setAppliedCampaignIds(ids);
      setAppliedThisMonth(res.data.appliedThisMonth || ids.length); // fallback
    }
  } catch (err) {
    console.error("Error fetching applied campaigns:", err);
  }
}


  async function getCampaigns() {
    try {
      const res = await axios.get(
        `${config.BACKEND_URL}/user/campaigns/?page=${page}`
      );
      if (res.data.status === "success") {
        setCampaigns((prev) => [...prev, ...res.data.campaigns]);
        setPage((prev) => prev + 1);
      } else {
        if (res.data.message === "No campaigns found") {
          setLoadMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  }

  const handleLoadMore = () => {
    setMoreTriggerLoading(true);
    getCampaigns().then(() => {
      setMoreTriggerLoading(false);
    });
  };

  const displayedCampaigns = campaigns.filter((c) => {
    const hasApplied = appliedCampaignIds.includes(String(c.id));
  
    const now = new Date();
    const recruitmentEnd = new Date(c.recruitmentEndDate);
    const isRecruitmentExpired = recruitmentEnd < now;
    const rawStatus = c.campaignStatus ?? c.status;
    const finalStatus = rawStatus === "Deactive" || isRecruitmentExpired ? "Deactive" : "Active";
  
    // 🚫 If user is not logged in
    if (!isLogin) {
      // show only hash campaigns
      if (!c.brand?.startsWith("#")) return false;
      return true; // show without Apply button
    }
  
    // ✅ If logged in, hide Deactive if not applied
    if (finalStatus === "Deactive" && !hasApplied) return false;
  
    return true;
  });
  
  


  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <Helmet>
        <title>Explore Campaigns | Matchably</title>
        <meta
          name="description"
          content="Browse and explore the latest campaigns to apply and grow your influence with exciting opportunities."
        />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="Campaigns, Explore, Apply Campaigns, Influencer Jobs, Matchably"
        />
        <meta property="og:title" content="Explore Campaigns | Matchably" />
        <meta
          property="og:description"
          content="Discover trending campaigns to participate in and boost your brand presence."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-center items-center flex-col">
        <h2 className="text-3xl font-semibold text-center text-gray-100 mb-6 FontNoto">
          Campaigns
        </h2>

        <div className="flex justify-center md:justify-around gap-8 flex-wrap w-[90%]">
          {displayedCampaigns.map((data, index) => (
            <div
  key={index}
  className="bg-[#262626eb] p-5 w-[320px] rounded-2xl px-[20px] shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
>
  {/* Logo at top */}
  <div className="w-full flex justify-center mb-4">
    <img
      src={
        data.image ||
        "https://media.istockphoto.com/id/2086856987/photo/golden-shiny-vintage-picture-frame-isolated-on-white.webp"
      }
      alt="Campaign Logo"
      className="w-[120px] h-[120px] rounded-full object-cover bg-white"
    />
  </div>

  {/* Brand and Product */}
  <h3 className="text-[#d2d2d2] font-bold text-[14px] mb-1">
    Brand: {data.brand?.replace(/^#/, '') || "Unknown"}
  </h3>
  <h3 className="text-[#d2d2d2] font-bold text-[14px] mb-1">
    Product: {data.name || "Unnamed"}
  </h3>

  {/* Platforms */}
  <p className="text-[#d2d2d2] text-sm mb-1">
    Platforms: {data.category?.join(", ") || "N/A"}
  </p>

  {/* Deadline */}
  <p className="text-[#d2d2d2] text-sm mb-1">
    Apply by: {data.deadline ? data.deadline.split("T")[0] : "N/A"}
  </p>

  {/* Applicants */}
  {/* {data.recruiting > 0 && (
    <p className="text-[#d2d2d2] text-sm mb-1">
      Applicants: {data.applicantsCount || 0} / {data.recruiting}
    </p>
  )} */}

  {/* Badge */}
  <span
    className={`text-xs font-bold inline-block px-3 py-1 rounded-full mb-3 ${
      data.campaignStatus === "Closed"
        ? "bg-red-600 text-white"
        : "bg-green-600 text-white"
    }`}
  >
    {data.campaignStatus || "Recruiting"}
  </span>

  {/* Button */}
  {isLogin ? (
  appliedCampaignIds.includes(String(data.id)) ? (
    <button
      className="w-full border border-gray-500 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed bg-[#444]"
      disabled
    >
      Applied
    </button>
  ) : data.campaignStatus === "Closed" ? (
    <button
      className="w-full border border-gray-500 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed bg-[#444]"
      disabled
    >
      Closed
    </button>
  ) : appliedThisMonth >= 5 ? (
  <div className="relative w-full">
    <button
      className="w-full border border-gray-500 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed bg-[#444]"
      onMouseEnter={() => setShowLimitPopupIndex(index)}
      onMouseLeave={() => setShowLimitPopupIndex(null)}
    >
      Limit Reached
    </button>
    {showLimitPopupIndex === index && (
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black text-white text-sm rounded px-3 py-2 shadow-xl z-50 w-[240px] text-center">
        You’ve reached your monthly apply limit (5 campaigns).
      </div>
    )}
  </div>
  ) : (
    <button
      className="w-full border-[1px] cursor-pointer text-white py-2 px-4 rounded-lg hover:bg-white hover:text-black transition-all FontNoto"
      onClick={() => navigate(`/campaign/${data.id}`)}
    >
      Apply Now
    </button>
  )
) : (
  <button
    className="w-full border border-white text-white py-2 px-4 rounded-lg hover:bg-white hover:text-black transition-all font-semibold shadow-sm hover:shadow-md FontNoto"
    onClick={() => navigate("/signin")}
  >
    Sign In to Apply
  </button>
)}

</div>

          ))}
          {loading &&
            [...Array(6)].map((_, i) => <CampaignCardSkeleton key={i} />)}
        </div>

        {!isLogin && (
          <p className="text-sm text-gray-400 mt-4 text-center">
            Sign up to see all available campaigns.
          </p>
        )}

        {isLogin && loadMore && (
          <button
            onClick={handleLoadMore}
            disabled={moreTriggerLoading}
            className="bg-black cursor-pointer p-2 px-4 mt-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 FontNoto text-white"
          >
            {moreTriggerLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white mx-auto"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4m15 0h4m-3.78-7.78l-2.83 2.83M7.05 16.95l-2.83 2.83"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              "Load More"
            )}
          </button>
        )}

        {!loadMore && isLogin && (
          <p className="text-gray-400 text-center w-full mt-4 FontNoto">
            No more campaigns available.
          </p>
        )}
      </div>
    </div>
  );
};

const CampaignCardSkeleton = () => {
  return (
    <div className="bg-gradient-to-r from-[#272727] via-[#101010] to-[#262626] p-6 rounded-lg shadow-lg w-[300px] animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-12 bg-gray-300 rounded w-full mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3 mt-6"></div>
    </div>
  );
};

export default CampaignList;

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAuthStore from "../state/atoms";
import { useNavigate } from "react-router-dom";
import config from "../config";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SubmitApplication from "../components/application/submitApplication";
import SuccessPopup from "../components/successPopup";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";

const CampaignDetail = () => {
  const [loading, setloading] = useState(true);
  const [campaign, setCampaign] = useState({});
  const Navigate = useNavigate();
  const { isLogin, User } = useAuthStore();
  const { campaignId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittedUrls, setSubmittedUrls] = useState(null);
  const [instagramUrls, setInstagramUrls] = useState("");
  const [youtubeUrls, setYoutubeUrls] = useState("");
  const [tiktokUrls, setTiktokUrls] = useState("");
  const [allowReuse, setAllowReuse] = useState(false);
  const [appliedStatus, setAppliedStatus] = useState(""); // "Approved", "Rejected", "Pending", ""
  const [applicantsCount, setApplicantsCount] = useState(0);
const [appliedThisMonth, setAppliedThisMonth] = useState(0);
const [campaignStatus, setCampaignStatus] = useState("Recruiting"); // or "Closed"


  useEffect(() => {
    if (appliedStatus === "Approved") {
      fetchSubmittedData();
    }
  }, [appliedStatus]);

  async function fetchSubmittedData() {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const res = await axios.get(
        `${config.BACKEND_URL}/user/campaign-submission/${campaignId}`,
        {
          headers: {
            Authorization: token, // <-- THIS IS IMPORTANT
          },
        }
      );

      if (res.data.status === "success") {
        setSubmittedUrls({
          instagram: res.data.data.instagram_urls,
          youtube: res.data.data.youtube_urls,
          tiktok: res.data.data.tiktok_urls,
        });
      }
    } catch (err) {
      console.error(
        "Error fetching submitted content:",
        err.response?.data || err.message
      );
    }
  }

  const handleSubmitContent = async () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${config.BACKEND_URL}/user/campaign-submission`,
        {
          campaign_id: campaignId,
          email: User.email,
          instagram_urls: instagramUrls.split(",").map((url) => url.trim()),
          youtube_urls: youtubeUrls.split(",").map((url) => url.trim()),
          tiktok_urls: tiktokUrls.split(",").map((url) => url.trim()),
          allow_brand_reuse: allowReuse,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert("Content submitted successfully!");

      // Show URLs after submit
      setSubmittedUrls({
        instagram: instagramUrls.split(",").map((url) => url.trim()),
        youtube: youtubeUrls.split(",").map((url) => url.trim()),
        tiktok: tiktokUrls.split(",").map((url) => url.trim()),
      });

      setShowSubmitModal(false); // close modal
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Something went wrong while submitting.");
    }
  };

  useEffect(() => {
    if (User?.email && campaignId) {
      getUserApplicationStatus();
    }
  }, [User, campaignId]);

  async function getUserApplicationStatus() {
  try {
    const token = Cookies.get("token") || localStorage.getItem("token");
    const res = await axios.get(`${config.BACKEND_URL}/user/campaigns/appliedCampaigns`, {
      headers: {
        authorization: token,
      },
    });

    if (res.data.status === "success") {
      setAppliedThisMonth(res.data.appliedThisMonth || 0);
      const found = res.data.campaigns.find(c => String(c.id) === String(campaignId));
      if (found) {
        setAppliedStatus(found.applicationStatus);
      }
    }
  } catch (err) {
    console.error("Error fetching applied status:", err);
  }
}


  useEffect(() => {
    getCampaign();
  }, [campaignId]);

 async function getCampaign() {
  try {
    const res = await axios.get(
      `${config.BACKEND_URL}/user/campaigns/${campaignId}/${User.email}`
    );
    if (res.data.status === "success") {
      const c = res.data.campaign;
      setCampaign(c);
      setApplicantsCount(res.data.applicantsCount || 0);
      setCampaignStatus(res.data.campaignStatus || "Recruiting");
    }
  } catch {
    // error handling
  } finally {
    setloading(false);
  }
}


  const handleOutsideClick = (e) => {
    if (e.target.id === "sidebar-overlay") {
      setIsOpen(false);
    }
  };

  let metaTags = [];

  if (campaign && !loading) {
    metaTags = [
      <meta name="robots" content="index, follow" key="robots" />,
      <meta
        property="og:title"
        content={campaign.campaignTitle || "N/A"}
        key="og-title"
      />,
      <meta
        property="og:description"
        content={campaign.productDescription || "N/A"}
        key="og-description"
      />,
    ];
  } else {
    metaTags = [
      <meta name="robots" content="noindex, nofollow" key="robots" />,
    ];
  }

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-black px-6">
      <Helmet>
        <title>{campaign.campaignTitle || "Campaign Details"}</title>
        {metaTags}
      </Helmet>
      {loading ? (
        <CampaignSkeleton />
      ) : (
        <div className="bg-gradient-to-r from-[#272727] via-[#101010] to-[#262626] shadow-lg rounded-2xl w-full max-w-[91%] min-h-[70vh]">
          <div className="flex md:items-center p-6 flex-col md:flex-row justify-center">
            {/* Image Gallery Section */}
            <div className="flex-shrink-0 md:w-1/3 md:mr-6 w-full bg-[#c5c5c508] p-[20px] rounded-4xl">
              <div className="relative aspect-square">
                {campaign.productImages?.length > 0 ? (
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation={{
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
                    }}
                    pagination={{
                      clickable: true,
                      el: ".swiper-pagination",
                      type: "bullets",
                      bulletClass: "swiper-pagination-bullet",
                      bulletActiveClass: "swiper-pagination-bullet-active",
                    }}
                    spaceBetween={0}
                    slidesPerView={1}
                    className="h-full w-full"
                  >
                    {campaign.productImages.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image}
                          alt={"N/A"}
                          className="w-full h-full object-contain rounded-2xl"
                          draggable="false"
                        />
                      </SwiperSlide>
                    ))}

                    {/* Bottom controls container */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-transparent">
                      {/* Left arrow - made smaller */}
                      <div
                        className="swiper-button-prev 
                      !static !relative !top-auto !left-auto !right-auto 
                      !mt-0 !w-6 !h-6 !bg-black/50 
                      !rounded-full !flex !items-center !justify-center 
                      [&::after]:!text-xs [&::after]:!text-white [&::after]:!font-bold"
                      />

                      {/* Pagination dots */}
                      <div
                        className="swiper-pagination 
                      !relative !bottom-auto !left-auto !w-auto
                      [&>.swiper-pagination-bullet]:!bg-black/30 [&>.swiper-pagination-bullet]:!w-2 [&>.swiper-pagination-bullet]:!h-2
                      [&>.swiper-pagination-bullet-active]:!bg-black"
                      />

                      {/* Right arrow - made smaller */}
                      <div
                        className="swiper-button-next 
                      !static !relative !top-auto !left-auto !right-auto 
                      !mt-0 !w-6 !h-6 !bg-black/50 
                      !rounded-full !flex !items-center !justify-center 
                      [&::after]:!text-xs [&::after]:!text-white [&::after]:!font-bold"
                      />
                    </div>
                  </Swiper>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100/20 rounded-lg">
                    <img
                      src={campaign.brandLogo || "/placeholder-image.jpg"}
                      alt="Brand logo"
                      className="max-h-[70%] max-w-[70%] object-contain opacity-40"
                    />
                  </div>
                )}
              </div>
            </div>
            {/* <div className="mt-4 bg-white/10 p-2 rounded-lg">
                <div className="aspect-square max-h-32 mx-auto">
                  <img
                    src={campaign.brandLogo}
                    alt="Brand logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-center text-gray-800 font-medium mt-2">
                  {campaign.brandName}
                </p>
              </div> */}

            {/* Campaign Content */}
            <div className="md:flex-1">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-200 md:mb-1 mt-[20px] md:mt-0">
                {campaign.campaignTitle || "N/A"}
              </h1>
              <p className="text-lg text-gray-300 mb-4 flex gap-[5px] items-center">
                {/* <img src={campaign.brandLogo} alt="N/A" width={20} height={20} className="rounded-full w-[30px] h-[30px] border-2 border-[#baa645] opacity-[0.8]"/> */}
                Brand : {campaign.brandName || "N/A"}
              </p>
              <p className="md:text-lg text-gray-100 mb-6 rounded-[5px]">
                {campaign.productDescription || "N/A"}
              </p>
              <p className="text-[#d2d2d2]">
                <strong>Deadline:</strong>{" "}
                {campaign.deadline ? campaign.deadline.split("T")[0] : "N/A"}
              </p>
              {/* {campaign.recruiting > 0 && (
                <p className="text-[#d2d2d2] mt-[8px]">
                  <strong>Recruiting:</strong> {campaign.recruiting}
                </p>
              )} */}
              <p className="text-[#d2d2d2] mt-[8px]">
  <strong>Applicants:</strong> {applicantsCount} / {campaign.recruiting || "N/A"}
</p>
<p className={`mt-2 font-semibold text-sm inline-block px-3 py-1 rounded-full 
  ${campaignStatus === "Closed" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
  {campaignStatus}
</p>

              <div className="flex flex-wrap gap-[20px]">
                {campaign.contentFormat?.map((content, index) => {
                  return (
                    <div
                      key={index}
                      className="flex justify-center items-center border-[1px] border-white text-white font-semibold py-1 px-8 md:w-[20%] mt-[15px] rounded-[5px]"
                    >
                      <p className="whitespace-nowrap">{content || "N/A"}</p>
                    </div>
                  );
                })}
              </div>
              {appliedStatus === "Approved" && (
                <Link to={`/AddPostUrl/${campaignId}`}>
                  <button
                    // onClick={() => setShowSubmitModal(true)}
                    className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-full hover:bg-yellow-500 mt-4"
                  >
                    + Add Post
                  </button>
                </Link>
              )}
            </div>
          </div>

          <div className="text-white rounded-2xl px-6 md:p-10 shadow-lg transition-all duration-300 pb-[30px] md:pb-auto">
            <div className="mb-3">
              <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#ffffff]">
                What You Will Get
              </h2>
              <p className="text-gray-200">
                {campaign.influencersReceive || "N/A"}
              </p>
            </div>

            <div className="mb-2">
              <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#ffffff]">
                Requirements
              </h2>
              <p className="text-gray-200">
                {campaign.participationRequirements || "N/A"}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (!isLogin) {
                    Navigate("/signin");
                    return;
                  }
                  setIsOpen(true);
                }}
               disabled={
  !!appliedStatus ||
  campaignStatus === "Closed" ||
  appliedThisMonth >= 5
}

                className={`w-full md:w-auto flex justify-center items-center font-semibold py-3 px-8 rounded-full transition-all duration-300 transform
    ${
      appliedStatus === "Approved"
        ? "bg-green-600 text-white cursor-default"
        : appliedStatus === "Rejected"
        ? "bg-red-600 text-white cursor-default"
        : appliedStatus === "Pending"
        ? "bg-yellow-400 text-black cursor-default"
        : "text-black bg-[#facc15] hover:bg-[#ffb703] hover:scale-105 hover:shadow-lg"
    } shadow-md`}
              >
                {appliedStatus === "Approved"
  ? "Approved"
  : appliedStatus === "Rejected"
  ? "Rejected"
  : appliedStatus === "Pending"
  ? "Pending"
  : campaignStatus === "Closed"
  ? "Campaign Closed"
  : appliedThisMonth >= 5
  ? "Limit Reached"
  : "Apply to this Campaign"}

              </button>
            </div>
          </div>
        </div>
      )}

      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000]">
          <div className="bg-[#1e1e1e] p-6 rounded-lg max-w-[500px] w-full shadow-xl">
            <h3 className="text-white text-xl font-semibold mb-4">
              Submit Your Content
            </h3>

            <label className="text-white block mb-1">
              Instagram URLs (comma-separated)
            </label>
            <input
              type="text"
              className="w-full p-2 mb-3 rounded bg-black/40 text-white border border-gray-500"
              value={instagramUrls}
              onChange={(e) => setInstagramUrls(e.target.value)}
            />

            <label className="text-white block mb-1">
              YouTube URLs (comma-separated)
            </label>
            <input
              type="text"
              className="w-full p-2 mb-3 rounded bg-black/40 text-white border border-gray-500"
              value={youtubeUrls}
              onChange={(e) => setYoutubeUrls(e.target.value)}
            />

            <label className="text-white block mb-1">
              TikTok URLs (comma-separated)
            </label>
            <input
              type="text"
              className="w-full p-2 mb-3 rounded bg-black/40 text-white border border-gray-500"
              value={tiktokUrls}
              onChange={(e) => setTiktokUrls(e.target.value)}
            />

            <label className="text-white flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={allowReuse}
                onChange={(e) => setAllowReuse(e.target.checked)}
              />
              I authorize the brand to reuse my submitted content.
            </label>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-white px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitContent}
                className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {isOpen && (
        <div
          id="sidebar-overlay"
          className="fixed inset-0 bg-[#0000008a] bg-opacity-50 z-9999"
          onClick={handleOutsideClick}
        ></div>
      )}
      <SubmitApplication
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        campaignId={campaignId}
        setSuccess={setSuccess}
      ></SubmitApplication>
      <SuccessPopup
        show={success}
        onClose={() => {
          setAppliedStatus("Pending");
          setCampaign((prev) => ({ ...prev, applied: true }));
          setSuccess(false);
        }}
      ></SuccessPopup>
    </div>
  );
};

const CampaignSkeleton = () => {
  return (
    <div className="bg-gradient-to-r from-[#272727] via-[#101010] to-[#262626] shadow-lg rounded-2xl w-full max-w-[91%] min-h-[70vh] animate-pulse">
      <div className="flex md:items-center p-6 flex-col md:flex-row justify-center">
        {/* Image Skeleton */}
        <div className="flex-shrink-0 md:w-1/3 md:mr-6 w-full aspect-square bg-gray-300 rounded-lg shadow-md"></div>

        {/* Content Skeleton */}
        <div className="md:flex-1 w-full mt-[20px] md:mt-0">
          <div className="h-8 bg-gray-300 rounded w-2/3 mb-4"></div>
          <div className="h-5 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-16 bg-gray-300 rounded w-full mb-4"></div>
          <div className="h-5 bg-gray-300 rounded w-1/3 mb-4"></div>

          <div className="w-[120px] h-10 bg-gray-300 rounded-md mt-5"></div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-white rounded-2xl px-6 md:p-10 shadow-lg transition-all duration-300 pb-[30px] md:pb-auto">
        {/* What You Will Get */}
        <div className="mb-6">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>

        {/* Requirements */}
        <div className="mb-6">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>

        {/* Button Skeleton */}
        <div className="flex justify-end">
          <div className="w-full md:w-[250px] h-12 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;

import { Link } from "react-router-dom";
import FeatureSection from "../components/FeatureSection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import HomeActive from "../components/HomeActive";
import { useEffect, useState } from "react";
import config from "../config";
import axios from "axios";
import VideoSection from "../components/VideoSection";
import { Helmet } from "react-helmet";
import Devider from "../components/Devider";
import useAuthStore from "../state/atoms"; // ✅ import zustand auth store
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLogin } = useAuthStore(); // ✅ access login state
  const navigate = useNavigate();

  const handleMoreCampaignsClick = () => {
    if (isLogin) {
      navigate('/campaigns');
    } else {
      navigate('/signin');
    }
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(
          `${config.BACKEND_URL}/user/campaigns/active`
        );
        if (res.data.status === "success") {
          setDetail(res.data.campaigns);
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
    <div className="bg-black">
       <Helmet>
        <title>Matchably</title>
        <meta property="og:title" content="Get Free Products. Make Content. Get Rewarded." />
        <meta
          name="description"
          content="Join brand campaigns and get free products for your content. Simple as that."
        />
      </Helmet>

      <HeroSection />
      <Devider />

      <div className="w-full bg-[var(--background)] flex justify-center items-center flex-col pb-10">
        <h1 className="text-[25px] md:text-[30px] text-lime-100 FontNoto mt-10 border-b w-[60%] text-center pb-3">
          Get Free Products in 3 Steps
        </h1>
        <FeatureSection />
      </div>

      <Devider />

      {(loading || detail.length > 0) && (
        <div className="w-full bg-gradient-to-r from-black to-[#080012] flex flex-col items-center pb-10">
          <h1 className="text-[25px] md:text-[30px] text-lime-100 FontNoto mt-10 border-b w-[60%] text-center pb-3">
            Open for You
          </h1>

          {/* ✅ Only show 4 campaigns */}
          <HomeActive detail={detail.slice(0, 3)} loading={loading} />

          {/* ✅ Show message if NOT logged in */}
          {!isLogin && (
            <p className="text-sm text-gray-400 mt-7">
              Sign up to see all available campaigns.
            </p>
          )}

          {/* ✅ Button redirects based on login state */}
          <button
  onClick={handleMoreCampaignsClick}
  className="mt-5 px-6 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition"
>
  More Campaigns
</button>

        </div>
      )}

      <Devider />

      <div className="bg-gradient-to-r from-black to-[#040014] text-white">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h3 className="text-[16px] md:text-2xl font-bold mb-4">
            Ready to Collaborate with Real Brands?
          </h3>
          <div className="flex justify-center md:gap-4">
            <Link
              to="/signup"
              className="border-2 border-white text-white px-4 md:px-6 py-3 md:text-lg rounded-lg hover:bg-white hover:text-black scale-[0.9]"
            >
              Join Now
            </Link>
          </div>
        </div>

        <Devider />

        <div className="w-full min-h-[100vh] bg-gradient-to-r from-black to-[#080012] flex justify-center items-center flex-col pb-10">
          <h1 className="text-[25px] md:text-[30px] text-lime-100 FontNoto mt-10 border-b w-[60%] text-center pb-3">
            Work With Us
          </h1>
          <VideoSection />
        </div>
      </div>
    </div>
  );
}

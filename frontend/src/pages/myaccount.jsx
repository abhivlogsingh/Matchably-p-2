import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { FaUser, FaEnvelope, FaInstagram, FaTiktok } from "react-icons/fa";
import config from "../config";
import { toast } from "react-toastify"; // 👈 Import toast
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const MyAccount = ({ user }) => {
  const [socialLinks, setSocialLinks] = useState({
    instagramId: user.instagramId || "",
    tiktokId: user.tiktokId || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
  try {
    const token = Cookies.get("token") || localStorage.getItem("token");
    const response = await fetch(`${config.BACKEND_URL}/user/campaigns/update-social`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token, // ✅ token
      },
      body: JSON.stringify(socialLinks),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(data.message || "Social links updated successfully!" ,{ theme: "dark" });

      // Update local user object (for instant UI update)
  user.instagramId = socialLinks.instagramId;
  user.tiktokId = socialLinks.tiktokId;
    } else {
      toast.error(data.message || "Failed to update social links.", { theme: "dark" });
    }
  } catch (error) {
    console.error("Save error:", error);
    toast.error("Something went wrong while saving.");
  }
};


  return (
    <div className="min-h-[50] bg-black flex justify-center p-6">
      <Helmet>
        <title>My Account</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-[#171717] text-gray-100 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center space-x-4 mb-6">
          <FaUser className="text-4xl text-[#134cf2]" />
          <h1 className="text-3xl font-bold text-[#134cf2]">My Profile</h1>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <FaUser className="mr-3 text-xl text-[#134cf2]" />
            <span className="font-medium">{user.name}</span>
          </div>
          <div className="flex items-center">
            <FaEnvelope className="mr-3 text-xl text-[#134cf2]" />
            <span className="font-medium break-all">{user.email}</span>
          </div>

          <h2 className="mt-6 text-xl font-semibold border-b border-gray-700 pb-2 text-[#134cf2]">
            Social Profiles
          </h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <FaInstagram className="mr-3 text-lg text-[#134cf2]" />
              <input
                type="text"
                name="instagramId"
                value={socialLinks.instagramId}
                onChange={handleChange}
                placeholder="Instagram ID"
                className="flex-1 bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#134cf2]"
              />
            </div>
            <div className="flex items-center">
              <FaTiktok className="mr-3 text-lg text-[#134cf2]" />
              <input
                type="text"
                name="tiktokId"
                value={socialLinks.tiktokId}
                onChange={handleChange}
                placeholder="TikTok ID"
                className="flex-1 bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#134cf2]"
              />
            </div>

            <button
              onClick={handleSave}
              className="mt-4 w-full bg-[#134cf2] hover:bg-[#0f3cc1] text-white font-semibold py-2 rounded transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;

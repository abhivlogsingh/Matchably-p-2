import React, { useState } from "react";
import { Helmet } from "react-helmet";
import {
  FaUser,
  FaEnvelope,
  FaInstagram,
  FaTiktok,
  FaLock,
} from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import config from "../config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const MyAccount = ({ user }) => {
  const [socialLinks, setSocialLinks] = useState({
    instagramId: user.instagramId || "",
    tiktokId: user.tiktokId || "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const response = await fetch(
        `${config.BACKEND_URL}/user/campaigns/update-social`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(socialLinks),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Social links updated!", { theme: "dark" });
        user.instagramId = socialLinks.instagramId;
        user.tiktokId = socialLinks.tiktokId;
      } else {
        toast.error(data.message || "Update failed.", { theme: "dark" });
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Something went wrong while saving.");
    }
  };

  const handlePasswordChange = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill in all password fields.");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match.");
    }

    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const response = await fetch(
        `${config.BACKEND_URL}/user/campaigns/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
  toast.success(data.message || "Password changed successfully!", {
    theme: "dark",
    autoClose: 3000,
    position: "top-right",
  });
  setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
  setIsModalOpen(false);
} else {
  toast.error(data.message || "Failed to change password.", {
    theme: "dark",
    autoClose: 3000,
    position: "top-right",
  });
}

    } catch (error) {
      console.error("Password change error:", error);
      toast.error("Something went wrong while changing the password.");
    }
  };

  return (
    <div className="min-h-[57vh] bg-black text-gray-100 p-6">
      <Helmet>
        <title>My Account</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-xl mx-auto bg-[#171717] rounded-2xl shadow-lg p-8">
        {/* Title */}
        <div className="flex items-center space-x-4 mb-8 border-b border-gray-700 pb-4">
          <FaUser className="text-4xl text-[#134cf2]" />
          <h1 className="text-3xl font-bold text-[#134cf2]">My Profile</h1>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {/* Left Side - User Info & Social */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[#134cf2] mb-2">User Info</h2>
              <div className="flex items-center mb-2">
                <FaUser className="mr-3 text-xl text-[#134cf2]" />
                <span>{user.name}</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="mr-3 text-xl text-[#134cf2]" />
                <span className="break-all">{user.email}</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#134cf2] mb-2">Social Profiles</h2>
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
                  className="w-full bg-[#134cf2] hover:bg-[#0f3cc1] text-white font-semibold py-2 rounded"
                >
                  Save Social Profiles
                </button>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-[#134cf2] hover:bg-[#0f3cc1] text-white font-semibold py-2 rounded"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Password Change */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-[#171717] text-white rounded-xl p-6 shadow-xl">
            <Dialog.Title className="text-xl font-semibold text-[#134cf2] mb-4">Change Password</Dialog.Title>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaLock className="mr-3 text-lg text-[#134cf2]" />
                <input
                  type="password"
                  placeholder="Old Password"
                  className="flex-1 bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#134cf2]"
                  value={passwords.oldPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, oldPassword: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center">
                <FaLock className="mr-3 text-lg text-[#134cf2]" />
                <input
                  type="password"
                  placeholder="New Password"
                  className="flex-1 bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#134cf2]"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center">
                <FaLock className="mr-3 text-lg text-[#134cf2]" />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="flex-1 bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#134cf2]"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirmPassword: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 rounded bg-[#134cf2] hover:bg-[#0f3cc1] text-white"
                >
                  Update Password
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default MyAccount;

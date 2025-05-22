import { useState } from "react";
import useAuthStore from "../../state/atoms";
import axios from "axios";
import Cookies from "js-cookie";
import config from "../../config";
import { toast } from "react-toastify";

const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export default function SubmitApplication({ isOpen, setIsOpen, setSuccess, campaignId }) {
  const { User } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: User.name,
    email: User.email,
    street: "",
    city: "",
    phone: "",
    state: "",
    zip: "",
    instagramId: User.instagramId,
    tiktokId: User.tiktokId,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { street, city, state, zip, instagramId, tiktokId } = formData;

    // Validate address fields
    if (!street || !city || !state || !zip) {
      toast.error("Please fill in all address fields.", { position: "top-center" });
      setLoading(false);
      return;
    }

    // Validate at least one social ID
    if (!instagramId.trim() && !tiktokId.trim()) {
      toast.error("Please provide either Instagram ID or TikTok ID.", { position: "top-center" });
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("token") || localStorage.getItem("token");

      const res = await axios.post(
        `${config.BACKEND_URL}/user/campaigns/apply`,
        {
          state,
          city,
          phone: formData.phone,
          address: street,
          zip,
          campaignId,
          instagramId,
          tiktokId,
        },
        {
          headers: { authorization: token },
        }
      );

      if (res.data.status === "success") {
        setIsOpen(false);
        setSuccess(true);
        toast.success("Application submitted successfully!", { position: "top-center" });
      } else {
        toast.error(res.data.message || "Application failed.", { position: "top-center" });
      }
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || "Something went wrong.";
      toast.error(message, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
     <div
   className={`fixed top-0 right-0 h-full max-h-screen overflow-y-auto
     bg-[#303030] text-white w-full md:w-[400px]
     transform ${ isOpen ? "translate-x-0" : "translate-x-full" }
     transition-transform duration-300 ease-in-out
     shadow-lg z-[9999] pointer-events-auto p-6`}
 >
      <h2 className="text-2xl font-bold mb-6 flex justify-between items-center">
        Apply to Campaign
        <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
          ✕
        </button>
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Name & Email (disabled) */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            disabled
            className="w-full bg-[#484848] text-[#b4b4b4] px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            disabled
            className="w-full bg-[#484848] text-[#b4b4b4] px-3 py-2 rounded-md"
          />
        </div>

        {/* Contact & Address Fields */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            maxLength={14}
            placeholder="(123) 456-7890"
            className="w-full bg-[#484848] text-[#b4b4b4] px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-300 mb-1">
            Street Address
          </label>
          <input
            id="street"
            name="street"
            type="text"
            value={formData.street}
            onChange={handleInputChange}
            placeholder="Street Address"
            required
            className="w-full bg-[#575757] px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="instagramId" className="block text-sm font-medium text-gray-300 mb-1">
            Instagram ID
          </label>
          <input
            id="instagramId"
            name="instagramId"
            type="text"
            value={formData.instagramId}
            onChange={handleInputChange}
            placeholder="Instagram ID"
            className="w-full bg-[#575757] px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="tiktokId" className="block text-sm font-medium text-gray-300 mb-1">
            TikTok ID
          </label>
          <input
            id="tiktokId"
            name="tiktokId"
            type="text"
            value={formData.tiktokId}
            onChange={handleInputChange}
            placeholder="TikTok ID"
            className="w-full bg-[#575757] px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <select
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
            className="w-full bg-[#575757] text-white px-3 py-2 rounded-md"
          >
            <option value="">Select State</option>
            {usStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            name="city"
            type="text"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="City"
            required
            className="w-full bg-[#575757] px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <input
            name="zip"
            type="text"
            value={formData.zip}
            onChange={handleInputChange}
            placeholder="Zip Code"
            pattern="^\d{5}(-\d{4})?$"
            required
            className="w-full bg-[#575757] px-3 py-2 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-lg rounded-md text-white ${
            loading ? "bg-gray-500" : "bg-yellow-500 hover:bg-yellow-400"
          }`}
        >
          {loading ? "Loading..." : "Apply"}
        </button>
      </form>
    </div>
  );
}

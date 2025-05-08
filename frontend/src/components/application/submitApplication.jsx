import { useState } from "react";
import useAuthStore from "../../state/atoms";
import axios from "axios";
import Cookies from "js-cookie"
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

export default function SubmitApplication({ isOpen, setIsOpen,setSuccess,campaignId }) {
  const { User } = useAuthStore();
  const [loading, setloading] = useState(false)
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
    setloading(true)
    e.preventDefault();
    if (
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.zip
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    console.log("Form submitted:", formData);

    try{
        const token = Cookies.get("token") || localStorage.getItem("token");
        const res = await axios.post(`${config.BACKEND_URL}/user/campaigns/apply`,{
            state: formData.state,
            city : formData.city,
            phone : formData.phone,
            address : formData.street,
            zip : formData.zip,
            campaignId,
            instagramId: formData.instagramId,
    tiktokId: formData.tiktokId,
        },{
            headers : {
                authorization: token,
            }
        })

        if(res.data.status === "success"){
            setIsOpen(false);
            setSuccess(true)
            console.log(res.data)
        }
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || "Something went wrong.";
      toast.error(message, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    finally {
        setloading(false)
    }
  };
  return (
    <div
      className={`gap-[20px] fixed top-0 right-0 h-full bg-[#303030] text-white w-full md:w-[400px] transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out shadow-lg z-9999 p-6`}
    >
      <h2 className="text-2xl font-bold mb-8 FontNoto flex justify-between items-center w-full">
        Apply to Campaign
        <button
          onClick={() => setIsOpen(false)}
          className=" text-gray-300 hover:text-white"
        >
          ✕
        </button>
      </h2>
      <form
        onSubmit={handleSubmit}
        className=" flex flex-col justify-center items-center h-[90%] "
      >
        <div className="">
        <div className="mb-3">
  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
    Name
  </label>
  <input
    id="name"
    type="text"
    name="name"
    value={formData.name}
    disabled
    className="w-full bg-[#484848] text-[#b4b4b4] px-3 py-2 rounded-md h-[60px] md:h-auto"
  />
</div>

<div className="mb-3">
  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
    Email
  </label>
  <input
    id="email"
    type="email"
    name="email"
    value={formData.email}
    disabled
    className="w-full bg-[#484848] text-[#b4b4b4] px-3 py-2 rounded-md FontLato h-[60px] md:h-auto"
  />
</div>

<div className="mb-3">
  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
    Phone Number
  </label>
  <input
    id="phone"
    type="tel"
    name="phone"
    value={formData.phone}
    onChange={handleInputChange}
    maxLength={14}
    placeholder="(123) 456-7890"
    className="w-full bg-[#484848] text-[#b4b4b4] px-3 py-2 rounded-md h-[60px] md:h-auto"
  />
</div>

<div className="mb-3">
  <label htmlFor="street" className="block text-sm font-medium text-gray-300 mb-1">
    Street Address
  </label>
  <input
    id="street"
    type="text"
    name="street"
    value={formData.street}
    onChange={handleInputChange}
    placeholder="Street Address"
    required
    className="w-full bg-[#575757] px-3 py-2 rounded-md FontLato h-[60px] md:h-auto"
  />
</div>
<div className="mb-1">
  <label htmlFor="street" className="block text-sm font-medium text-gray-300 mb-1">
   Instagram Id
  </label>
          <input
  type="text"
  name="instagramId"
  value={formData.instagramId}
  onChange={handleInputChange}
  placeholder="Instagram ID"
  className="w-full bg-[#575757] px-3 py-2 mb-3 rounded-md h-[60px] md:h-auto"
/>
</div>
<div className="mb-1">
  <label htmlFor="street" className="block text-sm font-medium text-gray-300 mb-1">
    Tiktok Id
  </label>
<input
  type="text"
  name="tiktokId"
  value={formData.tiktokId}
  onChange={handleInputChange}
  placeholder="TikTok ID"
  className="w-full bg-[#575757] px-3 py-2 mb-3 rounded-md h-[60px] md:h-auto"
/>
</div>
<div className="mb-3">
  <label htmlFor="street" className="block text-sm font-medium text-gray-300 mb-1">
   State Select
  </label>
          <select
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full bg-[#575757] text-white px-3 py-2 mb-3 rounded-md h-[60px] md:h-auto"
            required
          >
            <option value="">Select State</option>
            {usStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          </div>
          
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="City"
            className="w-full bg-[#575757] px-3 py-2 mb-3 rounded-md FontLato h-[60px] md:h-auto"
            required
          />
          <input
  type="text"
  name="zip"
  value={formData.zip}
  onChange={handleInputChange}
  placeholder="Zip Code"
  pattern="^\d{5}(-\d{4})?$"
  className="w-full bg-[#575757] px-3 py-2 mb-3 rounded-md FontLato h-[60px] md:h-auto"
  required
/>

        </div>
        <div className="flex justify-between mt-5 w-[100%]">
          <button
            type="submit"
            className={`border-none outline-none px-4 py-2 ${loading ? "bg-[gray]" : "bg-yellow-500 hover:bg-yellow-400"} text-white text-[20px] rounded-md w-[100%] h-[60px] md:h-auto md:text-[16px]`}
          >
            {loading ? "loading..." : "Apply"}
          </button>
        </div>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import config from "../../config";
import { InputField } from "./InputField";
import { HashtagsInput } from "./HashtagsInput";
import { useCompaign } from "../../state/atoms";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";
import { FileUpload } from "./FileUpload";

const formats = [
  "TikTok",
  "YouTube",
  "Instagram",
  "Instagram Posts",
  "Instagram Reels",
];
export default function EditCampaign({ setShowModal, index }) {
  const { Campaigns, EditCampaign } = useCompaign();
  const [campaign, setCampaign] = useState({
    campaignTitle: "",
    brandName: "",
    productDescription: "",
    productImage: null,
    contentFormat: [],
    requiredHashtags: [],
    recruiting: null,
    campaignIndustry: "",
    influencersReceive: "",
    deadline: "",
    recruitmentEndDate: "", // ✅ new
    status: "Active",        // ✅ new
    participationRequirements: "",
    hashtagsInput: "",
  });
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    brandLogo: 0,
    productImages: 0,
  });
  const [imagePreviews, setImagePreviews] = useState({
    brandLogo: null,
    productImages: [],
  });

  useEffect(() => {
  const selected = Campaigns[index];
  if (selected) {
    setCampaign({
      ...selected,
      hashtagsInput: selected.requiredHashtags?.join(" ") || "",
    });

    setImagePreviews({
      brandLogo: selected.brandLogo || null,
      productImages: selected.productImages || [],
    });
  }
}, [Campaigns, index]);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
  const { name, value } = e.target;
  const isNumberField = ["recruiting"].includes(name);
  setCampaign({ 
    ...campaign, 
    [name]: isNumberField ? Number(value) : value 
  });
};


  const handleHashtagsChange = (e) => {
    const inputValue = e.target.value;
    const hashtagsArray = inputValue
      .split(" ")
      .filter((tag) => tag.startsWith("#") && tag.length > 1);

    setCampaign({
      ...campaign,
      requiredHashtags: hashtagsArray,
      hashtagsInput: inputValue,
    });
  };

  
  const handleBrandLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCampaign({ ...campaign, brandLogo: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews({ ...imagePreviews, brandLogo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      for (let file of files) {
        const img = new Image();
        const imageUrl = URL.createObjectURL(file);
  
        const aspectRatioCheck = new Promise((resolve, reject) => {
          img.onload = () => {
            const width = img.width;
            const height = img.height;
            const aspectRatio = width / height;
            console.log(aspectRatio)
            if (aspectRatio !== 1) {
              reject("Please upload an image with an aspect ratio 1:1");
            } else {
              resolve();
            }
          };
  
          img.onerror = () => {
            reject("Error loading image.");
          };
  
          img.src = imageUrl;
        });
  
        try {
          await aspectRatioCheck;
        } catch (error) {
          alert(error);
          return;
        }
      }
  
      setCampaign({
        ...campaign,
        productImages: [...campaign.productImages, ...files],
      });
  
      const previews = await Promise.all(
        files.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        })
      );
  
      setImagePreviews({
        ...imagePreviews,
        productImages: [...imagePreviews.productImages, ...previews],
      });
    }
  };  

  const removeBrandLogo = () => {
    setCampaign({ ...campaign, brandLogo: null });
    setImagePreviews({ ...imagePreviews, brandLogo: null });
    setUploadProgress({ ...uploadProgress, brandLogo: 0 });
  };

  const removeProductImage = (index) => {
    const newProductImages = [...campaign.productImages];
    newProductImages.splice(index, 1);

    const newImagePreviews = [...imagePreviews.productImages];
    newImagePreviews.splice(index, 1);

    setCampaign({ ...campaign, productImages: newProductImages });
    setImagePreviews({ ...imagePreviews, productImages: newImagePreviews });
  };

  const handleUpload = async (image) => {
    const formData = new FormData();
    formData.append("image", image);
  
    try {
      const response = await axios.post(
        `${config.BACKEND_URL}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.imageUrl) {
        return response.data.imageUrl;
      }
      throw new Error("Upload failed");
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      // Handle brand logo upload
      let brandLogoUrl = campaign.brandLogo;
      if (campaign.brandLogo && typeof campaign.brandLogo !== "string") {
        brandLogoUrl = await handleUpload(campaign.brandLogo);
      }
  
      // Handle product image uploads
      let productImageUrls = [];
      for (const image of campaign.productImages || []) {
        if (typeof image === "string") {
          productImageUrls.push(image); // already uploaded
        } else {
          const url = await handleUpload(image);
          productImageUrls.push(url);
        }
      }
  
      // Prepare payload
      const formPayload = {
        campaignTitle: campaign.campaignTitle,
        brandName: campaign.brandName,
        productDescription: campaign.productDescription,
        contentFormat: campaign.contentFormat,
        requiredHashtags: campaign.requiredHashtags,
        recruiting: campaign.recruiting,
        influencersReceive: campaign.influencersReceive,
        campaignIndustry: campaign.campaignIndustry,
        deadline: campaign.deadline,
        recruitmentEndDate: campaign.recruitmentEndDate, // ✅ new
        status: campaign.status,                         // ✅ new
        participationRequirements: campaign.participationRequirements,
        brandLogo: brandLogoUrl,
        productImages: productImageUrls,
      };
      
  
      const token = Cookie.get("AdminToken");
      const response = await axios.post(
        `${config.BACKEND_URL}/admin/campaigns/editCampaign/${Campaigns[index].id}`,
        { campaign: formPayload },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
  
      if (response.data.status === "success") {
        await EditCampaign(index, formPayload);
        toast.success("Campaign updated successfully", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          setShowModal(false);
        }, 500);
      } else {
        setError(response.data.message || "Failed to update campaign");
      }
    } catch (error) {
      console.error("Error submitting campaign:", error);
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000007a] bg-opacity-80 p-4 overflow-y-auto">
      <div className="bg-black rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              Create New Campaign
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-600/20 border border-red-600 text-red-200 p-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Campaign Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2 mb-4">
                  Campaign Info
                </h3>
                <select
                      name="campaignIndustry"
                      className="w-full px-4 py-3 mb-[10px] bg-black text-white rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={campaign.campaignIndustry}
                      onChange={(e) => {
                        const { value } = e.target;
                        setCampaign(prev => ({
                          ...prev,
                          campaignIndustry: value
                        }));
                      }}
                      required
                    >
                      <option value="K-food">K-food</option>
                      <option value="K-beauty">K-beauty</option>
                    </select>
                <InputField
                  label="Campaign Title"
                  name="campaignTitle"
                  value={campaign.campaignTitle}
                  onChange={handleChange}
                  placeholder="Summer Skincare Campaign"
                  required
                />
                <InputField
                  label="Brand Name"
                  name="brandName"
                  value={campaign.brandName}
                  onChange={handleChange}
                  placeholder="Glow Beauty"
                  required
                />
                <InputField
                  label="Product Description"
                  name="productDescription"
                  value={campaign.productDescription}
                  onChange={handleChange}
                  placeholder="Calming ampoule with cica extract..."
                  textarea
                  required
                />
                 <div className="mt-4">
                    <FileUpload
                      label="Product Images"
                      onChange={handleProductImagesChange}
                      multiple
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {imagePreviews.productImages.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Product preview ${index}`}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeProductImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <FileUpload
                    label="Brand Logo"
                    onChange={handleBrandLogoChange}
                    onRemove={removeBrandLogo}
                    preview={imagePreviews.brandLogo}
                    progress={uploadProgress.brandLogo}
                  />
              </div>

              {/* Content Guidelines Section */}
              <div>
                <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2 mb-4">
                  Content Guidelines
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content Format
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  {/* <select
                    name="contentFormat"
                    className="w-full px-4 py-3 bg-black text-white rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={campaign.contentFormat}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Format</option>
                    <option value="Instagram Post">Instagram Post</option>
                    <option value="Instagram Reel">Instagram Reel</option>
                    <option value="Instagram Story">Instagram Story</option>
                    <option value="TikTok Video">TikTok Video</option>
                    <option value="YouTube Short">YouTube Short</option>
                    <option value="YouTube Video">YouTube Video</option>
                    <option value="Blog Post">Blog Post</option>
                  </select> */}

                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-black text-white rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    readOnly
                    value={campaign.contentFormat.join(", ")}
                    onClick={() => setShowDropdown(!showDropdown)}
                    placeholder="Click to select sectors"
                    required
                  />
                  {showDropdown && (
                    <div className="w-full px-4 py-3 bg-black mt-[10px] text-white rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600">
                      {formats.map((sectorName, index) => (
                        <label
                          key={index}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-[#ffffff25] p-2 rounded-md transition-colors duration-200"
                        >
                          <input
                            type="checkbox"
                            value={sectorName}
                            checked={campaign.contentFormat.includes(
                              sectorName
                            )}
                            onChange={() => {
                              console.log(sectorName);
                              setCampaign((prev) => ({
                                ...prev,
                                contentFormat: prev.contentFormat.includes(
                                  sectorName
                                )
                                  ? prev.contentFormat.filter(
                                      (format) => format !== sectorName
                                    )
                                  : [...prev.contentFormat, sectorName],
                              }));
                            }}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-100"
                          />
                          <span className="text-gray-200">{sectorName}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <HashtagsInput
                  label="Required Hashtags"
                  inputValue={campaign.hashtagsInput}
                  hashtags={campaign.requiredHashtags}
                  onChange={handleHashtagsChange}
                  required
                />
                <InputField
                  label="Recruiting"
                  name="recruiting"
                  value={campaign.recruiting}
                  onChange={handleChange}
                  placeholder=""
                  required
                  type="number"
                />
                <InputField
  label="Recruitment End Date"
  name="recruitmentEndDate"
  value={campaign.recruitmentEndDate?.split("T")[0]}
  onChange={handleChange}
  type="date"
  required
/>

<div className="mt-4">
  <label className="block text-sm font-medium text-gray-300 mb-2">
    Status <span className="text-red-500">*</span>
  </label>
  <select
    name="status"
    value={campaign.status}
    onChange={handleChange}
    required
    className="w-full px-4 py-3 bg-black text-white rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
  >
    <option value="Active">Active</option>
    <option value="Deactive">Deactive</option>
  </select>
</div>

              </div>

              {/* Offer Details Section */}
              <div>
                <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2 mb-4">
                  Offer Details
                </h3>
                <InputField
                  label="Influencers Receive"
                  name="influencersReceive"
                  value={campaign.influencersReceive}
                  onChange={handleChange}
                  placeholder="Full-size product + shipping fee covered"
                  textarea
                  required
                />
                <InputField
                  label="Content Deadline"
                  name="deadline"
                  value={campaign.deadline.split("T")[0]}
                  onChange={handleChange}
                  type="date"
                  required
                />
                <InputField
                  label="Participation Requirements"
                  name="participationRequirements"
                  value={campaign.participationRequirements}
                  onChange={handleChange}
                  placeholder="3,000+ followers, U.S.-based..."
                  textarea
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-800 mt-6">
              <button
                type="button"
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center justify-center min-w-[120px]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle
                      className="animate-spin text-gray-200"
                      size={20}
                    />
                    updating...
                  </>
                ) : (
                  "Update Campaign"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

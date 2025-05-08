import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaSearch } from "react-icons/fa";
import { useCompaign } from "../../state/atoms";
import AddCampaign from "../../components/addCampaign/addCampaign";
import config from "../../config";
import axios from "axios";
import EditCampaign from "../../components/addCampaign/editCampaign";
import { toast } from "react-toastify";
import Cookie from "js-cookie";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { AiOutlineEye } from "react-icons/ai"

export default function CampaignManagement() {
  const { Campaigns, DeleteCampaign, SetCompaigns, setToEmpty } = useCompaign();
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editModel, setEditModel] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(new Map());
  const [loadMore, setLoadMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterDeadline, setFilterDeadline] = useState("");
  const [catchBrands, setCatchBrands] = useState([]);
  // Get unique brands for filter dropdown
  const uniqueBrands = catchBrands;

  useEffect(() => {
    async function getBrands() {
      try {
        const token = await Cookie.get("AdminToken");
        const res = await axios.get(
          `${config.BACKEND_URL}/admin/campaigns/brands`,
          {
            headers: {
              authorization: token,
            },
          }
        );
        if (res.data.status === "success") {
          setCatchBrands(res.data.brands);
        }
      } catch {
        //we can handle error here
      }
    }
    getBrands();
  }, []);

  const handleDelete = async (id) => {
    const newMap = new Map(deleteLoading);
    newMap.set(id, true);
    setDeleteLoading(newMap);
    const index = await Campaigns.findIndex((camp) => camp.id === id);

    try {
      const token = Cookie.get("AdminToken");
      const res = await axios.delete(
        `${config.BACKEND_URL}/admin/campaigns/${Campaigns[index].id}`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      if (res.data.status === "success") {
        await DeleteCampaign(index);
        toast.success("Campaign deleted successfully", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch {
      toast.error("Failed to delete campaign", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      const newMap = new Map(deleteLoading);
      newMap.delete(index);
      setDeleteLoading(newMap);
    }
  };

  const handleEdit = (id) => {
    const index = Campaigns.findIndex((camp) => camp.id === id);
    setEditIndex(index);
    setEditModel(true);
  };

  const getCampaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BACKEND_URL}/admin/campaigns?page=${page}`
      );
      if (res.data.status === "success") {
        SetCompaigns(res.data.campaigns);
        setLoadMore(!res.data.isLastPage);
        if (!res.data.isLastPage) {
          setPage((prev) => prev + 1);
        }
      }
    } catch {
      toast.error("Failed to fetch campaigns", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setToEmpty();
    getCampaigns();
  }, []);

  const filteredCampaigns = Campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.brandName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filterBrand
      ? campaign.brandName === filterBrand
      : true;
    const matchesDeadline = filterDeadline
      ? {
          active: new Date(campaign.deadline) >= new Date(),
          expired: new Date(campaign.deadline) < new Date(),
        }[filterDeadline]
      : true;

    return matchesSearch && matchesBrand && matchesDeadline;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setFilterBrand("");
    setFilterDeadline("");
  };

  const Button = ({ children, onClick }) => (
    <button
      onClick={onClick}
      className='flex justify-center items-center bg-gradient-to-l from-[#7d71ff] to-[#5b25ff] hover:bg-blue-800 text-white px-4 py-2 rounded-lg gap-2 FontLato transition shadow-md'
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#121212] text-gray-200 overflow-x-hidden">
      <Helmet>
        <title>My Account</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Campaign Management</h2>
          <button
            className="flex items-center px-4 py-2 bg-[#484848] hover:bg-[#5a5a5a] text-white font-medium rounded-lg transition-all duration-200"
            onClick={() => {
              setShowModal(true);
              setEditIndex(null);
            }}
          >
            <FaPlus className="mr-2" />
            Add Campaign
          </button>
        </div>

        <div className="mb-6 bg-[#202020] p-4 rounded-lg border border-[#333]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="bg-[#333] border border-[#444] rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#555]"
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
            >
              <option value="">All Brands</option>
              {uniqueBrands.map((brand, index) => (
                <option key={index} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            <select
              className="bg-[#333] border border-[#444] rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-[#555]"
              value={filterDeadline}
              onChange={(e) => setFilterDeadline(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>

            <button
              onClick={resetFilters}
              className="bg-[#484848] hover:bg-[#5a5a5a] text-white py-2 px-4 rounded-lg transition-all duration-200"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="bg-[#202020] rounded-lg shadow-lg overflow-hidden border border-[#333]">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#333]">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Applicants
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    View Applicants
                  </th>
                  <th className="px-4 md:px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      {loading
                        ? "Loading..."
                        : "No campaigns match your filters"}
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((camp, index) => (
                    <tr
                      key={index}
                      className="hover:bg-[#2a2a2a] transition-colors duration-150"
                    >
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/admin/applicants/${camp.id}`}
                          className="font-medium"
                        >
                          {camp.campaignTitle}
                        </Link>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div>{camp.brandName}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div
                          className={
                            new Date(camp.deadline) < new Date()
                              ? "text-red-400"
                              : "text-green-400"
                          }
                        >
                          {camp.deadline.split("T")[0]}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/admin/applicants/${camp.id}`}
                          className="font-medium"
                        >
                          {camp.applicantsCount}
                        </Link>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <Link
                              to={`/admin/applicants/${camp.id}`}
                              className="
                                inline-flex items-center px-4 py-2
                                bg-indigo-600 text-white text-sm font-medium
                                rounded-md shadow-sm
                                hover:bg-indigo-700
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                transition
                              "
                              >
                              <AiOutlineEye className="h-5 w-5 mr-2" />
                              View Applicants
                              </Link>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            className="p-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-yellow-400 rounded-lg transition-all duration-200"
                            onClick={() => handleEdit(camp.id)}
                            title="Edit"
                            disabled={deleteLoading.get(camp.id)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="p-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-red-400 rounded-lg transition-all duration-200"
                            onClick={() => handleDelete(camp.id)}
                            title="Delete"
                            disabled={deleteLoading.get(camp.id)}
                          >
                            {deleteLoading.get(camp.id) ? (
                              <svg
                                className="animate-spin h-4 w-4 text-red-400 mx-auto"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : (
                              <FaTrashAlt />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {loading && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      Loading campaigns...
                    </td>
                  </tr>
                )}
                {!loading && loadMore && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      <button
                        onClick={getCampaigns}
                        className="bg-[#484848] hover:bg-[#5a5a5a] text-white py-2 px-4 rounded-lg transition-all duration-200"
                      >
                        Load More
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && <AddCampaign setShowModal={setShowModal} />}
      {editModel && (
        <EditCampaign setShowModal={setEditModel} index={editIndex} />
      )}
    </div>
  );
}

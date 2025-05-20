import React, { useEffect, useState } from "react";
import config from "../../config";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const ManualPointAdjust = () => {
  const [users, setUsers] = useState([]);
  const [editedPoints, setEditedPoints] = useState({});
  const [search, setSearch] = useState("");
  const token = Cookies.get("AdminToken") || localStorage.getItem("token");

  // Fetch all users with points
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${config.BACKEND_URL}/admin/referrel/points/users`, {
        headers: { authorization: token },
      });
      const data = await res.json();
      if (data.status === "success") setUsers(data.users);
      else toast.error("Failed to load users");
    } catch {
      toast.error("Server error while fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (userId) => {
    const newPoints = editedPoints[userId];
    if (newPoints === undefined) return;

    try {
      const res = await fetch(`${config.BACKEND_URL}/admin/referrel/points/user/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({
          points: Number(newPoints),
          note: "Manual adjustment via admin table",
        }),
      });

      const data = await res.json();
      if (data.status === "success") {
        toast.success("Points updated");
        setEditedPoints((prev) => ({ ...prev, [userId]: undefined }));
        fetchUsers(); // refresh list
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to update points");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">🎯 Manual Point Adjustment</h2>

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-gray-800 p-2 rounded w-full mb-4 text-white"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700">
          <thead>
            <tr className="bg-gray-900 text-left">
              <th className="p-2 border-b border-gray-700">Name</th>
              <th className="p-2 border-b border-gray-700">Email</th>
              <th className="p-2 border-b border-gray-700">Points</th>
              <th className="p-2 border-b border-gray-700">Joined</th>
              <th className="p-2 border-b border-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-400">No matching users found</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-t border-gray-800">
                  <td className="p-2">{user.name || "Unnamed"}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={
                        editedPoints[user._id] !== undefined
                          ? editedPoints[user._id]
                          : user.points
                      }
                      onChange={(e) =>
                        setEditedPoints((prev) => ({
                          ...prev,
                          [user._id]: e.target.value,
                        }))
                      }
                      className="bg-gray-700 p-1 rounded w-20 text-white"
                    />
                  </td>
                  <td className="p-2 text-sm text-gray-400">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleSave(user._id)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManualPointAdjust;

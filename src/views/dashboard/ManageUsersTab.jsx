import React, { useEffect, useState } from "react";
import userService from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

const ManageUsersTab = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await userService.getAllUsers();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await userService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex items-center justify-between gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full max-w-sm px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <span className="text-xs font-semibold text-gray-500">
          Total Users: <strong className="text-gray-900">{filteredUsers.length}</strong>
        </span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-14 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center text-xs text-gray-500">
          No users match your search.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Current Role</th>
                  <th className="px-6 py-4">Change Role</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => {
                  const isSelf = u._id === currentAdmin?._id;

                  return (
                    <tr key={u._id} className="hover:bg-gray-50/60 transition">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center uppercase text-[11px]">
                          {u.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 flex items-center gap-1.5">
                            {u.name}
                            {isSelf && (
                              <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md font-semibold">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Joined {new Date(u.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600 font-medium">{u.email}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] capitalize ${
                            u.role === "admin"
                              ? "bg-purple-50 text-purple-700"
                              : u.role === "seller"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <select
                          disabled={isSelf}
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer"
                        >
                          <option value="buyer">Buyer</option>
                          <option value="seller">Seller</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          disabled={isSelf}
                          onClick={() => handleDeleteUser(u._id)}
                          className="px-3 py-1.5 font-semibold text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-30 disabled:hover:bg-red-50 rounded-lg transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsersTab;
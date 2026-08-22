"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    useEffect(() => {
        // Authenticate locally
        const token = localStorage.getItem("accessToken");
        const userDataStr = localStorage.getItem("user");

        if (!token || !userDataStr) {
            router.push("/login");
            return;
        }

        const userData = JSON.parse(userDataStr);
        setCurrentUser(userData);

        if (userData.role === "ADMIN") {
            // Fetch all users for Admin
            const fetchUsers = async () => {
                try {
                    const response = await fetch("http://localhost:5000/api/v1/users", {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    });

                    if (response.status === 401 || response.status === 403) {
                        setError("Unauthorized: You do not have permissions to view this resource. ADMIN role is required.");
                        setLoading(false);
                        return;
                    }

                    if (!response.ok) {
                        throw new Error(`Error: ${response.statusText}`);
                    }

                    const result = await response.json();
                    if (result.success && Array.isArray(result.data)) {
                        setUsers(result.data);
                    } else if (result.success && result.data.users) {
                        setUsers(result.data.users);
                    } else {
                        throw new Error("Invalid response format from server");
                    }
                } catch (err) {
                    console.error("Failed to fetch users:", err);
                    setError(err.message || "Failed to load users list.");
                } finally {
                    setLoading(false);
                }
            };

            fetchUsers();
        } else {
            // Fetch own profile for User
            const fetchProfile = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/v1/users/${userData.id}`, {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    });

                    if (response.status === 401 || response.status === 403) {
                        setError("Unauthorized: You do not have permission to view this profile.");
                        setLoading(false);
                        return;
                    }

                    if (!response.ok) {
                        throw new Error(`Error: ${response.statusText}`);
                    }

                    const result = await response.json();
                    if (result.success && result.data) {
                        setProfileData(result.data);
                    } else {
                        throw new Error("Invalid response format from server");
                    }
                } catch (err) {
                    console.error("Failed to fetch profile:", err);
                    setError(err.message || "Failed to load profile.");
                } finally {
                    setLoading(false);
                }
            };

            fetchProfile();
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        router.push("/login");
    };

    // Filter users list based on search and role (Admin only)
    const filteredUsers = users.filter((u) => {
        const matchesSearch = 
            (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
        
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.15),transparent_40%)]" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <svg className="animate-spin h-10 w-10 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-zinc-400 font-medium">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-center items-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.08),transparent_40%)]" />
                <div className="relative z-10 max-w-md w-full bg-zinc-900/60 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-red-500 mb-3">Access Denied</h2>
                    <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <button onClick={handleLogout} className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl transition font-medium text-sm">
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] relative overflow-hidden font-sans pb-12">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px] animate-pulse" style={{ animationDuration: '12s' }}></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-10 border-b border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="9" y1="9" x2="15" y2="9"></line>
                                <line x1="9" y1="13" x2="15" y2="13"></line>
                            </svg>
                        </div>
                        <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">Task Manager</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {currentUser && (
                            <div className="hidden sm:flex flex-col text-right">
                                <span className="text-sm font-semibold text-zinc-200">{currentUser.name}</span>
                                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{currentUser.role}</span>
                            </div>
                        )}
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl transition text-sm font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10">
                {currentUser?.role === "ADMIN" ? (
                    /* ADMIN VIEW: User Management Dashboard */
                    <>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                                    User Management
                                </h1>
                                <p className="text-zinc-400 text-sm mt-1">
                                    Monitor, search, and manage registered roles across your system.
                                </p>
                            </div>

                            {/* Stats overview */}
                            <div className="flex gap-4">
                                <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl py-3 px-6 shadow-xl flex items-center gap-4">
                                    <div className="p-2.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Total Users</p>
                                        <p className="text-2xl font-bold text-zinc-100 mt-0.5">{users.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filter and Search Bar */}
                        <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
                            <div className="relative w-full sm:flex-1">
                                <svg className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-xl py-2.5 pl-11 pr-4 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/80 transition"
                                />
                            </div>
                            
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <span className="text-xs text-zinc-500 font-medium uppercase whitespace-nowrap">Filter Role:</span>
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="w-full sm:w-auto bg-zinc-950/60 border border-zinc-800/80 rounded-xl px-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-violet-500/80 transition"
                                >
                                    <option value="ALL">All Roles</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="USER">User</option>
                                </select>
                            </div>
                        </div>

                        {/* Users List Table */}
                        <div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/60 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-zinc-800/80 bg-zinc-950/20 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                                            <th className="py-4 px-6">User Info</th>
                                            <th className="py-4 px-6">Role</th>
                                            <th className="py-4 px-6">User ID</th>
                                            <th className="py-4 px-6">Joined Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/40 text-sm">
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-zinc-800/20 transition-colors group">
                                                    <td className="py-4 px-6 flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold border border-zinc-700/60 group-hover:border-violet-500/40 transition">
                                                            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-zinc-200 group-hover:text-white transition">{user.name || "N/A"}</span>
                                                            <span className="text-zinc-500 text-xs mt-0.5">{user.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                            user.role === "ADMIN" 
                                                                ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" 
                                                                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-zinc-500 font-mono text-xs">{user.id}</td>
                                                    <td className="py-4 px-6 text-zinc-400">
                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        }) : "N/A"}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="py-12 text-center text-zinc-500 font-medium">
                                                    No users matched search criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    /* USER VIEW: Personalized User Profile Dashboard */
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                                Welcome, {profileData?.name || currentUser?.name}!
                            </h1>
                            <p className="text-zinc-400 text-sm mt-1">
                                View your account details, session activity, and configurations.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Profile Details Card */}
                            <div className="md:col-span-2 bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 to-transparent pointer-events-none"></div>
                                
                                <div>
                                    <div className="flex items-center gap-5 mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-violet-500/20">
                                            {profileData?.name ? profileData.name.charAt(0).toUpperCase() : "?"}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-zinc-100">{profileData?.name}</h2>
                                            <div className="flex gap-2 items-center mt-1">
                                                <span className="text-zinc-400 text-sm">{profileData?.email}</span>
                                                <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
                                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    {profileData?.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-zinc-800/60 pt-6 grid grid-cols-2 gap-y-6 gap-x-4">
                                        <div>
                                            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Account ID</p>
                                            <p className="text-sm font-mono text-zinc-200 mt-1">{profileData?.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Status</p>
                                            <p className="text-sm font-semibold text-emerald-400 mt-1 flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                                                Active
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Member Since</p>
                                            <p className="text-sm text-zinc-200 mt-1">
                                                {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) : "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Last Login</p>
                                            <p className="text-sm text-zinc-200 mt-1">Just now</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-zinc-800/60 flex flex-wrap gap-4">
                                    <button className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition font-medium text-sm shadow-lg shadow-violet-500/15">
                                        Edit Profile
                                    </button>
                                    <button className="px-5 py-2.5 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl transition font-medium text-sm">
                                        Account Settings
                                    </button>
                                </div>
                            </div>

                            {/* Info Spec Card */}
                            <div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                                <div>
                                    <h3 className="font-bold text-zinc-200 mb-4 text-sm uppercase tracking-wider">System Integration</h3>
                                    <div className="space-y-4">
                                        <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/80">
                                            <p className="text-xs text-zinc-500 font-semibold uppercase">Security Level</p>
                                            <p className="text-xs font-mono text-zinc-300 mt-1">Standard USER Clearance</p>
                                        </div>
                                        <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/80">
                                            <p className="text-xs text-zinc-500 font-semibold uppercase">Scope Restrictions</p>
                                            <p className="text-xs text-amber-500/90 font-medium mt-1 leading-relaxed">
                                                Only authorized to view and modify your own tasks and profile details.
                                            </p>
                                        </div>
                                        <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/80">
                                            <p className="text-xs text-zinc-500 font-semibold uppercase">Verification Status</p>
                                            <p className="text-xs text-zinc-400 font-mono mt-1 break-all">JWT Signature Verified</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 text-center text-xs text-zinc-600 font-medium">
                                    Secure Connection Valid
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

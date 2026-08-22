"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function UserProfilePage() {
    const router = useRouter();
    const params = useParams();
    const userId = params.id;

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const userDataStr = localStorage.getItem("user");

        if (!token || !userDataStr) {
            router.push("/login");
            return;
        }

        const userData = JSON.parse(userDataStr);
        setCurrentUser(userData);

        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/users/${userId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.status === 401 || response.status === 403) {
                    setError("Access Denied: You do not have permission to view this user's profile.");
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
    }, [router, userId]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.15),transparent_40%)]" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <svg className="animate-spin h-10 w-10 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-zinc-400 font-medium">Loading Profile...</p>
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
                        <Link href="/users" className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl transition font-medium text-sm">
                            Back to Dashboard
                        </Link>
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
                    <Link href="/users" className="flex items-center gap-3 hover:opacity-90 transition">
                        <div className="w-9 h-9 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="9" y1="9" x2="15" y2="9"></line>
                                <line x1="9" y1="13" x2="15" y2="13"></line>
                            </svg>
                        </div>
                        <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">Task Manager</span>
                    </Link>

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

            <main className="relative z-10 max-w-4xl mx-auto px-6 pt-10">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                            User Profile Detail
                        </h1>
                        <p className="text-zinc-400 text-sm mt-1">
                            Detailed account details for User ID: {userId}.
                        </p>
                    </div>
                    {currentUser?.role === "ADMIN" && (
                        <Link href="/users" className="px-4 py-2 bg-zinc-900/60 hover:bg-zinc-800/85 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl transition text-sm font-medium">
                            ← Back to Dashboard
                        </Link>
                    )}
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
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                            profileData?.role === "ADMIN" 
                                                ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" 
                                                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                        }`}>
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
                                    <p className="text-sm text-zinc-200 mt-1">Recently</p>
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
                            <h3 className="font-bold text-zinc-200 mb-4 text-sm uppercase tracking-wider">Security Access</h3>
                            <div className="space-y-4">
                                <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/80">
                                    <p className="text-xs text-zinc-500 font-semibold uppercase">Profile Target ID</p>
                                    <p className="text-xs font-mono text-zinc-300 mt-1">User ID: {profileData?.id}</p>
                                </div>
                                <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/80">
                                    <p className="text-xs text-zinc-500 font-semibold uppercase">Clearance Check</p>
                                    <p className="text-xs text-emerald-400 font-medium mt-1 leading-relaxed">
                                        Access verified by ownership validation middleware policies.
                                    </p>
                                </div>
                                <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/80">
                                    <p className="text-xs text-zinc-500 font-semibold uppercase">Token Info</p>
                                    <p className="text-xs text-zinc-400 font-mono mt-1 break-all">Active Session Authorization</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-center text-xs text-zinc-600 font-medium">
                            Secure Client Access
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
